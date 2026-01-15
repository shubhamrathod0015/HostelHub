import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/Loading";

const ServeMeals = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  // Fetch all meal requests with search
  const { data: mealRequests = [], isLoading } = useQuery({
    queryKey: ["mealRequests", debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(`/serve-meals?search=${debouncedSearch}`);
      return res.data;
    },
  });

  // Serve meal mutation
  const serveMealMutation = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosSecure.patch(`/serve-meals/${requestId}`, {
        status: "delivered",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mealRequests"]);
      toast.success("Meal served successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to serve meal");
    },
  });

  const handleServe = (requestId) => {
    serveMealMutation.mutate(requestId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Serve Meals</h2>
        <div className="relative w-72">
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Title</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mealRequests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.user_email}</TableCell>
                <TableCell>{request.user_name}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleServe(request._id)}
                    disabled={
                      request.status === "delivered" ||
                      serveMealMutation.isPending
                    }
                  >
                    Serve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {mealRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No meal requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServeMeals;
