/* eslint-disable no-unused-vars */
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosURL from "@/hooks/useAxiosURL";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpcomingMeals = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();
  const axiosPublic = useAxiosURL();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch upcoming meals
  const { data: upcomingMeals = [], isLoading } = useQuery({
    queryKey: ["upcoming-meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data;
    },
  });

  // Publish meal mutation
  const publishMutation = useMutation({
    mutationFn: async (meal) => {
      const res = await axiosSecure.post("/meals", {
        ...meal,
        createdAt: new Date().toISOString(),
      });
      if (res.data.insertedId) {
        await axiosSecure.delete(`/upcoming-meals/${meal._id}`);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["upcoming-meals"]);
      toast.success("Meal published successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish meal");
    },
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

  // Add meal form
  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      price: "",
      description: "",
      ingredients: "",
      image: null,
      distributor_name: user?.displayName || "",
      distributor_email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Upload image to ImageBB
      const imageFile = { image: data.image[0] };
      const imageResponse = await axiosPublic.post(
        image_hosting_api,
        imageFile,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      if (!imageResponse?.data?.success) {
        toast.error("Image upload failed!");
        return;
      }

      const mealData = {
        title: data.title,
        category: data.category,
        price: parseFloat(data.price),
        description: data.description,
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        image: imageResponse?.data?.data?.url,
        distributor_name: data.distributor_name,
        distributor_email: data.distributor_email,
        rating: 0,
        likes: 0,
        reviews_count: 0,
      };

      const res = await axiosSecure.post("/upcoming-meals", mealData);
      if (res.data.insertedId) {
        toast.success("Upcoming meal added successfully!");
        form.reset();
        setIsModalOpen(false);
        queryClient.invalidateQueries(["upcoming-meals"]);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add upcoming meal");
    }
  };

  const handleLikeClick = (meal) => {
    const action = meal.likedBy?.includes(user.email) ? "unlike" : "like";
    likeMutation.mutate({ mealId: meal._id, action });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Meals</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add Upcoming Meal</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Upcoming Meal</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Meal title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Meal price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    rules={{ required: "Image is required" }}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ingredients"
                  rules={{ required: "Ingredients are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rice, Chicken, Vegetables"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Meal description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Add Upcoming Meal
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingMeals
              .sort((a, b) => b.likes - a.likes)
              .map((meal) => (
                <TableRow key={meal._id}>
                  <TableCell>
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{meal.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {meal.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${meal.price}</TableCell>
                  <TableCell>{meal.likes || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary"
                        onClick={() => handleLikeClick(meal)}
                        disabled={likeMutation.isLoading}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            meal.likedBy?.includes(user.email)
                              ? "fill-primary text-primary"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => publishMutation.mutate(meal)}
                        disabled={publishMutation.isLoading}
                      >
                        {publishMutation.isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          "Publish"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpcomingMeals;
