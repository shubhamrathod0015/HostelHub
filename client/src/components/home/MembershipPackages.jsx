import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";

const packages = [
  {
    id: "silver",
    title: "Silver Package",
    price: 29.99,
    color: "bg-gradient-to-br from-gray-100 to-gray-300",
    features: [
      "3 Premium Meals per Week",
      "10% Discount on All Orders",
      "Early Access to Special Menus",
      "Weekly Menu Updates",
      "Basic Support",
    ],
  },
  {
    id: "gold",
    title: "Gold Package",
    price: 49.99,
    color: "bg-gradient-to-br from-yellow-100 to-yellow-300",
    popular: true,
    features: [
      "5 Premium Meals per Week",
      "15% Discount on All Orders",
      "Priority Access to Special Menus",
      "Daily Menu Updates",
      "Priority Support",
      "Exclusive Events Access",
    ],
  },
  {
    id: "platinum",
    title: "Platinum Package",
    price: 79.99,
    color: "bg-gradient-to-br from-slate-700 to-slate-900",
    features: [
      "Unlimited Premium Meals",
      "25% Discount on All Orders",
      "VIP Access to Special Menus",
      "Real-time Menu Updates",
      "24/7 VIP Support",
      "Exclusive Events Access",
      "Personal Meal Planning",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const MembershipPackages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePackageSelect = (pkg) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to purchase a membership package",
      });
      navigate("/login");
      return;
    }

    // Navigate to checkout with package details
    navigate(`/checkout/${pkg.id}`, {
      state: {
        package: {
          name: pkg.title,
          price: pkg.price,
          id: pkg.id,
          features: pkg.features,
        },
      },
    });
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Membership Packages</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect membership package and enjoy exclusive benefits,
            discounts, and premium features.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={itemVariants}
              className="relative"
            >
              {pkg.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`h-full rounded-2xl p-8 ${pkg.color} ${
                  pkg.id === "platinum" ? "text-white" : "text-gray-900"
                } shadow-xl flex flex-col`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-sm opacity-75">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5 shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full"
                    variant={pkg.id === "platinum" ? "secondary" : "default"}
                    size="lg"
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    Choose {pkg.title}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipPackages;
