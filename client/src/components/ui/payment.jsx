import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CreditCard, Shield, Lock } from "lucide-react";
import CheckoutForm from "./checkout";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const securityFeatures = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure Payment",
    description: "Your payment information is encrypted and secure",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Privacy Protected",
    description: "We never store your card details",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Safe Transaction",
    description: "Protected by Stripe's advanced security",
  },
];

const Payment = () => {
  return (
    <div className="min-h-[80vh] py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Secure Payment
            </h1>
            <p className="text-muted-foreground">
              Complete your membership purchase securely
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Secure Payment Process
                  </h3>
                  <div className="space-y-4">
                    {securityFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Payment Protection</span>
                  </div>
                  <p className="text-sm text-blue-600/80">
                    Your payment is protected by Stripe&rsquo;s advanced
                    security system. We use industry-standard encryption to keep
                    your data safe.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
