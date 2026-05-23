import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Check, 
  ArrowUpDown, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Target, 
  Activity, 
  Calendar, 
  Move,
  Trophy,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Link2
} from 'lucide-react';

const StrategyGoalsView = ({ projects = [], setActiveView, setActiveProjectId }) => {
  const [activeTab, setActiveTab] = useState('my-goals'); // 'my-goals' | 'team-goals' | 'strategy-map'
  
  // Goals Seed Data
  const [goals, setGoals] = useState([
    {
      _id: 'goal_1',
      name: 'Launch CrewFlow v2.0 Platform',
      status: 'On track', // 'On track' | 'At risk' | 'Off track' | 'Completed'
      progress: 65,
      timePeriod: 'Q3 2026',
      owner: 'guest@crewflow.com',
      team: 'Engineering',
      type: 'my'
    },
    {
      _id: 'goal_2',
      name: 'Increase Organic Leads by 25%',
      status: 'On track',
      progress: 40,
      timePeriod: 'FY 2026',
      owner: 'guest@crewflow.com',
      team: 'Marketing',
      type: 'my'
    },
    {
      _id: 'goal_3',
      name: 'Transition UI Design to Premium Grayscale Theme',
      status: 'Completed',
      progress: 100,
      timePeriod: 'Q2 2026',
      owner: 'member@crewflow.com',
      team: 'Design',
      type: 'team'
    },
    {
      _id: 'goal_4',
      name: 'Reduce System Downtime to <0.01%',
      status: 'At risk',
      progress: 15,
      timePeriod: 'Q3 2026',
      owner: 'admin@crewflow.com',
      team: 'Engineering',
      type: 'team'
    },
    {
      _id: 'goal_5',
      name: 'Establish Corporate Partnerships Program',
      status: 'Off track',
      progress: 8,
      timePeriod: 'Q4 2026',
      owner: 'guest@crewflow.com',
      team: 'Partnerships',
      type: 'my'
    }
  ]);

  // Inline Goal creation states
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalStatus, setNewGoalStatus] = useState('On track');
  const [newGoalProgress, setNewGoalProgress] = useState(0);
  const [newGoalTime, setNewGoalTime] = useState('Q3 2026');
  const [newGoalTeam, setNewGoalTeam] = useState('Engineering');
  const [newGoalOwner, setNewGoalOwner] = useState('guest@crewflow.com');

  // Interactive Custom Column States
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Name', width: 'flex-2' },
    { id: 'status', label: 'Status', width: 'w-32' },
    { id: 'progress', label: 'Progress', width: 'w-44' },
    { id: 'timePeriod', label: 'Time period', width: 'w-32' },
    { id: 'owner', label: 'Owner', width: 'w-40' },
    { id: 'team', label: 'Accountable team', width: 'w-40' }
  ]);

  // Sorting & Filtering States
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState(null); // columnId or null
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Custom Field Form States (Add Field Option dialogs)
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text'); // 'date' | 'people' | 'text' | 'number' | 'select' | 'multiselect'
  const [newFieldPopoverStep, setNewFieldPopoverStep] = useState(null); // 'define' | null
  const [newFieldOptions, setNewFieldOptions] = useState(''); // comma-separated for select/multiselect
  
  // Popup / Dropdown Refs
  const headerMenuRef = useRef(null);
  const addFieldRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setActiveHeaderDropdown(null);
      }
      if (addFieldRef.current && !addFieldRef.current.contains(e.target)) {
        setIsAddFieldOpen(false);
        setNewFieldPopoverStep(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter and Sort goals
  const displayGoals = useMemo(() => {
    let result = goals.filter(g => {
      // Tab matching
      if (activeTab === 'my-goals') return g.type === 'my';
      if (activeTab === 'team-goals') return g.type === 'team';
      return true;
    });

    if (statusFilter !== 'All') {
      result = result.filter(g => g.status === statusFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortField] !== undefined ? a[sortField] : '';
      let valB = b[sortField] !== undefined ? b[sortField] : '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [goals, activeTab, statusFilter, sortField, sortAsc]);

  // Handle move column left/right
  const handleMoveColumn = (colId, direction) => {
    const idx = columns.findIndex(c => c.id === colId);
    if (idx === -1) return;

    const newCols = [...columns];
    if (direction === 'left' && idx > 0) {
      // Swap with left neighbor
      const temp = newCols[idx - 1];
      newCols[idx - 1] = newCols[idx];
      newCols[idx] = temp;
    } else if (direction === 'right' && idx < columns.length - 1) {
      // Swap with right neighbor
      const temp = newCols[idx + 1];
      newCols[idx + 1] = newCols[idx];
      newCols[idx] = temp;
    }
    setColumns(newCols);
    setActiveHeaderDropdown(null);
  };

  // Add Custom Field Handler
  const handleCreateCustomField = (e) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newColId = `custom_${Date.now()}`;
    const newCol = {
      id: newColId,
      label: newFieldName.trim(),
      width: 'w-36',
      isCustom: true,
      fieldType: newFieldType,
      options: newFieldOptions ? newFieldOptions.split(',').map(s => s.trim()) : []
    };

    setColumns([...columns, newCol]);
    
    // Seed blank value for all goals
    setGoals(prev => prev.map(g => ({
      ...g,
      [newColId]: newFieldType === 'number' ? 0 : ''
    })));

    // Reset Form
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions('');
    setIsAddFieldOpen(false);
    setNewFieldPopoverStep(null);
  };

  // Create Goal Handler
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    const newGoalObj = {
      _id: `goal_${Date.now()}`,
      name: newGoalName.trim(),
      status: newGoalStatus,
      progress: Number(newGoalProgress),
      timePeriod: newGoalTime,
      owner: newGoalOwner,
      team: newGoalTeam,
      type: activeTab === 'my-goals' ? 'my' : 'team'
    };

    setGoals([...goals, newGoalObj]);
    setNewGoalName('');
    setIsCreatingGoal(false);
  };

  // Inline updater for goal field changes
  const handleUpdateGoalField = (goalId, fieldId, value) => {
    setGoals(prev => prev.map(g => {
      if (g._id === goalId) {
        return { ...g, [fieldId]: value };
      }
      return g;
    }));
  };

  // Helper colors for status badges
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On track':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'At risk':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Off track':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-6 select-none font-sans relative">
      
      {/* 1. Header and Navigation Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#e2e2e2] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c] tracking-tight flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-500" />
            <span>Workspace Objectives</span>
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">Define corporate milestones, track KRs, and align connected projects.</p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center bg-[#f3f3f4] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('my-goals')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'my-goals' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-[#777777] hover:text-black'
            }`}
          >
            My goals
          </button>
          <button
            onClick={() => setActiveTab('team-goals')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'team-goals' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-[#777777] hover:text-black'
            }`}
          >
            Team goals
          </button>
          <button
            onClick={() => setActiveTab('strategy-map')}
            className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'strategy-map' 
                ? 'bg-white text-black shadow-xs' 
                : 'text-[#777777] hover:text-black'
            }`}
          >
            Strategy map
          </button>
        </div>
      </div>

      {/* 2. Primary Tabs View Render */}
      {activeTab !== 'strategy-map' ? (
        <div className="space-y-4">
          
          {/* Action Row Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafafb] p-3 rounded-lg border border-[#e2e2e2]">
            <div className="flex items-center gap-3">
              
              {/* Filter by Status */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#777777]">Filter status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-[#c6c6c6] bg-white rounded px-2.5 py-1 hover:border-[#1a1c1c] outline-none text-[#1a1c1c]"
                >
                  <option value="All">All Statuses</option>
                  <option value="On track">On track</option>
                  <option value="At risk">At risk</option>
                  <option value="Off track">Off track</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Quick statistics */}
              <div className="hidden sm:flex items-center gap-2 bg-[#f3f3f4] text-[#777777] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#e2e2e2]">
                <Activity className="h-3 w-3 text-emerald-500" />
                <span>{displayGoals.length} goals mapped</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatingGoal(!isCreatingGoal)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white rounded text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create goal</span>
              </button>
            </div>
          </div>

          {/* Inline Goal Form Drawer */}
          {isCreatingGoal && (
            <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-[#e2e2e2] rounded-lg p-5 space-y-4 animate-scale-in">
              <h4 className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-[#3b66c5]" />
                <span>Define New Workspace Goal Objective</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Goal Name */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-[#777777] mb-1">Goal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Expand design patterns to grayscale theme"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#777777] mb-1">Owner</label>
                  <input
                    type="email"
                    value={newGoalOwner}
                    onChange={(e) => setNewGoalOwner(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#777777] mb-1">Status</label>
                  <select
                    value={newGoalStatus}
                    onChange={(e) => setNewGoalStatus(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  >
                    <option value="On track">On track</option>
                    <option value="At risk">At risk</option>
                    <option value="Off track">Off track</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Progress */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#777777] mb-1">Initial Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newGoalProgress}
                    onChange={(e) => setNewGoalProgress(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

                {/* Time Period */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#777777] mb-1">Time Period</label>
                  <input
                    type="text"
                    value={newGoalTime}
                    onChange={(e) => setNewGoalTime(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsCreatingGoal(false)}
                  className="px-3 py-1.5 border border-[#c6c6c6] text-xs font-semibold rounded hover:bg-[#f3f3f4] text-[#5e5e5e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          )}

          {/* 3. High-Contrast Interactive Sheet/Table */}
          <div className="border border-[#e2e2e2] rounded-lg bg-white overflow-hidden shadow-xs relative">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="border-b border-[#e2e2e2] bg-[#fafafb] text-[#5e5e5e] font-semibold h-11">
                    
                    {/* Render headers dynamically */}
                    {columns.map((col, cIdx) => (
                      <th key={col.id} className={`py-2 px-4 relative group cursor-pointer ${col.width}`}>
                        <div 
                          onClick={() => {
                            if (col.id === 'progress' || col.id === 'status' || col.id === 'name' || col.id === 'timePeriod' || col.id === 'owner' || col.id === 'team') {
                              if (sortField === col.id) {
                                setSortAsc(!sortAsc);
                              } else {
                                setSortField(col.id);
                                setSortAsc(true);
                              }
                            }
                          }}
                          className="flex items-center gap-1.5 hover:text-black transition-colors select-none"
                        >
                          <span>{col.label}</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60 flex-shrink-0" />
                        </div>

                        {/* Dropdown Button on hover/active */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHeaderDropdown(activeHeaderDropdown === col.id ? null : col.id);
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-[#eeeeef] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Floating Column Menu (Sort/Move Options) */}
                        {activeHeaderDropdown === col.id && (
                          <div 
                            ref={headerMenuRef}
                            className="absolute left-2 mt-2 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-[#1a1c1c] font-normal animate-scale-in"
                          >
                            <div className="px-3.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Column Options</div>
                            
                            <button
                              onClick={() => {
                                setSortField(col.id);
                                setSortAsc(true);
                                setActiveHeaderDropdown(null);
                              }}
                              className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2"
                            >
                              <span>Sort A - Z</span>
                            </button>

                            <button
                              onClick={() => {
                                setSortField(col.id);
                                setSortAsc(false);
                                setActiveHeaderDropdown(null);
                              }}
                              className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2"
                            >
                              <span>Sort Z - A</span>
                            </button>

                            <div className="border-t border-[#eeeeee] my-1"></div>
                            
                            {/* Move Column Left */}
                            {cIdx > 0 && (
                              <button
                                onClick={() => handleMoveColumn(col.id, 'left')}
                                className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2"
                              >
                                <ArrowLeft className="h-3 w-3 text-[#777777]" />
                                <span>Move Column Left</span>
                              </button>
                            )}

                            {/* Move Column Right */}
                            {cIdx < columns.length - 1 && (
                              <button
                                onClick={() => handleMoveColumn(col.id, 'right')}
                                className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] flex items-center gap-2"
                              >
                                <ArrowRight className="h-3 w-3 text-[#777777]" />
                                <span>Move Column Right</span>
                              </button>
                            )}
                          </div>
                        )}
                      </th>
                    ))}

                    {/* Add Field Column Trigger */}
                    <th className="py-2 px-4 w-12 text-center relative" ref={addFieldRef}>
                      <button 
                        onClick={() => {
                          setIsAddFieldOpen(!isAddFieldOpen);
                          setNewFieldPopoverStep('define');
                        }}
                        className="p-1 hover:bg-[#eeeeef] rounded transition-colors text-black border border-gray-300"
                        title="Add custom metadata field (+)"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      {/* Add Field popover dialogs (Matches picture filenames) */}
                      {isAddFieldOpen && newFieldPopoverStep === 'define' && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 p-4 flex flex-col gap-3 font-normal text-left text-[#1a1c1c] animate-scale-in">
                          <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Field Type Downbar Options</h5>
                          
                          <form onSubmit={handleCreateCustomField} className="space-y-3.5">
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#777777] mb-1">Field Name</label>
                              <input 
                                type="text"
                                required
                                value={newFieldName}
                                onChange={(e) => setNewFieldName(e.target.value)}
                                placeholder="e.g. Priority Level"
                                className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#777777] mb-1">Field Type Selection</label>
                              <select
                                value={newFieldType}
                                onChange={(e) => setNewFieldType(e.target.value)}
                                className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                              >
                                <option value="text">Text Select</option>
                                <option value="number">Number Select</option>
                                <option value="date">Date Select</option>
                                <option value="people">People Select</option>
                                <option value="select">Single Select</option>
                                <option value="multiselect">Multi-select</option>
                              </select>
                            </div>

                            {/* Show option creator popped after selecting single/multi select */}
                            {['select', 'multiselect'].includes(newFieldType) && (
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#777777] mb-1">Dropbar Options (Comma separated)</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. Critical, Major, Normal"
                                  value={newFieldOptions}
                                  onChange={(e) => setNewFieldOptions(e.target.value)}
                                  className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                                />
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddFieldOpen(false);
                                  setNewFieldPopoverStep(null);
                                }}
                                className="px-2.5 py-1 border border-[#c6c6c6] text-[10px] font-bold uppercase tracking-wider rounded text-[#777777] hover:bg-[#f3f3f4]"
                              >
                                Close
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded shadow-xs"
                              >
                                Enter to sheet
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {displayGoals.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-16 text-center text-[#777777] italic bg-white">
                        No goals mapped to this view. Get started by clicking "Create Goal".
                      </td>
                    </tr>
                  ) : (
                    displayGoals.map((goal) => (
                      <tr 
                        key={goal._id} 
                        className="border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#fafafb]/50 transition-colors"
                      >
                        
                        {/* Render cells in order of active columns */}
                        {columns.map((col) => {
                          if (col.id === 'name') {
                            return (
                              <td key={col.id} className="py-3 px-4 font-bold text-[#1a1c1c]">
                                <input 
                                  type="text"
                                  value={goal.name}
                                  onChange={(e) => handleUpdateGoalField(goal._id, 'name', e.target.value)}
                                  className="w-full bg-transparent hover:bg-gray-50 border-none outline-none py-0.5 px-1 focus:bg-white rounded transition-colors text-[#1a1c1c]"
                                />
                              </td>
                            );
                          }

                          if (col.id === 'status') {
                            return (
                              <td key={col.id} className="py-3 px-4">
                                <select 
                                  value={goal.status}
                                  onChange={(e) => handleUpdateGoalField(goal._id, 'status', e.target.value)}
                                  className={`border rounded-full px-3 py-0.5 text-[10px] font-semibold font-sans outline-none cursor-pointer ${getStatusBadgeClass(goal.status)}`}
                                >
                                  <option value="On track">On track</option>
                                  <option value="At risk">At risk</option>
                                  <option value="Off track">Off track</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </td>
                            );
                          }

                          if (col.id === 'progress') {
                            return (
                              <td key={col.id} className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-full bg-[#f3f3f4] h-2 rounded-full overflow-hidden border border-[#eeeeee]">
                                    <div 
                                      className={`h-full transition-all duration-500 ${
                                        goal.status === 'On track' ? 'bg-emerald-500' :
                                        goal.status === 'At risk' ? 'bg-amber-500' :
                                        goal.status === 'Completed' ? 'bg-blue-500' :
                                        'bg-rose-500'
                                      }`}
                                      style={{ width: `${goal.progress}%` }}
                                    ></div>
                                  </div>
                                  <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={goal.progress}
                                    onChange={(e) => handleUpdateGoalField(goal._id, 'progress', e.target.value)}
                                    className="w-12 bg-transparent hover:bg-gray-50 text-right font-mono border-none outline-none focus:bg-white p-0.5 rounded"
                                  />
                                  <span className="text-[10px] font-mono text-[#777777]">%</span>
                                </div>
                              </td>
                            );
                          }

                          if (col.id === 'timePeriod') {
                            return (
                              <td key={col.id} className="py-3 px-4 font-semibold text-[#5e5e5e]">
                                <input 
                                  type="text"
                                  value={goal.timePeriod}
                                  onChange={(e) => handleUpdateGoalField(goal._id, 'timePeriod', e.target.value)}
                                  className="w-full bg-transparent hover:bg-gray-50 border-none outline-none py-0.5 px-1 focus:bg-white rounded transition-colors text-[#5e5e5e]"
                                />
                              </td>
                            );
                          }

                          if (col.id === 'owner') {
                            return (
                              <td key={col.id} className="py-3 px-4 font-medium text-[#1a1c1c]">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 bg-pink-100 text-pink-700 font-bold rounded-full flex items-center justify-center text-[9px] shadow-xs select-none uppercase">
                                    {goal.owner.charAt(0)}
                                  </div>
                                  <input 
                                    type="text"
                                    value={goal.owner.split('@')[0]}
                                    onChange={(e) => handleUpdateGoalField(goal._id, 'owner', e.target.value + '@crewflow.com')}
                                    className="bg-transparent hover:bg-gray-50 border-none outline-none py-0.5 px-1 focus:bg-white rounded transition-colors w-24 text-[#1a1c1c] truncate"
                                  />
                                </div>
                              </td>
                            );
                          }

                          if (col.id === 'team') {
                            return (
                              <td key={col.id} className="py-3 px-4 font-semibold text-[#5e5e5e]">
                                <select
                                  value={goal.team}
                                  onChange={(e) => handleUpdateGoalField(goal._id, 'team', e.target.value)}
                                  className="bg-transparent hover:bg-gray-50 border-none outline-none py-0.5 px-1 focus:bg-white rounded cursor-pointer text-[#5e5e5e]"
                                >
                                  <option value="Engineering">Engineering</option>
                                  <option value="Marketing">Marketing</option>
                                  <option value="Design">Design</option>
                                  <option value="Product">Product</option>
                                  <option value="Partnerships">Partnerships</option>
                                </select>
                              </td>
                            );
                          }

                          // Render custom fields
                          return (
                            <td key={col.id} className="py-3 px-4">
                              <input 
                                type={col.fieldType === 'number' ? 'number' : 'text'}
                                value={goal[col.id] !== undefined ? goal[col.id] : ''}
                                onChange={(e) => handleUpdateGoalField(goal._id, col.id, e.target.value)}
                                className="w-full bg-transparent hover:bg-gray-50 border-none outline-none py-0.5 px-1 focus:bg-white rounded text-[#1a1c1c]"
                                placeholder="Enter value..."
                              />
                            </td>
                          );
                        })}

                        {/* Blank cell to align with Add Field header button */}
                        <td className="py-3 px-4"></td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* 4. Strategy Map Visual Hierarchy View */
        <div className="space-y-8 animate-scale-in">
          
          {/* Company Ultimate Vision banner */}
          <div className="relative overflow-hidden p-6 rounded-2xl border border-transparent bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Ultimate Corporate Vision Map</span>
              </div>
              <h3 className="text-base font-bold text-black font-sans leading-tight">Become the #1 Collaboration suite for modern agile teams</h3>
              <p className="text-xs text-[#777777] max-w-xl">Connecting organizational high-level mission goals directly down into actual workspace project blueprints and collaborative milestones.</p>
            </div>
            
            <div className="h-14 w-14 bg-white shadow-md border border-[#e2e2e2] rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
              <Trophy className="h-7 w-7" />
            </div>
          </div>

          {/* Multi-tier Mappings flowchart */}
          <div className="space-y-6">
            
            {/* Tier 1: Parent Objectives */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider px-2">Tier 1: Parent Company Objectives</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {goals.slice(0, 2).map((goal) => (
                  <div key={goal._id} className="border border-[#e2e2e2] bg-white rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3b66c5]" />
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wide ${getStatusBadgeClass(goal.status)}`}>
                          {goal.status}
                        </span>
                        <h5 className="text-xs font-bold text-black mt-2 leading-tight group-hover:underline cursor-pointer">{goal.name}</h5>
                      </div>
                      
                      <div className="h-8 w-8 rounded bg-[#fafafa] border border-[#e2e2e2] flex items-center justify-center text-xs font-bold font-mono">
                        {goal.progress}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#777777] pt-2 border-t border-[#eeeeee]">
                      <span className="font-semibold text-gray-500">Target: {goal.timePeriod}</span>
                      <span className="font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{goal.team} Team</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier 2: Individual and Supporting KR Mappings */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-[#8a8b8c] tracking-wider px-2">Tier 2: Supporting Key Results & Mapped Projects</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {goals.slice(2).map((goal) => {
                  // Connect goal to a mock project
                  const index = goals.indexOf(goal);
                  const connectedProj = projects[index % projects.length] || { name: 'Monochrome Overhaul', _id: 'mock_project_2' };
                  
                  return (
                    <div key={goal._id} className="border border-[#e2e2e2] bg-[#fafafb]/50 hover:bg-white rounded-xl p-4 shadow-xs flex flex-col gap-4 transition-all hover:shadow-md relative overflow-hidden group border-dashed hover:border-solid">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9969c9]" />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wider ${getStatusBadgeClass(goal.status)}`}>
                            {goal.status}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#777777]">{goal.progress}%</span>
                        </div>
                        <h5 className="text-xs font-bold text-black leading-snug">{goal.name}</h5>
                      </div>

                      {/* Connection Project Card links back to active workspace projects */}
                      <div className="mt-2 p-2.5 bg-white border border-[#e2e2e2] rounded-lg flex flex-col gap-1 hover:border-[#1a1c1c] transition-all">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#9969c9] uppercase tracking-wider">
                          <Link2 className="h-3 w-3" />
                          <span>Connected Workspace Project</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (setActiveProjectId) setActiveProjectId(connectedProj._id);
                            if (setActiveView) setActiveView('project-details');
                          }}
                          className="text-[11px] font-bold text-black text-left hover:underline truncate"
                        >
                          {connectedProj.name}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-[#777777] border-t border-[#eeeeee]/60 pt-2.5">
                        <span className="font-semibold">Target: {goal.timePeriod}</span>
                        <span className="font-semibold uppercase bg-[#f3f3f4] text-gray-700 px-1.5 py-0.5 rounded tracking-wide">{goal.team}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StrategyGoalsView;
