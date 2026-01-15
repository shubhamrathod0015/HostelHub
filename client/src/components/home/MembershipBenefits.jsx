import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const benefits = [
  {
    title: "Priority Meal Selection",
    description: "Get early access to daily meal selections and special items.",
    icon: "⭐",
  },
  {
    title: "Exclusive Discounts",
    description: "Enjoy special discounts on premium meals and packages.",
    icon: "💰",
  },
  {
    title: "Dietary Preferences",
    description: "Customize your meal plans according to your dietary needs.",
    icon: "🥗",
  },
  {
    title: "Community Events",
    description: "Join exclusive dining events and food tasting sessions.",
    icon: "🎉",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const MembershipBenefits = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Membership Benefits
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-3xl group-hover:scale-110 transition-transform"
              >
                {benefit.icon}
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="px-8 hover:scale-105 transition-transform"
          >
            Join Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipBenefits;
