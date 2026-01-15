/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAxiosURL from "@/hooks/useAxiosURL";
import { Button } from "@/components/ui/button";
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
import LoadingSpinner from "@/components/ui/Loading";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosURL();
  const [axiosSecure] = useAxiosSecurity();
  const queryClient = useQueryClient();

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

  // Fetch meal data
  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  // Update form when meal data is loaded
  useEffect(() => {
    if (meal) {
      form.reset({
        title: meal.title,
        category: meal.category,
        price: meal.price.toString(),
        description: meal.description,
        ingredients: meal.ingredients.join(", "),
        distributor_name: meal.distributor_name,
        distributor_email: meal.distributor_email,
      });
    }
  }, [meal, form]);

  // Update meal mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = meal.image;

      // Upload new image if provided
      if (data.image?.[0]) {
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
          throw new Error("Image upload failed!");
        }
        imageUrl = imageResponse.data.data.url;
      }

      const mealData = {
        title: data.title,
        category: data.category,
        price: parseFloat(data.price),
        description: data.description,
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        image: imageUrl,
        distributor_name: data.distributor_name,
        distributor_email: data.distributor_email,
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.patch(`/meals/${id}`, mealData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["meal", id]);
      toast.success("Meal updated successfully!");
      navigate(`/meal/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update meal");
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <LoadingSpinner />;

  // Check if user is the distributor
  if (meal && meal.distributor_email !== user?.email) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized</h2>
        <p className="mt-2">You are not authorized to edit this meal.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Update Meal</h2>
        <Button variant="outline" onClick={() => navigate(`/meal/${id}`)}>
          Cancel
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <SelectItem value="snacks">Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid price",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
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
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Leave empty to keep existing image
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distributor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distributor_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              rules={{ required: "Ingredients are required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter ingredients separated by commas"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full md:w-auto"
              >
                {updateMutation.isPending ? "Updating..." : "Update Meal"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateMeal;
