import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "../ui/Loading";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { motion, AnimatePresence } from "framer-motion";

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

const MealsByCategory = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  const {
    data: meals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals", "category", category],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(
          `/meals/category/${category}?limit=3`
        );
        return data;
      } catch (error) {
        console.error("Error fetching meals:", error);
        throw new Error("Failed to fetch meals");
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const categories = [
    { id: "all", label: "All Meals" },
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading meals: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2 flex-wrap"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={category === cat.id ? "default" : "outline"}
              onClick={() => setCategory(cat.id)}
              className="px-6"
            >
              {cat.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Meal Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {meals.map((meal, index) => (
            <motion.div
              key={meal._id}
              variants={itemVariants}
              layout
              className="h-full"
            >
              <Card className="overflow-hidden group h-full flex flex-col">
                <motion.div
                  className="relative h-48"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-medium">
                        {meal.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
                <div className="p-4 flex-1 flex flex-col">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="font-semibold text-lg mb-2 line-clamp-1"
                  >
                    {meal.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.3 }}
                    className="text-muted-foreground line-clamp-2 mb-4 flex-1"
                  >
                    {meal.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.4 }}
                    className="flex items-center justify-between mt-auto"
                  >
                    <span className="font-semibold text-lg">
                      ${(meal.price || 0).toFixed(2)}
                    </span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/meal/${meal._id}`)}
                      >
                        View Details
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/meals")}
          className="px-8"
        >
          View All Meals
        </Button>
      </div>
    </div>
  );
};

export default MealsByCategory;
