/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { useDebounce } from "@/hooks/useDebounce";
import InfiniteScroll from "react-infinite-scroller";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import LoadingSpinner from "@/components/ui/Loading";
import MealCard from "@/components/ui/meal-card";

const Meals = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [meals, setMeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 6;

  const debouncedSearch = useDebounce(searchTerm, 100);

  // Fetch initial data and metadata
  const { data: metadata = {}, isLoading: isMetadataLoading } = useQuery({
    queryKey: ["meals-metadata"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals?page=1&limit=1");
      return {
        categories: res.data.categories,
        priceRange: res.data.priceRange,
      };
    },
  });

  const [priceRange, setPriceRange] = useState([
    metadata?.priceRange?.minPrice || 0,
    metadata?.priceRange?.maxPrice || 1000,
  ]);

  // Update price range when metadata loads
  useEffect(() => {
    if (metadata?.priceRange) {
      setPriceRange([
        metadata.priceRange.minPrice,
        metadata.priceRange.maxPrice,
      ]);
    }
  }, [metadata]);

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, [debouncedSearch, selectedCategory, priceRange]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosSecure.get("/meals", {
        params: {
          search: debouncedSearch,
          category: selectedCategory === "All" ? "" : selectedCategory,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page: 1,
          limit: ITEMS_PER_PAGE,
        },
      });

      setMeals(res.data.meals);
      setHasMore(res.data.meals.length === ITEMS_PER_PAGE);
      setPage(2);
    } catch (err) {
      setError("Failed to load meals. Please try again.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosSecure.get("/meals", {
        params: {
          search: debouncedSearch,
          category: selectedCategory === "All" ? "" : selectedCategory,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page,
          limit: ITEMS_PER_PAGE,
        },
      });

      const newMeals = res.data.meals;
      setMeals((prevMeals) => [...prevMeals, ...newMeals]);
      setHasMore(newMeals.length === ITEMS_PER_PAGE);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError("Failed to load more meals. Please try again.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMetadataLoading) return <LoadingSpinner />;

  const {
    categories = [],
    priceRange: { minPrice = 0, maxPrice = 1000 } = {},
  } = metadata;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters section */}
      <div className="bg-muted/50 p-6 rounded-lg mb-8 space-y-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Find Your Perfect Meal</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {meals.length} meals found
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore && !isLoading}
        loader={
          <div className="text-center py-4" key={0}>
            <LoadingSpinner />
          </div>
        }
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} />
        ))}
      </InfiniteScroll>

      {!hasMore && meals.length > 0 && (
        <p className="text-center text-gray-500 mt-4">No more meals to load</p>
      )}

      {!isLoading && meals.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No meals found matching your criteria
        </p>
      )}
    </div>
  );
};

export default Meals;
