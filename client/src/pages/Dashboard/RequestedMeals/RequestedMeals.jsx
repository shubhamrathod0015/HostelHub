import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/Loading";

const RequestedMeals = () => {
  const [axiosSecure] = useAxiosSecurity();

  const {
    data: requestedMeals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["requestedMeals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meal-requests");
      return res.data;
    },
  });

  const handleCancelRequest = async (id) => {
    try {
      await axiosSecure.delete(`/meal-requests/${id}`);
      toast.success("Meal request cancelled successfully");
      refetch();
    } catch (error) {
      toast.error(error.message || "Failed to cancel meal request");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Requested Meals</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Title</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Reviews</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestedMeals.map((meal) => (
              <TableRow key={meal._id}>
                <TableCell>{meal.title}</TableCell>
                <TableCell className="text-center">{meal.likes}</TableCell>
                <TableCell className="text-center">
                  {meal.reviews_count}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      meal.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : meal.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {meal.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelRequest(meal._id)}
                    disabled={meal.status !== "pending"}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RequestedMeals;
