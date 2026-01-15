/* eslint-disable react/prop-types */
import { Badge, Heart, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Link } from "react-router";
import { Button } from "./button";

const MealCard = ({ meal }) => (
  <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="flex-none p-0">
      <div className="relative">
        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-95 transition-opacity duration-200"
        />
        <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-medium">
              {meal.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
              {meal.title}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              {meal.category}
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col justify-between pt-2">
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {meal.description}
      </p>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-primary">${meal.price}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart className="h-3 w-3" /> {meal.likes}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> {meal.reviews_count}
            </Badge>
          </div>
        </div>
        <Link to={`/meal/${meal._id}`}>
          <Button className="w-full group-hover:bg-primary/90 transition-colors">
            View Details
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default MealCard;
