import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { Eye, Loader2, Star, Trash2, User } from "lucide-react";
import Swal from "sweetalert2";

const AllReviews = () => {
  const [axiosSecure] = useAxiosSecurity();
  const queryClient = useQueryClient();

  // Fetch all reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews");
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
      queryClient.invalidateQueries(["all-reviews"]);
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">All Reviews</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Image</TableHead>
              <TableHead>Meal Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Reviews Count</TableHead>
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
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {review.user_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {review.user_email}
                      </span>
                    </div>
                  </div>
                </TableCell>
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
                <TableCell>{review.reviews_count || 0}</TableCell>
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
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No reviews found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllReviews;
