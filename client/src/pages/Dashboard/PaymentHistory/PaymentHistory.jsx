import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/Loading";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package } from "lucide-react";
import useAxiosSecurity from "@/hooks/axiosSecurity";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Payments Found</h2>
        <p className="text-muted-foreground">
          You haven&lsquo;t made any payments yet. Purchase a membership package
          to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Payment History</h2>
        <p className="text-muted-foreground">
          View all your past payments and membership upgrades
        </p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment, index) => (
          <motion.div
            key={payment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-lg shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {payment.package}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(payment.date), "PPP")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${payment.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID: {payment.transactionId.slice(-6)}
                  </p>
                </div>

                <Badge
                  variant={payment.status === "paid" ? "success" : "secondary"}
                  className="capitalize"
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
