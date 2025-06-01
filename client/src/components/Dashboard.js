import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  MapPin,
  Calendar,
  GraduationCap,
  LogOut,
  Star,
  X,
  Check,
  Camera,
  Edit3,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover");
  const [showNotifications, setShowNotifications] = useState(false);

  // Empty arrays - no mock data
  const profiles = [];
  const matches = [];

  const ProfileCard = ({ profile }) => (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 group">
      <div className="relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 text-sm font-semibold text-navy-700 shadow-lg">
          <MapPin className="w-3 h-3 inline mr-1" />
          {profile.distance}
        </div>
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3 justify-center">
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
              <X className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-yellow-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {profile.name}, {profile.age}
          </h3>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">New</span>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2 text-navy-600" />
            <span className="text-sm">
              {profile.major} at {profile.college}
            </span>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{profile.bio}</p>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-navy-100 to-blue-100 text-navy-800 rounded-full text-xs font-medium border border-navy-200 hover:from-navy-200 hover:to-blue-200 transition-all duration-200"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const MatchCard = ({ match }) => (
    <div className="flex items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:bg-gradient-to-r hover:from-navy-50 hover:to-blue-50 border border-gray-100 hover:border-navy-200">
      <div className="relative">
        <img
          src={match.image}
          alt={match.name}
          className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-navy-200 group-hover:ring-navy-400 transition-all duration-300"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 group-hover:text-navy-800 transition-colors duration-200">
          {match.name}
        </h4>
        <p className="text-sm text-gray-600 truncate group-hover:text-navy-600 transition-colors duration-200">
          {match.lastMessage}
        </p>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-500 group-hover:text-navy-500 transition-colors duration-200">
          {match.time}
        </span>
        {match.unread && (
          <div className="w-3 h-3 bg-gradient-to-r from-navy-500 to-blue-500 rounded-full mt-1 ml-auto animate-pulse"></div>
        )}
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="w-72 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 shadow-2xl h-full flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 border-b border-navy-700/50">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src={user?.profilePicture || "/api/placeholder/48/48"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover ring-3 ring-navy-400 group-hover:ring-blue-400 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-800 animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-navy-300 text-sm">{user?.college}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 relative z-10">
        <ul className="space-y-2">
          {[
            {
              label: "Discover",
              icon: Search,
              id: "discover",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Matches",
              icon: Heart,
              id: "matches",
              color: "from-pink-500 to-rose-500",
            },
            {
              label: "Messages",
              icon: MessageCircle,
              id: "messages",
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Profile",
              icon: User,
              id: "profile",
              color: "from-purple-500 to-violet-500",
            },
            {
              label: "Settings",
              icon: Settings,
              id: "settings",
              color: "from-gray-500 to-slate-500",
            },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : "text-navy-300 hover:text-white hover:bg-navy-700/50"
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-white/20"
                      : "bg-navy-700/50 group-hover:bg-navy-600/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute right-4">
                    <Zap className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-navy-700/50 relative z-10">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-4 px-4 py-4 text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 rounded-2xl transition-all duration-300 group"
        >
          <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-white/20 transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 px-8 py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-navy-600 to-blue-600 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-white capitalize flex items-center space-x-2">
              <span>{activeTab}</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-3 text-navy-600 hover:text-white hover:bg-gradient-to-r hover:from-navy-600 hover:to-blue-600 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 text-navy-600 hover:text-white hover:bg-gradient-to-r hover:from-navy-600 hover:to-blue-600 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionIcon: ActionIcon,
  }) => (
    <div className="text-center py-16 px-8">
      <div className="relative inline-block mb-6">
        <div className="p-6 bg-gradient-to-r from-navy-100 to-blue-100 rounded-full">
          <Icon className="w-16 h-16 text-navy-400" />
        </div>
        <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-navy-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-navy-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
        {ActionIcon && <ActionIcon className="w-5 h-5" />}
        <span>{actionText}</span>
      </button>
    </div>
  );

  const handleTabClick = (tabId) => {
    if (tabId === "profile") {
      navigate("/profile");
    } else {
      setActiveTab(tabId);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "discover":
        return (
          <div className="p-8">
            {profiles.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Ready to Find Your Match?"
                description="Complete your profile and start discovering amazing people who share your interests and values. Your perfect match is just a swipe away!"
                actionText="Complete Profile"
                actionIcon={Sparkles}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>
        );

      case "matches":
        return (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={Heart}
                    title="No Matches Yet"
                    description="Don't worry! Start swiping and liking profiles to find your perfect matches. The more active you are, the more likely you'll find someone special."
                    actionText="Start Swiping"
                    actionIcon={Heart}
                  />
                </div>
              ) : (
                profiles
                  .slice(0, 2)
                  .map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))
              )}
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="p-8">
            <div className="space-y-4">
              {matches.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title="Start Conversations"
                  description="Break the ice with your matches! Send a thoughtful message and start building meaningful connections. Great conversations lead to great relationships."
                  actionText="Find Matches"
                  actionIcon={MessageCircle}
                />
              ) : (
                matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="relative inline-block group">
                    <img
                      src={user?.profilePicture || "/api/placeholder/120/120"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-navy-200 group-hover:ring-navy-400 transition-all duration-300"
                    />
                    <button className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-navy-600 to-blue-600 text-white rounded-full hover:from-navy-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mt-6">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-navy-600 text-lg">{user?.college}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    onClick={() => navigate("/profile")}
                    className="p-6 bg-gradient-to-r from-navy-50 to-blue-50 rounded-2xl border border-navy-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-navy-800 text-lg">
                          Edit Profile
                        </h3>
                        <p className="text-navy-600 text-sm">
                          Add photos, prompts, and update info
                        </p>
                      </div>
                      <Edit3 className="w-6 h-6 text-navy-600 group-hover:text-navy-800 transition-colors duration-200" />
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-purple-800 text-lg">
                          Boost Profile
                        </h3>
                        <p className="text-purple-600 text-sm">
                          Get more visibility
                        </p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                  <Settings className="w-8 h-8 text-navy-600" />
                  <span>Settings</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Notifications",
                      desc: "Manage your alerts",
                      icon: Bell,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      title: "Privacy",
                      desc: "Control your visibility",
                      icon: User,
                      color: "from-purple-500 to-violet-500",
                    },
                    {
                      title: "Account",
                      desc: "Manage your account",
                      icon: Settings,
                      color: "from-gray-500 to-slate-500",
                    },
                    {
                      title: "Help",
                      desc: "Get support",
                      icon: MessageCircle,
                      color: "from-green-500 to-emerald-500",
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:from-navy-50 hover:to-blue-50 hover:border-navy-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg group-hover:text-navy-800 transition-colors duration-200">
                            {setting.title}
                          </h3>
                          <p className="text-gray-600 text-sm group-hover:text-navy-600 transition-colors duration-200">
                            {setting.desc}
                          </p>
                        </div>
                        <div
                          className={`p-3 bg-gradient-to-r ${setting.color} rounded-xl`}
                        >
                          <setting.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-navy-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
