import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAuth from "@/hooks/useAuth";
import { Button } from "./button";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const [error, setError] = useState("");
  const { state } = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [axiosSecurity] = useAxiosSecurity();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = state?.package?.price;

  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecurity
        .post("/create-payment-intent", { price: totalPrice })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecurity, totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    try {
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      // confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user?.displayName || "anonymous",
            },
          },
        });

      if (confirmError) {
        setError(confirmError.message);
        toast.error(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        const payment = {
          email: user.email,
          price: totalPrice,
          photo: user?.photoURL,
          name: user?.displayName,
          transactionId: paymentIntent.id,
          package: state?.package?.id,
          date: new Date(),
          status: "padding",
        };

        const res = await axiosSecurity.post("/payments", payment);
        if (res.data?.paymentResult?.insertedId) {
          toast.success("Payment completed successfully!");
          navigate("/dashboard/payment-history");
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error("An error occurred during payment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {state?.package && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Package Details</h3>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="font-semibold text-lg">{state.package.name}</p>
            <p className="text-2xl font-bold text-primary">
              ${state.package.price}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Card Information</label>
          <div className="border rounded-lg p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    padding: "10px 0",
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? "Processing..." : `Pay $${totalPrice}`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
