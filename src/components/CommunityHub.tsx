import { useState } from "react";
import {
  Search,
  Heart,
  Copy,
  Eye,
  User,
  Moon,
  Sun,
  LogOut,
  Check,
  Grid3x3,
  UserCog,
  Plus,
  TrendingUp,
  Star,
  Download,
} from "lucide-react";
import vizlyLogo from '../assets/vizlyLogo.png';
import WorkspaceDetailView from "./WorkspaceDetailView";
import ProfileSettings from "./ProfileSettings";
import NotificationPanel from "./NotificationPanel";

interface CommunityHubProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  userPlan?: 'normal' | 'pro';
  onUpgradePlan?: () => void;
  workspaceItems?: any[];
  setWorkspaceItems?: (items: any[]) => void;
  publishedWorkspaces?: any[];
  setPublishedWorkspaces?: (workspaces: any[]) => void;
  communityWorkspaces?: any[];
  setCommunityWorkspaces?: (workspaces: any[]) => void;
}

// Community workspaces with preview images
const mockCommunityWorkspaces = [
  {
    id: "cw1",
    title: "Sales Analytics Dashboard",
    description: "Track revenue, customer segments, and regional performance",
    preview: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY2OTcyODg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Sarah Johnson",
      avatar: "SJ",
      verified: true,
      isPro: true,
    },
    stats: {
      likes: 1243,
      views: 8956,
      clones: 234,
    },
    tags: ["Sales", "Analytics", "Dashboard"],
    category: "Sales",
    color: "bg-blue-500",
    isLiked: false,
  },
  {
    id: "cw2",
    title: "Marketing Campaign Tracker",
    description: "Monitor campaign performance and ROI metrics",
    preview: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY2OTg5NzgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Mike Chen",
      avatar: "MC",
      verified: false,
      isPro: true,
    },
    stats: {
      likes: 892,
      views: 5432,
      clones: 156,
    },
    tags: ["Marketing", "Campaigns", "ROI"],
    category: "Marketing",
    color: "bg-emerald-500",
    isLiked: false,
  },
  {
    id: "cw3",
    title: "Financial Overview",
    description: "Comprehensive financial metrics and forecasting",
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2Njk4OTc4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Emma Davis",
      avatar: "ED",
      verified: true,
      isPro: true,
    },
    stats: {
      likes: 2156,
      views: 12340,
      clones: 445,
    },
    tags: ["Finance", "Forecasting", "Metrics"],
    category: "Finance",
    color: "bg-purple-500",
    isLiked: false,
  },
  {
    id: "cw4",
    title: "Product Analytics",
    description: "User behavior, feature adoption, and retention analysis",
    preview: "https://images.unsplash.com/photo-1758691736483-5f600b509962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMGNoYXJ0JTIwZ3JhcGh8ZW58MXx8fHwxNzY2OTg5NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Alex Kumar",
      avatar: "AK",
      verified: false,
      isPro: false,
    },
    stats: {
      likes: 678,
      views: 4231,
      clones: 89,
    },
    tags: ["Product", "Analytics", "Users"],
    category: "Product",
    color: "bg-orange-500",
    isLiked: true,
  },
  {
    id: "cw5",
    title: "Operations Dashboard",
    description: "Real-time operational metrics and KPIs",
    preview: "https://images.unsplash.com/photo-1764916125190-fd7ab7ea0dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVyYXRpb25zJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2Njk4OTc4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Lisa Park",
      avatar: "LP",
      verified: true,
      isPro: true,
    },
    stats: {
      likes: 1534,
      views: 9876,
      clones: 267,
    },
    tags: ["Operations", "KPIs", "Real-time"],
    category: "Operations",
    color: "bg-red-500",
    isLiked: false,
  },
  {
    id: "cw6",
    title: "Customer Success Metrics",
    description: "Track NPS, satisfaction scores, and support metrics",
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NjY5NTYwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "Tom Wilson",
      avatar: "TW",
      verified: false,
      isPro: true,
    },
    stats: {
      likes: 945,
      views: 6543,
      clones: 178,
    },
    tags: ["Customer Success", "NPS", "Support"],
    category: "Customer",
    color: "bg-pink-500",
    isLiked: false,
  },
];

const categories = [
  "All",
  "Sales",
  "Marketing",
  "Finance",
  "Product",
  "Operations",
  "Customer",
  "HR",
  "Analytics",
];

