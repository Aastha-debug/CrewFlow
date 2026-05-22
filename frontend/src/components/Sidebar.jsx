import React, { useState } from 'react';
import { 
  Home, 
  Inbox, 
  CheckSquare, 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  User, 
  Plus, 
  FolderKanban,
  Menu,
  CheckCircle2,
  Triangle,
  GitMerge,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeModule, setActiveModule, activeView, setActiveView, projects = [], activeProjectId, setActiveProjectId }) => {
  const { user, logout } = useAuth();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin' };

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'my-tasks', label: 'My tasks', icon: CheckSquare },
    { id: 'portfolios', label: 'Portfolios', icon: Folder },
  ];

  const modules = [
    { id: 'work', label: 'Work', icon: CheckCircle2 },
    { id: 'strategy', label: 'Strategy', icon: Triangle },
    { id: 'workflow', label: 'Workflow', icon: GitMerge },
    { id: 'people', label: 'People', icon: Users },
  ];

  return (
    <div className="flex h-screen flex-shrink-0 select-none">
      
      {/* 1. Primary Slim Sidebar */}
      <aside className="w-[72px] bg-[#222325] border-r border-[#2d2e30] flex flex-col items-center py-4 gap-6">
        
        {/* Menu Icon */}
        <button className="text-[#a5a6a7] hover:text-white transition-colors mb-2">
          <Menu className="h-6 w-6" />
        </button>

        {/* Modules List */}
        <div className="flex flex-col gap-4 w-full px-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className="flex flex-col items-center gap-1.5 w-full group"
              >
                <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#3b3c3e] text-white shadow-sm' 
                    : 'text-[#8a8b8c] group-hover:bg-[#2d2e30] group-hover:text-white'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-[#8a8b8c] group-hover:text-[#a5a6a7]'
                }`}>
                  {mod.label}
                </span>
              </button>
            );
          })}
        </div>

      </aside>

      {/* 2. Secondary Sidebar */}
      <aside className="w-56 bg-[#1e1f21] text-[#c5c6c7] flex flex-col border-r border-[#2d2e30]">
        
        {/* Header / Create Button */}
        <div className="h-16 border-b border-[#2d2e30] flex items-center px-4">
          <button className="flex items-center gap-2 bg-transparent hover:bg-[#2d2e30] border border-[#3b3c3e] px-4 py-1.5 rounded-full transition-all w-full justify-center">
            <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white">
              <Plus className="h-3 w-3" />
            </div>
            <span className="text-white text-sm font-medium">Create</span>
          </button>
        </div>

        {/* Navigation Pane */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          
          {/* Work Section */}
          <div className="px-2 space-y-1">
            <h3 className="px-3 mb-2 text-xs font-bold text-[#8a8b8c] capitalize">
              {activeModule}
            </h3>

            {activeModule === 'work' ? (
              <>
                <nav className="space-y-0.5">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isViewActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          setActiveProjectId(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                          isViewActive 
                            ? 'bg-[#3b3c3e] text-white' 
                            : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isViewActive ? 'text-white' : 'text-[#8a8b8c]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-4 pt-4 border-t border-[#2d2e30]/50 space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <button 
                      onClick={() => setProjectsExpanded(!projectsExpanded)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#8a8b8c] hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {projectsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      <span>Work</span>
                    </button>
                    <button className="text-[#8a8b8c] hover:text-white transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {projectsExpanded && (
                    <div className="space-y-0.5 pl-1.5">
                      {projects.length === 0 ? (
                        <div className="px-6 py-2 text-xs text-[#6a6b6c] italic">
                          No projects active
                        </div>
                      ) : (
                        projects.map((proj) => {
                          const isProjectActive = activeView === 'project-details' && activeProjectId === proj._id;
                          return (
                            <button
                              key={proj._id}
                              onClick={() => {
                                setActiveProjectId(proj._id);
                                setActiveView('project-details');
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                isProjectActive 
                                  ? 'bg-[#3b3c3e] text-white' 
                                  : 'hover:bg-[#2d2e30] text-[#a5a6a7] hover:text-white'
                              }`}
                            >
                              <FolderKanban className="h-3.5 w-3.5 text-[#8a8b8c]" />
                              <span className="truncate">{proj.name}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="px-3 py-4 text-xs text-[#8a8b8c] italic text-center">
                Sub-navigation items for {activeModule} will appear here.
              </div>
            )}
          </div>

        </div>

        {/* User Session bottom panel */}
        <div className="p-3 border-t border-[#2d2e30] bg-[#1a1b1d] flex flex-col gap-2">
          {/* User Card */}
          <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#252628]/40 border border-[#2d2e30]/30">
            <div className="h-7 w-7 rounded-full bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate leading-none">{effectiveUser.email.split('@')[0]}</p>
              <p className="text-[10px] text-[#8a8b8c] truncate mt-0.5">{effectiveUser.role}</p>
            </div>
          </div>

          {/* Sign Out Trigger */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium text-[#a5a6a7] hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

    </div>
  );
};

export default Sidebar;
