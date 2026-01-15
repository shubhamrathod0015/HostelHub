import { createBrowserRouter } from "react-router";
import NotFound from "@/components/shared/NotFound";
import MainLayout from "@/layout/MainLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Meals from "@/pages/Meals/Meals";
import AdminProfile from "@/pages/Dashboard/AdminProfile/AdminProfile";
import ManageUsers from "@/pages/Dashboard/ManageUsers/ManageUsers";
import AddMeal from "@/pages/Dashboard/AddMeal/AddMeal";
import AllMeals from "@/pages/Dashboard/AllMeals/AllMeals";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "@/pages/Meals/MealDetails";
import UpdateMeal from "@/pages/Meals/UpdateMeal";
import MyProfile from "@/pages/Dashboard/MyProfile/MyProfile";
import RequestedMeals from "@/pages/Dashboard/RequestedMeals/RequestedMeals";
import ServeMeals from "@/pages/Dashboard/ServeMeals/ServeMeals";
import PaymentHistory from "@/pages/Dashboard/PaymentHistory/PaymentHistory";
import Payment from "@/components/ui/payment";
import UpcomingMeals from "@/pages/Dashboard/UpcomingMeals/UpcomingMeals";
import UpcomingFood from "@/pages/UpcomingFood/UpcomingFood";
import MyReviews from "@/pages/Dashboard/MyReviews/MyReviews";
import AllReviews from "@/pages/Dashboard/AllReviews/AllReviews";
import AdminRoute from "./Adminroute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/meals",
        element: <Meals />,
      },
      {
        path: "/meal/:id",
        element: <MealDetails />,
      },
      {
        path: "/update-meal/:id",
        element: (
          <PrivateRoute>
            <UpdateMeal />
          </PrivateRoute>
        ),
      },
      {
        path: "/upcoming-meals",
        element: <UpcomingFood />,
      },
      {
        path: "checkout/:id",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Admin Routes
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "add-meal",
        element: (
          <AdminRoute>
            <AddMeal />
          </AdminRoute>
        ),
      },
      {
        path: "all-meals",
        element: (
          <AdminRoute>
            <AllMeals />
          </AdminRoute>
        ),
      },
      {
        path: "all-reviews",
        element: (
          <AdminRoute>
            <AllReviews />
          </AdminRoute>
        ),
      },
      {
        path: "serve-meals",
        element: (
          <AdminRoute>
            <ServeMeals />
          </AdminRoute>
        ),
      },
      {
        path: "upcoming-meals",
        element: (
          <AdminRoute>
            <UpcomingMeals />
          </AdminRoute>
        ),
      },
      // User Routes
      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "my-reviews",
        element: (
          <PrivateRoute>
            <MyReviews />
          </PrivateRoute>
        ),
      },
      {
        path: "requested-meals",
        element: (
          <PrivateRoute>
            <RequestedMeals />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <PrivateRoute>
            <PaymentHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
