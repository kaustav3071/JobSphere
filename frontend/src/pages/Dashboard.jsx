import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import { BarChart3 } from "lucide-react"; // Optional icon for header

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (user.role === "job_seeker") {
          setStats({
            Applications: 4,
            Shortlisted: 2,
            Interviews: 1,
          });
          setActivity([
            "✅ Applied to Web Developer at ABC Corp",
            "⭐ Shortlisted for Frontend Intern",
          ]);
        } else if (user.role === "recruiter") {
          setStats({
            "Jobs Posted": 3,
            "Total Applicants": 21,
            "Interviews Scheduled": 5,
          });
          setActivity([
            "📢 Posted 'Backend Developer' role",
            "📩 Received 7 new applications for 'UI Designer'",
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboard();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([label, value]) => (
          <StatsCard key={label} label={label} value={value} />
        ))}
      </div>

      {/* Activity Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 border-gray-200">
          🔔 Recent Activity
        </h3>
        <RecentActivity activities={activity} />
      </div>
    </div>
  );
};

export default Dashboard;
