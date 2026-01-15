import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAuth from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, Medal, Users, Utensils, DollarSign, Star } from "lucide-react";
import { format } from "date-fns";

const AdminProfile = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();

  // Fetch admin profile and stats
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-profile", user?.email],
    queryFn: async () => {
      const profileRes = await axiosSecure.get(`/users/${user.email}`);
      const statsRes = await axiosSecure.get("/admin/stats");
      return {
        profile: profileRes.data,
        stats: statsRes.data
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const { profile, stats } = adminData;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="absolute -bottom-16 left-4">
              <div className="p-1 bg-white rounded-full">
                <img
                  src={profile?.photoURL}
                  alt={profile?.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.name}
                </h2>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full">
                  <Medal className="w-5 h-5" />
                  <span className="font-semibold">Admin</span>
                </div>
              </div>
            </div>

            {/* Join Date */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>
                  Joined {format(new Date(profile?.createdAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>

            {/* Admin Stats */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-xl font-bold text-blue-600">
                        {stats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Meals</p>
                      <p className="text-xl font-bold text-green-600">
                        {stats?.totalMeals || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-8 h-8 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Meals Added</p>
                      <p className="text-xl font-bold text-indigo-600">
                        {stats?.mealsAdded || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {stats?.totalReviews || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-xl font-bold text-purple-600">
                        ${stats?.totalRevenue || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              {profile?.recentActivity && profile.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(activity.timestamp), "PPp")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No recent activity</p>
              )}
            </div>

            {/* Admin Responsibilities */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Admin Responsibilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    User Management
                  </h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Manage user accounts</li>
                    <li>• Handle user roles</li>
                    <li>• Review user reports</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Content Management
                  </h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Approve/reject meals</li>
                    <li>• Moderate reviews</li>
                    <li>• Manage upcoming meals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
