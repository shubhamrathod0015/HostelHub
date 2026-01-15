import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import useAuth from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, Medal } from "lucide-react";
import { format } from "date-fns";

const MyProfile = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
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
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full">
                  <Medal className="w-5 h-5" />
                  <span className="font-semibold">
                    {profile?.subscription} Member
                  </span>
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

            {/* Membership Benefits */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Membership Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Current Plan
                  </h4>
                  <p className="text-gray-600">
                    {profile?.subscription} Membership
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="text-gray-600 space-y-1">
                    {profile?.subscription === "Bronze" && (
                      <>
                        <li>• Basic meal access</li>
                        <li>• Standard support</li>
                      </>
                    )}
                    {profile?.subscription === "Silver" && (
                      <>
                        <li>• Premium meal access</li>
                        <li>• Priority support</li>
                        <li>• Like upcoming meals</li>
                      </>
                    )}
                    {profile?.subscription === "Gold" && (
                      <>
                        <li>• All Silver features</li>
                        <li>• VIP support</li>
                        <li>• Special discounts</li>
                      </>
                    )}
                    {profile?.subscription === "Platinum" && (
                      <>
                        <li>• All Gold features</li>
                        <li>• 24/7 support</li>
                        <li>• Exclusive events</li>
                        <li>• Custom meal requests</li>
                      </>
                    )}
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

export default MyProfile;
