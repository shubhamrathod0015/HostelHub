/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import useAxiosSecurity from "@/hooks/axiosSecurity";
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
import toast from "react-hot-toast";
import useAxiosURL from "@/hooks/useAxiosURL";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddMeal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosURL();
  const [axiosSecure] = useAxiosSecurity();
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
        createdAt: new Date().toISOString(),
      };
      const res = await axiosSecure.post("/meals", mealData);
      if (res.data.insertedId) {
        toast.success("Meal added successfully!");
        form.reset();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add meal");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Add New Meal</h2>
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
                rules={{ required: "Image is required" }}
                render={({ field: { onChange, value, ...field } }) => (
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

              <FormField
                control={form.control}
                name="distributor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={user?.displayName || ""}
                        readOnly
                      />
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
                      <Input {...field} value={user?.email || ""} readOnly />
                    </FormControl>
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
                    <Input placeholder="Rice, Chicken, Vegetables" {...field} />
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
                      placeholder="Enter meal description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add Meal
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddMeal;
