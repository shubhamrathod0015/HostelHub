import {
  Calendar,
  UtensilsCrossed,
  MessageSquare,
  List,
  PlusCircle,
  Users,
  User,
  CreditCard,
  Home,
} from "lucide-react";
import { NavMain, DefaultNav } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import useAdmin from "@/hooks/useAdmin";

export function AppSidebar({ ...props }) {
  const [isAdmin] = useAdmin();
  const data = {
    navMain: isAdmin
      ? [
          {
            title: "Admin Profile",
            url: "/dashboard/admin-profile",
            icon: User,
          },
          {
            title: "Manage Users",
            url: "/dashboard/manage-users",
            icon: Users,
          },
          {
            title: "Add Meal",
            url: "/dashboard/add-meal",
            icon: PlusCircle,
          },
          {
            title: "All Meals",
            url: "/dashboard/all-meals",
            icon: List,
          },
          {
            title: "All Reviews",
            url: "/dashboard/all-reviews",
            icon: MessageSquare,
          },
          {
            title: "Serve Meals",
            url: "/dashboard/serve-meals",
            icon: UtensilsCrossed,
          },
          {
            title: "Upcoming Meals",
            url: "/dashboard/upcoming-meals",
            icon: Calendar,
          },
        ]
      : [
          {
            title: "My Profile",
            url: "/dashboard/my-profile",
            icon: User,
          },
          {
            title: "Requested Meals",
            url: "/dashboard/requested-meals",
            icon: UtensilsCrossed,
          },
          {
            title: "My Reviews",
            url: "/dashboard/my-reviews",
            icon: MessageSquare,
          },
          {
            title: "Payment History",
            url: "/dashboard/payment-history",
            icon: CreditCard,
          },
        ],
    defaultedNav: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Meals",
        url: "/meals",
        icon: UtensilsCrossed,
      },
      {
        title: "Upcoming Meals",
        url: "/upcoming-meals",
        icon: Calendar,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1 className="text-center">Hostel</h1>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <DefaultNav items={data.defaultedNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
