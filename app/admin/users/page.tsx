"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useIsAdmin } from "@/lib/hooks/useIsAdmin";
import Link from "next/link";
import Image from "next/image";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaTrash,
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaDumbbell,
  FaChartLine,
  FaGoogle,
  FaKey,
  FaArrowLeft,
  FaSyncAlt,
  FaDownload,
} from "react-icons/fa";

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  bio: string | null;
  height: number | null;
  weight: number | null;
  hasPassword: boolean;
  providers: string[];
  lastSession: Date | null;
  totalWorkouts: number;
  totalSessions: number;
  totalProgressEntries: number;
  lastWorkoutSession: Date | null;
  lastProgressEntry: Date | null;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const { isAdmin, isLoading: isAdminLoading, isAuthenticated } = useIsAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh users list
      await fetchUsers();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getActivityStatus = (user: User) => {
    const lastActivity = user.lastWorkoutSession || user.lastSession;
    if (!lastActivity) return { status: "inactive", color: "text-gray-500" };

    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity <= 7) return { status: "active", color: "text-green-500" };
    if (daysSinceActivity <= 30) return { status: "moderate", color: "text-yellow-500" };
    return { status: "inactive", color: "text-red-500" };
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin && !isAdminLoading) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, isAdminLoading, currentPage, search, sortBy, sortOrder]);

  if (status === "loading" || isAdminLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <FaUsers className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-300 mb-6">
            Please sign in to access the admin panel.
          </p>
          <Link
            href="/auth/signin"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <FaUsers className="mx-auto text-red-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-300 mb-6">
            You don't have admin privileges to access this page.
          </p>
          <Link
            href="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16 fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mb-4"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">View and manage all registered users</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaSyncAlt className="mr-2" />
              Refresh
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center transition-colors">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="updatedAt">Last Updated</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-yellow-500 text-2xl font-bold">{pagination.total}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-green-500 text-2xl font-bold">
              {users.filter(u => getActivityStatus(u).status === "active").length}
            </div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-blue-500 text-2xl font-bold">
              {users.filter(u => u.emailVerified).length}
            </div>
            <div className="text-gray-400 text-sm">Verified</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-purple-500 text-2xl font-bold">
              {users.filter(u => u.providers.includes("google")).length}
            </div>
            <div className="text-gray-400 text-sm">Google Auth</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300">User</th>
                <th className="text-left py-4 px-6 text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-gray-300">Activity</th>
                <th className="text-left py-4 px-6 text-gray-300">Auth</th>
                <th className="text-left py-4 px-6 text-gray-300">Joined</th>
                <th className="text-center py-4 px-6 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const activityStatus = getActivityStatus(user);
                  return (
                    <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-750">
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <FaUsers className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user.name || "No Name"}
                            </div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {user.emailVerified ? (
                            <FaUserCheck className="text-green-500" />
                          ) : (
                            <FaUserTimes className="text-red-500" />
                          )}
                          <span className={activityStatus.color}>
                            {activityStatus.status}
                          </span>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-300 mb-1">
                            <FaDumbbell className="mr-1 text-yellow-500" />
                            {user.totalSessions} sessions
                          </div>
                          <div className="flex items-center text-gray-300">
                            <FaChartLine className="mr-1 text-blue-500" />
                            {user.totalProgressEntries} entries
                          </div>
                        </div>
                      </td>

                      {/* Auth Methods */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {user.hasPassword && (
                            <FaKey className="text-gray-400" title="Password" />
                          )}
                          {user.providers.includes("google") && (
                            <FaGoogle className="text-red-500" title="Google" />
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-gray-300 text-sm">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${ 
                    page === currentPage
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-600 hover:bg-gray-500 text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{selectedUser.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bio:</span>
                      <span className="text-white ml-2">{selectedUser.bio || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Height:</span>
                      <span className="text-white ml-2">
                        {selectedUser.height ? `${selectedUser.height} cm` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Weight:</span>
                      <span className="text-white ml-2">
                        {selectedUser.weight ? `${selectedUser.weight} kg` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Workouts:</span>
                      <span className="text-white ml-2">{selectedUser.totalWorkouts}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sessions:</span>
                      <span className="text-white ml-2">{selectedUser.totalSessions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Progress Entries:</span>
                      <span className="text-white ml-2">{selectedUser.totalProgressEntries}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Workout:</span>
                      <span className="text-white ml-2">
                        {formatDate(selectedUser.lastWorkoutSession)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Session:</span>
                      <span className="text-white ml-2">
                        {formatDate(selectedUser.lastSession)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-400">Email Verified:</span>
                    <span className={`ml-2 ${selectedUser.emailVerified ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedUser.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Auth Providers:</span>
                    <span className="text-white ml-2">
                      {selectedUser.providers.join(", ") || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-white ml-2">{formatDate(selectedUser.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone and will
              remove all associated data.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}