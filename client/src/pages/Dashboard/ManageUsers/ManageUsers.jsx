import { useState } from "react";
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
import { ChevronLeft, ChevronRight, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/ui/Loading";

const ManageUsers = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: { users = [], totalPages = 0 } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
  });

  const handleMakeAdmin = async (user) => {
    const res = await axiosSecure.patch(`/users/admin/${user?._id}`);
    if (res.data.modifiedCount > 0) {
      refetch();
      toast.success(`${user?.name} is now an Admin!`);
    }
  };

  const handleDelete = async (user) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/users/${user?._id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          toast.success("User deleted successfully!");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "user"}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMakeAdmin(user)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            variant={currentPage === index + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ManageUsers;