const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Recently Added" },
  { value: "clones", label: "Most Cloned" },
];

export default function CommunityHub({
  onNavigate,
  onLogout,
  darkMode,
  onToggleDarkMode,
  userPlan = 'normal',
}: CommunityHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workspaces, setWorkspaces] = useState(mockCommunityWorkspaces);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  const handleLike = (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces(
      workspaces.map((ws) => {
        if (ws.id === workspaceId) {
          return {
            ...ws,
            isLiked: !ws.isLiked,
            stats: {
              ...ws.stats,
              likes: ws.isLiked ? ws.stats.likes - 1 : ws.stats.likes + 1,
            },
          };
        }
        return ws;
      })
    );
  };

  const handleClone = (workspace: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Cloned: ${workspace.title}\n\nThis workspace has been added to your collection!`);
    setWorkspaces(
      workspaces.map((ws) =>
        ws.id === workspace.id
          ? { ...ws, stats: { ...ws.stats, clones: ws.stats.clones + 1 } }
          : ws
      )
    );
  };

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const matchesSearch =
      workspace.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || workspace.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedWorkspace) {
    return (
      <WorkspaceDetailView
        workspace={selectedWorkspace}
        onBack={() => setSelectedWorkspace(null)}
        onClone={(ws) => {
          alert(`Cloned: ${ws.title}`);
          setSelectedWorkspace(null);
        }}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        userPlan={userPlan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation - Exact Match with WorkspaceHome */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Tabs */}
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-3">
                <img src={vizlyLogo} alt="Vizly" className="w-10 h-10" />
                <span className="text-xl text-gray-900 dark:text-white">Vizly</span>
              </div>
              
              {/* Tab Navigation */}
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  My Files
                </button>
                <button
                  className="px-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-all"
                >
                  Community
                </button>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationPanel darkMode={darkMode} />
              
              <button
                onClick={() => onToggleDarkMode(!darkMode)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-105 transition-all"
                >
                  <User className="w-5 h-5" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-900 dark:text-white">kong</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">kong@gmail.com</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <UserCog className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Bar - Match WorkspaceHome Style */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search community workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 dark:text-white mb-1">Community Workspaces</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Discover and clone {filteredWorkspaces.length} amazing dashboards from the community
              </p>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all border-2 ${
                  selectedCategory === category
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Grid - Match WorkspaceHome Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => setSelectedWorkspace(workspace)}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 group relative"
            >
              {/* Colored Header Bar - Match WorkspaceHome */}
              <div className={`h-2 ${workspace.color}`}></div>
              
              {/* Card Content */}
              <div className="p-6">
                {/* Icon and Action Buttons */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 ${workspace.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Grid3x3 className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Action Buttons - Show on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-1.5">
                    <button
                      onClick={(e) => handleLike(workspace.id, e)}
                      className={`p-2 rounded-lg transition-all shadow-sm ${
                        workspace.isLiked
                          ? "bg-red-500 text-white"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${workspace.isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleClone(workspace, e)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {workspace.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-2 min-h-[40px]">
                  {workspace.description}
                </p>

                {/* Creator */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                    {workspace.creator.avatar}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {workspace.creator.name}
                  </span>
                  {workspace.creator.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  {workspace.creator.isPro && (
                    <span className="text-xs px-1.5 py-0.5 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>

                {/* Stats - Match WorkspaceHome Footer Style */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Heart className={`w-4 h-4 ${workspace.isLiked ? 'fill-red-500 text-red-500' : 'text-red-600 dark:text-red-400'}`} />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{workspace.stats.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{workspace.stats.views.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorkspace(workspace);
                    }}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-all"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create Your Own Card - Match Style */}
          <div
            onClick={() => onNavigate('home')}
            className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/10 transition-all cursor-pointer flex items-center justify-center min-h-[280px] group hover:-translate-y-1 duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Create Your Own</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Build and publish a workspace</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">No workspaces found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Profile Settings Modal */}
      {showSettings && (
        <ProfileSettings 
          onClose={() => setShowSettings(false)}
          darkMode={darkMode} onLogout={function (): void {
            throw new Error("Function not implemented.");
          } } onToggleDarkMode={function (value: boolean): void {
            throw new Error("Function not implemented.");
          } }        />
      )}
    </div>
  );
}