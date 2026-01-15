import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { Edit2, Eye, Loader2, Star, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const MyReviews = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch user reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["my-reviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${user.email}`);
      return res.data;
    },
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await axiosSecure.delete(`/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-reviews"]);
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  // Update review mutation
  const updateMutation = useMutation({
    mutationFn: async ({ reviewId, data }) => {
      const res = await axiosSecure.patch(`/reviews/${reviewId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-reviews"]);
      setIsEditModalOpen(false);
      toast.success("Review updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(reviewId);
      }
    });
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
    reset({
      rating: review.rating,
      review: review.text,
    });
  };

  const onSubmit = (data) => {
    if (!selectedReview) return;

    updateMutation.mutate({
      reviewId: selectedReview._id,
      data: {
        rating: parseFloat(data.rating),
        review: data.review,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Image</TableHead>
              <TableHead>Meal Title</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>
                  <img
                    src={review.image}
                    alt={review.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{review.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{review.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2">{review.text}</p>
                </TableCell>
                <TableCell>{review.likes || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Link to={`/meal/${review.meal_id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEdit(review)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(review._id)}
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {reviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven&#39;t written any reviews yet
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                {...register("rating")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Review</label>
              <Textarea
                className="resize-none"
                rows={4}
                {...register("review")}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isLoading}>
                {updateMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReviews;
