/* eslint-disable react/prop-types */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/ui/Loading";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const AllMeals = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();
  const limit = 10;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data: { meals = [], totalPages = 0 } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["meals", sortBy, currentPage, debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/meals?sort=${sortBy}&page=${currentPage}&limit=${limit}&search=${debouncedSearch}`
      );
      return res.data;
    },
  });

  const handleDelete = async (id) => {
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
        const res = await axiosSecure.delete(`/meals/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          toast.success("Meal deleted successfully!");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete meal");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const MealActions = ({ meal }) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/meal/${meal._id}`)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/update-meal/${meal._id}`)}
        title="Edit Meal"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(meal._id)}
        title="Delete Meal"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">All Meals</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/add-meal")}
          >
            Add New Meal
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setViewMode("table")}>
                  Table View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("grid")}>
                  Grid View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Section */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Distributor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals?.map((meal) => (
                  <TableRow key={meal._id}>
                    <TableCell className="font-medium">{meal.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{meal.category}</Badge>
                    </TableCell>
                    <TableCell>${meal.price}</TableCell>
                    <TableCell>{meal.likes}</TableCell>
                    <TableCell>{meal.reviews_count}</TableCell>
                    <TableCell>
                      <Badge
                        variant={meal.rating >= 4 ? "default" : "secondary"}
                      >
                        {meal.rating.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{meal.distributor_name}</TableCell>
                    <TableCell className="text-right">
                      <MealActions meal={meal} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals?.map((meal) => (
              <Card key={meal._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{meal.title}</CardTitle>
                      <CardDescription>{meal.category}</CardDescription>
                    </div>
                    <Badge variant={meal.rating >= 4 ? "default" : "secondary"}>
                      {meal.rating.toFixed(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Price: ${meal.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By {meal.distributor_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{meal.likes} likes</Badge>
                        <Badge variant="outline">
                          {meal.reviews_count} reviews
                        </Badge>
                      </div>
                    </div>
                    <MealActions meal={meal} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
    </div>
  );
};

export default AllMeals;
