import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, ChefHat, Timer, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import useAxiosSecurity from "@/hooks/axiosSecurity";

const UpcomingFood = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();
  const queryClient = useQueryClient();

  // Fetch upcoming meals and user subscription
  const { data: upcomingMeals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ["upcoming-meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data;
    },
  });

  const { data: userSubscription = {}, isLoading: subscriptionLoading } =
    useQuery({
      queryKey: ["user-subscription", user?.email],
      queryFn: async () => {
        const res = await axiosSecure.get(`/users/${user.email}`);
        return res.data.subscription;
      },
      enabled: !!user?.email,
    });

  // Like meal mutation
  const likeMutation = useMutation({
    mutationFn: async ({ mealId, action }) => {
      const endpoint = action === "like" ? "like" : "unlike";
      const res = await axiosSecure.post(
        `/upcoming-meals/${endpoint}/${mealId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["upcoming-meals"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update like");
    },
  });

  const handleLikeClick = (meal) => {
    if (!user) {
      toast.error("Please login to like meals");
      return;
    }

    if (!isPremiumUser) {
      toast.error(
        "Only premium users (Silver/Gold/Platinum) can like upcoming meals"
      );
      return;
    }

    const action = meal.likedBy?.includes(user.email) ? "unlike" : "like";
    likeMutation.mutate({ mealId: meal._id, action });
  };

  const isPremiumUser = ["silver", "gold", "platinum"].includes(
    userSubscription
  );

  if (mealsLoading || subscriptionLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {!isPremiumUser && (
        <div className="mb-6 bg-primary/5 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-primary w-5 h-5" />
          <p className="text-sm">
            Upgrade to a premium membership (Silver/Gold/Platinum) to like
            upcoming meals!{" "}
            <Button variant="link" className="p-0 h-auto" asChild>
              <a href="/membership">Upgrade Now</a>
            </Button>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingMeals.map((meal, index) => (
          <motion.div
            key={meal._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-95 transition-opacity duration-200"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 backdrop-blur-sm text-white border-0"
                    >
                      <Timer className="w-4 h-4 mr-1" />
                      Upcoming
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {meal.title}
                    </h3>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {meal.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-primary"
                            onClick={() => handleLikeClick(meal)}
                            disabled={likeMutation.isLoading}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                meal.likedBy?.includes(user?.email)
                                  ? "fill-primary text-primary"
                                  : ""
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!user
                            ? "Login to like meals"
                            : !isPremiumUser
                            ? "Premium users only"
                            : meal.likedBy?.includes(user.email)
                            ? "Unlike meal"
                            : "Like meal"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-sm font-medium">
                      {meal.likes || 0}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {meal.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {meal.distributor_name}
                    </span>
                  </div>
                  <p className="font-semibold">${meal.price}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {upcomingMeals.length === 0 && (
        <div className="text-center py-12">
          <Timer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Upcoming Meals</h3>
          <p className="text-muted-foreground">
            Check back later for new upcoming meals
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingFood;
