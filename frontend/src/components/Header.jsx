import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, RefreshCw, Plus, FolderPlus, ClipboardPlus } from 'lucide-react';

const Header = ({ 
  activeView, 
  activeProjectId, 
  projects = [], 
  onRefresh, 
  onNewProject, 
  onNewTask,
  loading 
}) => {
  const { user } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin' };

  // Determine active view label
  const getViewLabel = () => {
    if (activeView === 'project-details' && activeProjectId) {
      const activeProj = projects.find(p => p._id === activeProjectId);
      return activeProj ? `Projects / ${activeProj.name}` : 'Project Details';
    }
    switch (activeView) {
      case 'home':
        return 'Home';
      case 'inbox':
        return 'Inbox';
      case 'my-tasks':
        return 'My tasks';
      case 'portfolios':
        return 'Portfolios';
      default:
        return 'CrewFlow';
    }
  };

  return (
    <header className="h-14 border-b border-[#e2e2e2] bg-white flex items-center justify-between px-6 select-none flex-shrink-0">
      
      {/* Active Breadcrumb Path */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-[#1a1c1c] tracking-tight">
          {getViewLabel()}
        </h1>
      </div>

      {/* Global Grayscale Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-80 relative">
        <span className="absolute left-3 text-[#777777]">
          <Search className="h-3.5 w-3.5" />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-xs py-1.5 pl-9 pr-4 bg-[#f3f3f4] border border-[#e2e2e2] rounded focus:bg-white focus:border-[#000000] focus:ring-0 transition-all placeholder-[#777777] text-[#1a1c1c] outline-none"
        />
      </div>

      {/* Primary Actions & Controls */}
      <div className="flex items-center gap-3">
        
        {/* Refresh Trigger */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded border border-[#c6c6c6] text-[#5e5e5e] hover:text-[#1a1c1c] hover:bg-[#f3f3f4] active:bg-white transition-colors"
          title="Refresh Workspace"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        {/* Conditional Admin Quick Actions */}
        {effectiveUser.role === 'Admin' && (
          <div className="flex items-center gap-2">
            
            {/* Create Project Button */}
            <button
              onClick={onNewProject}
              className="btn-white text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <FolderPlus className="h-3.5 w-3.5 text-[#5e5e5e]" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* Create Task Button */}
            <button
              onClick={onNewTask}
              disabled={projects.length === 0}
              className="btn-black text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5 text-white" />
              <span>New Task</span>
            </button>

          </div>
        )}

      </div>

    </header>
  );
};

export default Header;
