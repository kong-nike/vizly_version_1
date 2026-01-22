import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Grid3x3,
  Moon,
  Sun,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Database,
  Cog,
  Star,
  Clock,
  PieChart,
  TrendingUp,
  Menu,
  X,
  LogOut,
  UserCog,
  Upload,
  FolderOpen,
  LayoutGrid,
  Trash2,
  MoreVertical,
  Edit2,
  Users,
  Globe,
  Bell,
} from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import ImportDataModal from "./ImportDataModal";
import DataPreviewModal from "./DataPreviewModal";
import EditItemModal from "./EditItemModal";
import PublishWorkspaceModal from "./PublishWorkspaceModal";
import NotificationPanel from "./NotificationPanel";
import vizlyLogo from '../assets/vizlyLogo.png';

interface WorkspaceScreenProps {
  onNavigate: (
    screen: "home" | "workspace" | "builder" | "dataview" | "community",
  ) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onSelectDataSource?: (dataSource: any) => void;
  onSelectDashboard?: (dashboard: any) => void;
  onSelectReport?: (report: any) => void;
  userPlan?: 'normal' | 'pro';
  onUpgradePlan?: () => void;
  workspaceItems?: any[];
  setWorkspaceItems?: (items: any[]) => void;
}

export default function WorkspaceScreen({
  onNavigate,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onSelectDataSource,
  onSelectDashboard,
  onSelectReport,
  userPlan = 'normal',
  onUpgradePlan,
  workspaceItems,
  setWorkspaceItems,
}: WorkspaceScreenProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "All" | "Dashboards" | "Reports" | "Datasets"
  >("All");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImportDataModal, setShowImportDataModal] =
    useState(false);
  const [showDataPreviewModal, setShowDataPreviewModal] =
    useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<
    string | null
  >(null);
  const [editItemId, setEditItemId] = useState<string | null>(
    null,
  );
  const [showItemMenu, setShowItemMenu] = useState<
    string | null
  >(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const createMenuRef = useRef<HTMLDivElement>(null);

  // Close create menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setShowCreateMenu(false);
      }
    };

    if (showCreateMenu) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showCreateMenu]);

  // All items combined - using state so we can delete items
  const [items, setItems] = useState(workspaceItems || [
    // Dataset - E-commerce Sales Data
    {
      id: "ds1",
      name: "E-commerce Sales Data",
      type: "Dataset",
      icon: Database,
      color: "bg-emerald-500",
      rows: "15 rows",
      lastViewed: "5 min ago",
    },

    // Dashboard using the dataset
    {
      id: "d1",
      name: "Sales Performance Dashboard",
      type: "Dashboard",
      icon: BarChart3,
      color: "bg-purple-500",
      lastViewed: "10 min ago",
    },

    // Reports using the dataset
    {
      id: "r1",
      name: "Monthly Revenue Analysis",
      type: "Report",
      icon: FileText,
      color: "bg-blue-500",
      lastViewed: "15 min ago",
    },
    {
      id: "r2",
      name: "Category Growth Trends",
      type: "Report",
      icon: FileText,
      color: "bg-emerald-500",
      lastViewed: "20 min ago",
    },
    {
      id: "r3",
      name: "Product Performance Report",
      type: "Report",
      icon: FileText,
      color: "bg-indigo-500",
      lastViewed: "25 min ago",
    },
  ]);

  // Filter items based on active view
  const getFilteredItems = () => {
    if (activeView === "All") return items;
    return items.filter((item) => {
      if (activeView === "Dashboards")
        return item.type === "Dashboard";
      if (activeView === "Reports")
        return item.type === "Report";
      if (activeView === "Datasets")
        return item.type === "Dataset";
      return true;
    });
  };

  // Group items by type for "All" view
  const getGroupedItems = () => {
    const dashboards = items.filter(
      (item) => item.type === "Dashboard",
    );
    const reports = items.filter(
      (item) => item.type === "Report",
    );
    const datasets = items.filter(
      (item) => item.type === "Dataset",
    );
    return { dashboards, reports, datasets };
  };

  const menuItems = [
    {
      icon: LayoutGrid,
      label: "All",
      badge: items.length.toString(),
      filter: "All" as const,
    },
    {
      icon: BarChart3,
      label: "Dashboards",
      badge: items
        .filter((i) => i.type === "Dashboard")
        .length.toString(),
      filter: "Dashboards" as const,
    },
    {
      icon: FileText,
      label: "Reports",
      badge: items
        .filter((i) => i.type === "Report")
        .length.toString(),
      filter: "Reports" as const,
    },
    {
      icon: Database,
      label: "Datasets",
      badge: items
        .filter((i) => i.type === "Dataset")
        .length.toString(),
      filter: "Datasets" as const,
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.type === "Dataset") {
      // Convert dataset to datasource format and navigate to data table view
      const dataSource = {
        id: item.id,
        name: item.name,
        type: "CSV",
        rows: item.rows || "0 rows",
        lastUpdated: item.lastViewed,
      };
      if (onSelectDataSource) {
        onSelectDataSource(dataSource);
      }
    } else if (item.type === "Dashboard") {
      // Navigate to dashboard view for dashboards
      if (onSelectDashboard) {
        onSelectDashboard(item);
      }
    } else {
      // Navigate to builder for reports
      if (onSelectReport) {
        onSelectReport(item);
      } else {
        onNavigate("builder");
      }
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setDeleteConfirmId(itemId);
    setShowItemMenu(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setItems(
        items.filter((item) => item.id !== deleteConfirmId),
      );
      setDeleteConfirmId(null);
    }
  };

  const handleEditItem = (itemId: string) => {
    setEditItemId(itemId);
    setShowItemMenu(null);
  };

  const saveEditItem = (name: string, description: string) => {
    if (editItemId) {
      setItems(
        items.map((item) =>
          item.id === editItemId
            ? { ...item, name, description }
            : item,
        ),
      );
      setEditItemId(null);
    }
  };

  const renderItemCard = (item: any) => (
    <div
      key={item.id}
      onClick={() => handleItemClick(item)}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 group relative"
    >
      {/* Colored Header Bar */}
      <div className={`h-2 ${item.color}`}></div>
      
      <div className="p-6">
        {/* Icon and Type Badge with Menu */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <item.icon className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Type Badge */}
            <div className={`px-3 py-1 rounded-full text-xs ${
              item.type === 'Dashboard' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
              item.type === 'Report' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
              'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
            }`}>
              {item.type}
            </div>

            {/* Settings Button with Dropdown - Shows on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-all relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowItemMenu(
                    showItemMenu === item.id ? null : item.id,
                  );
                }}
                className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showItemMenu === item.id && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(item.id);
                    }}
                    className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="w-full px-4 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {item.name}
        </h3>
        
        {/* Description or Metadata */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-2 min-h-[40px]">
          {item.description || (item.rows ? `Contains ${item.rows}` : 'No description available')}
        </p>

        {/* Footer with Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              item.type === 'Dashboard' ? 'bg-purple-100 dark:bg-purple-900/30' :
              item.type === 'Report' ? 'bg-blue-100 dark:bg-blue-900/30' :
              'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              <Clock className={`w-4 h-4 ${
                item.type === 'Dashboard' ? 'text-purple-600 dark:text-purple-400' :
                item.type === 'Report' ? 'text-blue-600 dark:text-blue-400' :
                'text-emerald-600 dark:text-emerald-400'
              }`} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Updated</div>
              <div className="text-sm text-gray-900 dark:text-white">{item.lastViewed}</div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleItemClick(item);
            }}
            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-all"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation - Matching WorkspaceHome */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Tabs */}
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-3">
                <img onClick={() => onNavigate('home')} src={vizlyLogo} alt="Vizly" className="w-10 h-10" />
                <span onClick={() => onNavigate('home')} className="text-xl text-gray-900 dark:text-white">Vizly</span>
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
                  onClick={() => onNavigate('community')}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
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

        {/* Secondary Bar - Workspace Controls */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back to Home */}
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search in workspace..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Left Sidebar - Simplified */}
        <aside
          className="w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 hidden lg:block sticky top-[145px] h-[calc(100vh-145px)] "
        >
          {/* Create Button Header */}
<div className="p-4 border-b border-gray-200 dark:border-gray-700">
  <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCreateMenu(!showCreateMenu);
        }}
        className="w-full p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>
      
      {/* Unified Dropdown Menu */}
      {showCreateMenu && (
        <div 
          ref={createMenuRef}
          className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-9999"
        >
          <button
            onClick={() => {
              onNavigate("builder");
              setShowCreateMenu(false);
            }}
            className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Create Dashboard</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Build interactive dashboard</p>
            </div>
          </button>

          <button
            onClick={() => {
              onNavigate("builder");
              setShowCreateMenu(false);
            }}
            className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Create Report</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Build visualizations</p>
            </div>
          </button>

          <button
            onClick={() => {
              setShowImportDataModal(true);
              setShowCreateMenu(false);
            }}
            className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Import Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload datasets</p>
            </div>
          </button>
        </div>
      )}
  </div>
