import { Search, Plus, Grid3x3, Moon, Sun, User, Settings, LogOut, UserCog, Trash2, MoreVertical, Edit2, Users, Globe, Lock, Link2, Mail, X, ChevronDown, Check, Folder, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import ImportDataModal from './ImportDataModal';
import EditItemModal from './EditItemModal';
import PublishWorkspaceModal from './PublishWorkspaceModal';
import NotificationPanel from './NotificationPanel';
import vizlyLogo from '../assets/vizlyLogo.png';

interface WorkspaceHomeProps {
  onNavigate: (screen: 'home' | 'workspace' | 'builder' | 'community') => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export default function WorkspaceHome({ onNavigate, onLogout, darkMode, onToggleDarkMode }: WorkspaceHomeProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editWorkspaceId, setEditWorkspaceId] = useState<number | null>(null);
  const [showItemMenu, setShowItemMenu] = useState<number | null>(null);
  const [publishWorkspaceId, setPublishWorkspaceId] = useState<number | null>(null);
  
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Demo', description: '', reports: 5, updated: 'Just now', color: 'bg-purple-500' },
  ]);

  const handleDeleteWorkspace = (workspaceId: number) => {
    setDeleteConfirmId(workspaceId);
    setShowItemMenu(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setWorkspaces(workspaces.filter(workspace => workspace.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleEditWorkspace = (workspaceId: number) => {
    setEditWorkspaceId(workspaceId);
    setShowItemMenu(null);
  };

  const saveEditWorkspace = (name: string, description: string) => {
    if (editWorkspaceId) {
      setWorkspaces(workspaces.map(workspace => 
        workspace.id === editWorkspaceId 
          ? { ...workspace, name, description }
          : workspace
      ));
      setEditWorkspaceId(null);
    }
  };

  const handlePublishWorkspace = (workspaceId: number) => {
    setPublishWorkspaceId(workspaceId);
    setShowItemMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
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
                  className="px-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg transition-all"
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

            {/* Global Search */}

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

        {/* Secondary Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all"
                />
              </div>
            </div>
            <button 
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Import Data</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-8">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-gray-900 dark:text-white mb-2">My Workspaces</h1>
              <p className="text-gray-600 dark:text-gray-400">Organize and access your analytics workspaces</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <Folder className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-2xl mb-1">{workspaces.length}</div>
              <div className="text-sm opacity-90">Total Workspaces</div>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-2xl mb-1">{workspaces.reduce((acc, w) => acc + w.reports, 0)}</div>
              <div className="text-sm opacity-90">Total Reports</div>
            </div>

            <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-2xl mb-1">Today</div>
              <div className="text-sm opacity-90">Last Activity</div>
            </div>

            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-2xl mb-1">3</div>
              <div className="text-sm opacity-90">Collaborators</div>
            </div>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 group relative"
            >
              {/* Colored Header Bar */}
              <div className={`h-2 ${workspace.color}`}></div>
              
              <div className="p-6">
                {/* Settings Button with Dropdown - Shows on hover */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowItemMenu(showItemMenu === workspace.id ? null : workspace.id);
                      }}
                      className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showItemMenu === workspace.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWorkspace(workspace.id);
                          }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublishWorkspace(workspace.id);
                          }}
                          className="w-full px-4 py-2.5 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-3 text-sm"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Publish</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWorkspace(workspace.id);
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

                <div onClick={() => onNavigate('workspace')}>
                  {/* Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 ${workspace.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Folder className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {workspace.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 line-clamp-2 min-h-[40px]">
                    {workspace.description || 'No description'}
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">{workspace.reports}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Reports</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Updated</div>
                        <div className="text-sm text-gray-900 dark:text-white">{workspace.updated}</div>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="ml-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('workspace');
                        }}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-all"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Workspace Card */}
          <div 
            onClick={() => setShowImportModal(true)}
            className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-900/10 transition-all cursor-pointer flex items-center justify-center min-h-[280px] group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Create New Workspace</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Import data to get started</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showSettings && (
        <ProfileSettings
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      )}

      {/* Import Data Modal */}
      {showImportModal && (
        <ImportDataModal
          onClose={() => setShowImportModal(false)}
          onImport={(data) => {
            console.log('Import data:', data);
            setShowImportModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white">Delete Workspace</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this workspace? This will permanently remove it and all its reports.
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

      {/* Edit Workspace Modal */}
      {editWorkspaceId !== null && (
        <EditItemModal
          isOpen={true}
          onClose={() => setEditWorkspaceId(null)}
          onSave={saveEditWorkspace}
          item={workspaces.find(workspace => workspace.id === editWorkspaceId) || null}
        />
      )}

      {/* Publish Workspace Modal */}
      {publishWorkspaceId !== null && (
        <PublishWorkspaceModal
          onClose={() => setPublishWorkspaceId(null)}
          workspace={workspaces.find(w => w.id === publishWorkspaceId) || { id: 1, name: 'Demo', description: '', reports: 5, updated: 'Just now', color: 'bg-purple-500' }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}