import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  FolderPlus, 
  X,
  Check,
  CheckCircle2,
  FolderKanban,
  Users,
  Layers,
  Target,
  MoreHorizontal,
  Trash2,
  ArrowRight,
  Clock,
  ArrowUpDown,
  Home,
  Inbox,
  CheckSquare
} from 'lucide-react';

const Header = ({ 
  activeView, 
  activeProjectId, 
  projects = [], 
  tasks = [],
  setActiveView,
  setActiveProjectId,
  onRefresh, 
  onNewProject, 
  onNewTask,
  loading 
}) => {
  const { user } = useAuth();
  const effectiveUser = user || { email: 'guest@crewflow.com', role: 'Admin', _id: 'guest_id' };

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState(null); // 'tasks' | 'projects' | 'people' | 'portfolios' | 'goals' | null
  const [isFocused, setIsFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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
      case 'projects':
        return 'Browse projects';
      case 'portfolios':
        return 'Portfolios';
      default:
        return 'CrewFlow';
    }
  };

  // List of Navigation Pages for search matching
  const navigationItems = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Inbox', view: 'inbox', icon: Inbox },
    { label: 'My Tasks', view: 'my-tasks', icon: CheckSquare },
    { label: 'Browse Projects', view: 'projects', icon: FolderKanban },
    { label: 'Portfolios', view: 'portfolios', icon: Layers }
  ];

  // Dynamic Search Filtering Logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !searchCategory) return null;

    const q = searchQuery.toLowerCase().trim();
    const results = {
      navigation: [],
      projects: [],
      tasks: [],
      people: []
    };

    // 1. Navigation Matcher (only if category is null or matches navigation context)
    if (!searchCategory) {
      results.navigation = navigationItems.filter(item => 
        item.label.toLowerCase().includes(q)
      );
    }

    // 2. Projects Matcher
    if (!searchCategory || searchCategory === 'projects') {
      results.projects = projects.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 3. Tasks Matcher
    if (!searchCategory || searchCategory === 'tasks') {
      results.tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // 4. People Matcher
    if (!searchCategory || searchCategory === 'people') {
      const uniqueEmails = new Set();
      projects.forEach(p => {
        if (p.members) {
          p.members.forEach(m => {
            const email = typeof m === 'object' ? m.email : m;
            if (email && email.toLowerCase().includes(q)) {
              uniqueEmails.add(email);
            }
          });
        }
      });
      results.people = Array.from(uniqueEmails).map(email => ({
        email,
        initials: email.split('@')[0].slice(0, 2).toUpperCase()
      }));
    }

    return results;
  }, [searchQuery, searchCategory, projects, tasks]);

  // Click handler for navigation result
  const handleNavClick = (view, projectId = null) => {
    if (setActiveView) setActiveView(view);
    if (setActiveProjectId) setActiveProjectId(projectId);
    setIsFocused(false);
    setSearchQuery('');
    setSearchCategory(null);
  };

  // Pill configurations
  const filterPills = [
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, borderClass: 'border-[#8cb04b] text-[#8cb04b] hover:bg-[#8cb04b]/5' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, borderClass: 'border-[#3b66c5] text-[#3b66c5] hover:bg-[#3b66c5]/5' },
    { id: 'people', label: 'People', icon: Users, borderClass: 'border-[#9969c9] text-[#9969c9] hover:bg-[#9969c9]/5' },
    { id: 'portfolios', label: 'Portfolios', icon: Layers, borderClass: 'border-[#e78686] text-[#e78686] hover:bg-[#e78686]/5' },
    { id: 'goals', label: 'Goals', icon: Target, borderClass: 'border-[#d49833] text-[#d49833] hover:bg-[#d49833]/5' },
  ];

  return (
    <header className="h-14 border-b border-[#e2e2e2] bg-white flex items-center justify-between px-6 select-none flex-shrink-0 relative z-30">
      
      {/* Active Breadcrumb Path */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-[#1a1c1c] tracking-tight">
          {getViewLabel()}
        </h1>
      </div>

      {/* Global Advanced Interactive Search Bar */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        
        {/* Search Input Container Box */}
        <div className={`flex items-center bg-[#f3f3f4] border rounded-full transition-all duration-300 px-3.5 py-1.5 w-80 ${
          isFocused 
            ? 'w-[520px] bg-white border-[#3b66c5] ring-1 ring-[#3b66c5]' 
            : 'border-[#e2e2e2] hover:border-[#c6c6c6]'
        }`}>
          <Search className="h-4 w-4 text-[#777777] flex-shrink-0 mr-2" />
          
          {/* Active Search Category Tag */}
          {searchCategory && (
            <span className="flex items-center gap-1 bg-[#3b66c5]/10 text-[#3b66c5] text-[10px] font-bold px-2.5 py-0.5 rounded-full mr-2 select-none border border-[#3b66c5]/25">
              <span>{searchCategory.charAt(0).toUpperCase() + searchCategory.slice(1)}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchCategory(null);
                }} 
                className="hover:text-black rounded-full"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={searchCategory ? `Search in ${searchCategory}...` : "Search..."}
            className="w-full text-xs bg-transparent border-none focus:ring-0 outline-none text-[#1a1c1c] p-0"
          />
          
          {/* Input control actions (Clear / Focus Out) */}
          {(searchQuery || searchCategory) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchCategory(null);
              }} 
              className="text-[#777777] hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating Search Popover Dropdown (Matches Screenshot) */}
        {isFocused && (
          <div className="absolute left-0 mt-2 w-[520px] bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 py-4 px-5 flex flex-col gap-5 animate-scale-in text-[#1a1c1c] max-h-[460px] overflow-y-auto">
            
            {/* 1. Category Pills Row */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">
                <span>Filter search by</span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {filterPills.map((pill) => {
                  const IconComponent = pill.icon;
                  const isActive = searchCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setSearchCategory(isActive ? null : pill.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-black border-black text-white' 
                          : pill.borderClass
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}

                {/* More Action */}
                <button
                  onClick={() => triggerToast("Additional filters: Custom Fields, Date Ranges are coming soon!")}
                  className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span>More</span>
                </button>
              </div>
            </div>

            {/* 2. Search Results List (If Query/Category is active) OR Default State (Screenshot recents/saved) */}
            {searchResults ? (
              <div className="space-y-4">
                
                {/* Navigation matches */}
                {searchResults.navigation.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Navigation</h3>
                    <div className="space-y-0.5">
                      {searchResults.navigation.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleNavClick(item.view)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                          >
                            <Icon className="h-4 w-4 text-[#777777]" />
                            <span>Go to {item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Project matches */}
                {searchResults.projects.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Projects</h3>
                    <div className="space-y-0.5">
                      {searchResults.projects.map((proj) => (
                        <button
                          key={proj._id}
                          onClick={() => handleNavClick('project-details', proj._id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FolderKanban className="h-4 w-4 text-[#3b66c5] flex-shrink-0" />
                            <span className="truncate">{proj.name}</span>
                          </div>
                          <span className="text-[9px] text-[#777777] bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Project</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task matches */}
                {searchResults.tasks.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Tasks</h3>
                    <div className="space-y-0.5">
                      {searchResults.tasks.map((task) => (
                        <button
                          key={task._id}
                          onClick={() => handleNavClick('my-tasks')}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] text-left transition-colors font-semibold"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-[#8cb04b] flex-shrink-0" />
                            <span className="truncate">{task.title}</span>
                          </div>
                          <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-bold uppercase tracking-wider">{task.priority}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* People matches */}
                {searchResults.people.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">People</h3>
                    <div className="space-y-0.5">
                      {searchResults.people.map((p, idx) => (
                        <div
                          key={idx}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#f5f5f6] transition-colors font-semibold select-none cursor-default"
                        >
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] font-bold">
                            {p.initials}
                          </div>
                          <span>{p.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {searchResults.navigation.length === 0 && 
                 searchResults.projects.length === 0 && 
                 searchResults.tasks.length === 0 && 
                 searchResults.people.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#777777] italic">
                    No results found matching "{searchQuery}"
                  </div>
                )}

              </div>
            ) : (
              <>
                {/* Default View: Recents & Saved searches */}
                
                {/* 3. Recents Section */}
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Recents</h3>
                  <div className="space-y-0.5">
                    {projects.length === 0 ? (
                      <div className="text-xs text-[#777777] italic px-3 py-1">No recent items available</div>
                    ) : (
                      projects.slice(0, 3).map((proj) => {
                        // Generate avatar initials
                        const firstEmail = proj.members?.[0]?.email || 'guest@crewflow.com';
                        const firstInit = firstEmail.split('@')[0].slice(0, 2).toUpperCase();
                        
                        return (
                          <button
                            key={proj._id}
                            onClick={() => handleNavClick('project-details', proj._id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#f5f5f6] text-left transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-6 w-6 bg-[#f3f3f4] group-hover:bg-white rounded flex items-center justify-center text-[#777777]">
                                <FolderKanban className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-bold text-[#1a1c1c] truncate">{proj.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="h-5 w-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-[8px] font-bold">
                                {firstInit}
                              </div>
                              <span className="text-[#c6c6c6] text-[10px]">...</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 4. Saved Searches Section */}
                <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                  <h3 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider">Saved searches</h3>
                  <div className="flex flex-wrap gap-2">
                    
                    {/* Saved 1 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Tasks I've created");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Tasks I've created</span>
                    </button>

                    {/* Saved 2 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Tasks I've assigned to others");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Tasks I've assigned to others</span>
                    </button>

                    {/* Saved 3 */}
                    <button
                      onClick={() => {
                        setSearchCategory('tasks');
                        setSearchQuery("Recently completed tasks");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Recently completed tasks</span>
                    </button>

                    {/* Saved 4 */}
                    <button
                      onClick={() => triggerToast("Trash is currently empty. No deleted items found.")}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded text-xs font-bold text-[#5e5e5e] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      <span>Deleted</span>
                    </button>

                  </div>
                </div>
              </>
            )}

          </div>
        )}

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
              className="btn-white text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
            >
              <FolderPlus className="h-3.5 w-3.5 text-[#5e5e5e]" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* Create Task Button */}
            <button
              onClick={onNewTask}
              disabled={projects.length === 0}
              className="btn-black text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
            >
              <Plus className="h-3.5 w-3.5 text-white" />
              <span>New Task</span>
            </button>

          </div>
        )}

      </div>

      {/* Floating Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2.5 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </header>
  );
};

export default Header;