</div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveView(item.filter)}
                title={item.label}
                className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors group ${
                  activeView === item.filter
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeView === item.filter
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                />
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Grid3x3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    Analytics
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveView(item.filter);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeView === item.filter
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">
                      {item.label}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 transition-all duration-300">
          {/* Content Area */}
          <div className="p-4 lg:p-8">
            {/* Page Header with Stats */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
                    {activeView === "All" ? "All Items" : activeView}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeView === "All"
                      ? `View and manage all your content in one place`
                      : `Browse and manage your ${activeView.toLowerCase()}`}
                  </p>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <BarChart3 className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <div className="text-2xl mb-1">{getGroupedItems().dashboards.length}</div>
                  <div className="text-sm opacity-90">Active Dashboards</div>
                </div>

                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <div className="text-2xl mb-1">{getGroupedItems().reports.length}</div>
                  <div className="text-sm opacity-90">Total Reports</div>
                </div>

                <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Database className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <div className="text-2xl mb-1">{getGroupedItems().datasets.length}</div>
                  <div className="text-sm opacity-90">Data Sources</div>
                </div>
              </div>
            </div>

            {/* Grouped View for "All" */}
            {activeView === "All" && (
              <div className="space-y-8">
                {/* Dashboards Section */}
                {getGroupedItems().dashboards.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h2 className="text-gray-900 dark:text-white">
                        Dashboards
                      </h2>
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-sm">
                        {getGroupedItems().dashboards.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getGroupedItems().dashboards.map(
                        renderItemCard,
                      )}
                    </div>
                  </div>
                )}

                {/* Reports Section */}
                {getGroupedItems().reports.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="text-gray-900 dark:text-white">
                        Reports
                      </h2>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm">
                        {getGroupedItems().reports.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getGroupedItems().reports.map(
                        renderItemCard,
                      )}
                    </div>
                  </div>
                )}

                {/* Datasets Section */}
                {getGroupedItems().datasets.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h2 className="text-gray-900 dark:text-white">
                        Datasets
                      </h2>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-sm">
                        {getGroupedItems().datasets.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getGroupedItems().datasets.map(
                        renderItemCard,
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filtered View for specific types */}
            {activeView !== "All" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getFilteredItems().map(renderItemCard)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white">
                  Delete Item
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this item? This
              will permanently remove it from your workspace.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editItemId && (
        <EditItemModal
          isOpen={true}
          onClose={() => setEditItemId(null)}
          onSave={saveEditItem}
          item={
            items.find((item) => item.id === editItemId) || null
          }
        />
      )}

      {/* Profile Settings Modal */}
      {showSettings && (
        <ProfileSettings
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          userPlan={userPlan}
          onUpgradePlan={onUpgradePlan}
        />
      )}

      {/* Import Data Modal */}
      {showImportDataModal && (
        <ImportDataModal
          onClose={() => setShowImportDataModal(false)}
          onImport={(data) => {
            setPreviewData(data);
            setShowImportDataModal(false);
            setShowDataPreviewModal(true);
          }}
        />
      )}

      {/* Data Preview Modal */}
      {showDataPreviewModal && previewData && (
        <DataPreviewModal
          dataSource={previewData}
          onClose={() => setShowDataPreviewModal(false)}
          darkMode={darkMode}
        />
      )}

      {/* Publish Workspace Modal */}
      {showPublishModal && (
        <PublishWorkspaceModal
          onClose={() => setShowPublishModal(false)}
          items={items}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}