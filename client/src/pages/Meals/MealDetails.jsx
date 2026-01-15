import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Heart,
  MessageCircle,
  Clock,
  ChefHat,
  DollarSign,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/Loading";
import toast from "react-hot-toast";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAuth from "@/hooks/useAuth";

const MealDetails = () => {
  const { id } = useParams();
  const [axiosSecure] = useAxiosSecurity();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Fetch meal details
  const { data: meal = {}, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/meals/like/${id}`, {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["meal", id]);
      toast.success("Meal liked successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to like meal");
    },
  });

  // Request meal mutation
  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/meal-requests`, meal);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Meal requested successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to request meal");
    },
  });
  // Add review mutation
  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/meals/reviews/${id}`, {
        text: reviewText,
        rating,
        title: meal?.title,
        likes: meal?.likes,
        reviews_count: meal?.reviews_count,
        image: meal?.image,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["meal", id]);
      setShowReviewDialog(false);
      setReviewText("");
      setRating(5);
      toast.success("Review added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add review");
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like meals");
      return;
    }
    likeMutation.mutate();
  };

  const handleRequest = () => {
    if (!user) {
      toast.error("Please login to request meals");
      return;
    }
    requestMutation.mutate();
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add reviews");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    reviewMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Actions */}
        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={meal.image}
              alt={meal.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">
                  {meal.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 gap-2"
              variant={meal.liked ? "default" : "outline"}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <Heart className={meal.liked ? "fill-current" : ""} />
              {meal.likes} {meal.likes === 1 ? "Like" : "Likes"}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleRequest}
              disabled={requestMutation.isPending}
            >
              Request Meal
            </Button>
          </div>

          {/* Reviews Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <Dialog
                open={showReviewDialog}
                onOpenChange={setShowReviewDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your thoughts about this meal
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleReview} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Rating</label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Your Review</label>
                      <Textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={reviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {meal.reviews?.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{review.text}</p>
                </div>
              ))}

              {meal.reviews?.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{meal.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{meal.category}</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-4 w-4" />
                {new Date(meal.created_at).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">By {meal.distributor_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">${meal.price}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-muted-foreground">{meal.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients?.map((ingredient, index) => (
                <Badge key={index} variant="outline">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
