import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Plus, 
  X, 
  Check, 
  MoreHorizontal, 
  Maximize2, 
  Sliders, 
  Tag, 
  Palette, 
  FolderIcon, 
  Users, 
  Activity, 
  ShieldAlert,
  Search,
  Sparkles,
  ArrowRight,
  Settings,
  Move
} from 'lucide-react';

const StrategyReportingView = ({ projects = [], tasks = [] }) => {
  const [viewAs, setViewAs] = useState('Dashboard'); // 'Dashboard' | 'Grid' | 'List'
  const [isViewAsOpen, setIsViewAsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Overlays Visibility States
  const [isAddDashboardOpen, setIsAddDashboardOpen] = useState(false);
  const [activeTripleDotId, setActiveTripleDotId] = useState(null); // widgetId or null
  const [zoomedWidgetId, setZoomedWidgetId] = useState(null); // widgetId or null
  const [editingWidgetId, setEditingWidgetId] = useState(null); // widgetId or null
  const [colorPickerWidgetId, setColorPickerWidgetId] = useState(null); // widgetId or null
  
  // Custom Color Selection State for Widgets
  const [widgetStyles, setWidgetStyles] = useState({
    widget_1: { color: 'border-l-[#3b66c5]', bg: 'bg-[#3b66c5]/5', iconColor: 'text-[#3b66c5]' },
    widget_2: { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' },
    widget_3: { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' },
    widget_4: { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' }
  });

  // Dynamic Dashboard Widgets List
  const [widgets, setWidgets] = useState([
    {
      id: 'widget_1',
      title: 'Monochrome Overhaul Tasks by Project',
      type: 'bar',
      xAxis: 'Project',
      yAxis: 'Tasks Count',
      chartData: [
        { label: 'Product Launch', value: 2 },
        { label: 'Monochrome Overhaul', value: 1 }
      ]
    },
    {
      id: 'widget_2',
      title: 'Incomplete Tasks by Assignee',
      type: 'doughnut',
      xAxis: 'Assignee',
      yAxis: 'Tasks Volume',
      chartData: [
        { label: 'guest@crewflow.com', value: 2, color: 'bg-[#3b66c5]' },
        { label: 'member@crewflow.com', value: 1, color: 'bg-purple-500' }
      ]
    },
    {
      id: 'widget_3',
      title: 'Strategic Goals Achievement Velocity',
      type: 'line',
      xAxis: 'Timeline',
      yAxis: 'Completion Rate (%)',
      chartData: [
        { label: 'Q1', value: 30 },
        { label: 'Q2', value: 55 },
        { label: 'Q3', value: 65 }
      ]
    },
    {
      id: 'widget_4',
      title: 'Key Objectives Status Breakdown',
      type: 'doughnut',
      xAxis: 'Status',
      yAxis: 'Goals Mapped',
      chartData: [
        { label: 'On track', value: 3, color: 'bg-emerald-500' },
        { label: 'At risk', value: 1, color: 'bg-amber-500' },
        { label: 'Off track', value: 1, color: 'bg-rose-500' }
      ]
    }
  ]);

  // Edit Widget Form state (Scrolled Up/Down popup details)
  const [editTitle, setEditTitle] = useState('');
  const [editChartType, setEditChartType] = useState('bar');
  const [editXAxis, setEditXAxis] = useState('Project');

  // Refs for clicking outside to close
  const viewAsRef = useRef(null);
  const addDashRef = useRef(null);
  const widgetMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (viewAsRef.current && !viewAsRef.current.contains(e.target)) {
        setIsViewAsOpen(false);
      }
      if (addDashRef.current && !addDashRef.current.contains(e.target)) {
        setIsAddDashboardOpen(false);
      }
      if (widgetMenuRef.current && !widgetMenuRef.current.contains(e.target)) {
        setActiveTripleDotId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter widgets by search query
  const filteredWidgets = useMemo(() => {
    if (!searchQuery.trim()) return widgets;
    const q = searchQuery.toLowerCase();
    return widgets.filter(w => w.title.toLowerCase().includes(q));
  }, [widgets, searchQuery]);

  // Add Dynamic Dashboard Widget Handler
  const handleAddNewDashboard = (widgetTitle, widgetType) => {
    const newWidget = {
      id: `widget_${Date.now()}`,
      title: widgetTitle,
      type: widgetType,
      xAxis: 'Project',
      yAxis: 'Metric Values',
      chartData: [
        { label: 'Marketing campaign', value: 3, color: 'bg-blue-500' },
        { label: 'Core architecture overhaul', value: 4, color: 'bg-indigo-500' },
        { label: 'Security checks', value: 2, color: 'bg-purple-500' }
      ]
    };

    setWidgets([...widgets, newWidget]);
    setWidgetStyles(prev => ({
      ...prev,
      [newWidget.id]: { color: 'border-l-indigo-500', bg: 'bg-indigo-500/5', iconColor: 'text-indigo-500' }
    }));
    setIsAddDashboardOpen(false);
  };

  // Open Edit Chart Modal pre-filled
  const handleStartEditWidget = (widget) => {
    setEditingWidgetId(widget.id);
    setEditTitle(widget.title);
    setEditChartType(widget.type);
    setEditXAxis(widget.xAxis);
    setActiveTripleDotId(null);
  };

  // Save Edit Chart changes
  const handleSaveWidgetEdits = (e) => {
    e.preventDefault();
    setWidgets(prev => prev.map(w => {
      if (w.id === editingWidgetId) {
        return {
          ...w,
          title: editTitle,
          type: editChartType,
          xAxis: editXAxis
        };
      }
      return w;
    }));
    setEditingWidgetId(null);
  };

  // Customize Widget Styles (Set Color & Icon)
  const handleSetWidgetStyle = (widgetId, colorName, hexCode) => {
    let styleObj = {
      color: `border-l-[${hexCode}]`,
      bg: `bg-[${hexCode}]/5`,
      iconColor: `text-[${hexCode}]`
    };

    if (colorName === 'emerald') {
      styleObj = { color: 'border-l-emerald-500', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' };
    } else if (colorName === 'pink') {
      styleObj = { color: 'border-l-pink-500', bg: 'bg-pink-500/5', iconColor: 'text-pink-500' };
    } else if (colorName === 'amber') {
      styleObj = { color: 'border-l-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' };
    } else if (colorName === 'purple') {
      styleObj = { color: 'border-l-purple-500', bg: 'bg-purple-500/5', iconColor: 'text-purple-500' };
    } else if (colorName === 'blue') {
      styleObj = { color: 'border-l-blue-500', bg: 'bg-blue-500/5', iconColor: 'text-blue-500' };
    }

    setWidgetStyles(prev => ({
      ...prev,
      [widgetId]: styleObj
    }));
    setColorPickerWidgetId(null);
    setActiveTripleDotId(null);
  };

  // Move Widget Order (Left/Right Swap)
  const handleMoveWidget = (widgetId, direction) => {
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (idx === -1) return;
    
    const newWidgets = [...widgets];
    if (direction === 'left' && idx > 0) {
      const temp = newWidgets[idx - 1];
      newWidgets[idx - 1] = newWidgets[idx];
      newWidgets[idx] = temp;
    } else if (direction === 'right' && idx < widgets.length - 1) {
      const temp = newWidgets[idx + 1];
      newWidgets[idx + 1] = newWidgets[idx];
      newWidgets[idx] = temp;
    }
    
    setWidgets(newWidgets);
    setActiveTripleDotId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-8 py-8 space-y-8 select-none font-sans relative">
      
      {/* Title & View Selection Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e2e2e2] gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c] tracking-tight">Strategy Reporting</h2>
          <p className="text-xs text-[#777777] mt-0.5">Generate analytical dashboard reports and track strategic workspace progress KPIs.</p>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Search dashboard input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Find dashboard widget..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border border-[#c6c6c6] hover:border-[#1a1c1c] rounded outline-none focus:border-[#3b66c5] transition-all bg-[#fafafa] focus:bg-white w-48 placeholder-gray-400 text-black font-semibold"
            />
          </div>

          {/* View As Select Dropdown Menu */}
          <div className="relative" ref={viewAsRef}>
            <button
              onClick={() => setIsViewAsOpen(!isViewAsOpen)}
              className="flex items-center gap-1.5 text-xs font-bold border border-[#c6c6c6] hover:bg-[#f3f3f4] bg-white rounded px-3 py-1.5 text-black"
            >
              <span>View as: {viewAs}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {isViewAsOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1 flex flex-col animate-scale-in text-[#1a1c1c]">
                {['Dashboard', 'Grid', 'List'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setViewAs(mode);
                      setIsViewAsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center justify-between"
                  >
                    <span>{mode}</span>
                    {viewAs === mode && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add dashboard button */}
          <div className="relative" ref={addDashRef}>
            <button
              onClick={() => setIsAddDashboardOpen(!isAddDashboardOpen)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Dashboard</span>
            </button>

            {/* Add/Create Dashboard drawer overlay menu (Matches reporting list sections filenames) */}
            {isAddDashboardOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e2e2e2] rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4 animate-scale-in text-left text-[#1a1c1c] max-h-[380px] overflow-y-auto font-sans">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2 mb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Dashboards Library</h4>
                  <button onClick={() => setIsAddDashboardOpen(false)} className="text-gray-400 hover:text-black">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Section 1: Progress & Work connection */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Progress & Work Connection</span>
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleAddNewDashboard("Goal Achievement Velocity", "line")}
                      className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                    >
                      + Goal Achievement Velocity
                    </button>
                    <button 
                      onClick={() => handleAddNewDashboard("Connected Projects Status Breakdown", "doughnut")}
                      className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                    >
                      + Connected Projects Status Breakdown
                    </button>
                  </div>
                </div>

                {/* Section 2: Recommendation list */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Recommendation List</span>
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleAddNewDashboard("Performance Underachievers Check", "bar")}
                      className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                    >
                      + Underachievers check
                    </button>
                  </div>
                </div>

                {/* Section 3: Resourcing */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Resourcing Mappings</span>
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleAddNewDashboard("Workload capacity metrics", "bar")}
                      className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                    >
                      + Workload capacity chart
                    </button>
                  </div>
                </div>

                {/* Section 4: Work health list */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Work Health metrics</span>
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleAddNewDashboard("Blockers and critical items", "doughnut")}
                      className="w-full text-left p-1.5 hover:bg-[#f5f5f6] text-[11px] font-semibold rounded text-black transition-colors"
                    >
                      + Blockers & critical health chart
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Custom Color Widget Styling Banner */}
      <div className="bg-[#fafafb] border border-[#e2e2e2] p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-[#3b66c5]" />
          <span className="text-xs font-semibold text-[#5e5e5e]">
            Pro-Tip: Click on any chart card's <span className="font-bold text-[#1a1c1c] uppercase tracking-wide">triple dots (...)</span> option downlist to Set colors, edit metrics, or view larger!
          </span>
        </div>
      </div>

      {/* 3. Dynamic Charts Content Grid */}
      <div className={`grid grid-cols-1 ${viewAs === 'Dashboard' ? 'md:grid-cols-2' : viewAs === 'Grid' ? 'md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        
        {filteredWidgets.map((widget, wIdx) => {
          const style = widgetStyles[widget.id] || { color: 'border-l-indigo-500', bg: 'bg-indigo-500/5', iconColor: 'text-indigo-500' };

          return (
            <div 
              key={widget.id} 
              className={`border border-[#e2e2e2] border-l-4 ${style.color} bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[300px] relative hover:shadow-md transition-all group`}
            >
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-lg ${style.bg} ${style.iconColor} flex items-center justify-center flex-shrink-0`}>
                      {widget.type === 'bar' && <BarChart3 className="h-4 w-4" />}
                      {widget.type === 'doughnut' && <PieChart className="h-4 w-4" />}
                      {widget.type === 'line' && <LineChart className="h-4 w-4" />}
                    </div>
                    <h3 className="text-xs font-bold text-black group-hover:underline cursor-pointer">{widget.title}</h3>
                  </div>
                </div>

                {/* Dynamic Options menu click */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveTripleDotId(activeTripleDotId === widget.id ? null : widget.id)}
                    className="p-1 hover:bg-[#f3f3f4] rounded border border-gray-300 text-gray-500 hover:text-black transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Floating triple dot active menu (Asana screenshot copy) */}
                  {activeTripleDotId === widget.id && (
                    <div 
                      ref={widgetMenuRef}
                      className="absolute right-0 mt-1.5 w-48 bg-white border border-[#e2e2e2] rounded-lg shadow-xl z-50 py-1.5 flex flex-col text-[#1a1c1c] font-normal animate-scale-in"
                    >
                      <button
                        onClick={() => handleStartEditWidget(widget)}
                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                      >
                        <Sliders className="h-3.5 w-3.5 text-gray-400" />
                        <span>Edit chart</span>
                      </button>

                      <button
                        onClick={() => setZoomedWidgetId(widget.id)}
                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                        <span>View larger</span>
                      </button>

                      {/* Set Color & Icon Options Popover */}
                      <button
                        onClick={() => setColorPickerWidgetId(widget.id)}
                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                      >
                        <Palette className="h-3.5 w-3.5 text-gray-400" />
                        <span>Set color & icon</span>
                      </button>

                      <div className="border-t border-[#eeeeee] my-1"></div>

                      {/* Move Order swaps */}
                      {wIdx > 0 && (
                        <button
                          onClick={() => handleMoveWidget(widget.id, 'left')}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                        >
                          <Move className="h-3.5 w-3.5 text-gray-400" />
                          <span>Move Left</span>
                        </button>
                      )}

                      {wIdx < widgets.length - 1 && (
                        <button
                          onClick={() => handleMoveWidget(widget.id, 'right')}
                          className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-black flex items-center gap-2"
                        >
                          <Move className="h-3.5 w-3.5 text-gray-400" />
                          <span>Move Right</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          alert("Export actions added to charts (PDF share queue running weekly)!");
                          setActiveTripleDotId(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f6] font-semibold text-[#3b66c5] flex items-center gap-2"
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span>Add actions</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Color picker sub-dropdown */}
              {colorPickerWidgetId === widget.id && (
                <div className="mt-4 p-3 bg-[#f8f9fa] border border-[#e2e2e2] rounded-lg animate-scale-in flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Set Color and Icon palette</span>
                  <div className="flex items-center flex-wrap gap-2">
                    <button onClick={() => handleSetWidgetStyle(widget.id, 'blue', '#3b66c5')} className="h-5 w-5 rounded-full bg-[#3b66c5] border border-white hover:scale-110 transition-transform" />
                    <button onClick={() => handleSetWidgetStyle(widget.id, 'pink', '#ec4899')} className="h-5 w-5 rounded-full bg-pink-500 border border-white hover:scale-110 transition-transform" />
                    <button onClick={() => handleSetWidgetStyle(widget.id, 'emerald', '#10b981')} className="h-5 w-5 rounded-full bg-emerald-500 border border-white hover:scale-110 transition-transform" />
                    <button onClick={() => handleSetWidgetStyle(widget.id, 'amber', '#f59e0b')} className="h-5 w-5 rounded-full bg-amber-500 border border-white hover:scale-110 transition-transform" />
                    <button onClick={() => handleSetWidgetStyle(widget.id, 'purple', '#8b5cf6')} className="h-5 w-5 rounded-full bg-purple-500 border border-white hover:scale-110 transition-transform" />
                  </div>
                </div>
              )}

              {/* Chart Visual Simulation (Sleek Canvas mockup) */}
              <div className="flex-1 flex flex-col justify-end py-6 min-h-[140px]">
                
                {widget.type === 'bar' && (
                  <div className="flex items-end justify-around h-28 border-b border-[#eeeeee] pb-1.5 px-3">
                    {widget.chartData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                        <div 
                          className="w-8 bg-[#3b66c5] rounded-t hover:opacity-85 transition-opacity" 
                          style={{ height: `${data.value * 35}px` }}
                          title={`${data.label}: ${data.value}`}
                        ></div>
                        <span className="text-[9px] text-[#777777] font-semibold text-center truncate w-full">{data.label.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {widget.type === 'doughnut' && (
                  <div className="flex items-center justify-center gap-6 h-28">
                    {/* Simulated SVG doughnut circle */}
                    <div className="relative h-20 w-20 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="h-full w-full rotate-[-90deg]">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eee" strokeWidth="4" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b66c5" strokeWidth="4.2" strokeDasharray="60 40" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-60" strokeLinecap="round" />
                      </svg>
                      <div className="absolute h-10 w-10 bg-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {widget.chartData.reduce((acc, curr) => acc + curr.value, 0)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {widget.chartData.map((data, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[9px] font-bold text-[#5e5e5e]">
                          <div className={`h-2.5 w-2.5 rounded-full ${data.color || 'bg-[#3b66c5]'}`} />
                          <span className="truncate w-24 text-left">{data.label.split('@')[0]} ({data.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {widget.type === 'line' && (
                  <div className="relative h-28 border-b border-[#eeeeee] pb-1.5 px-3 flex items-end">
                    {/* Simulated SVG Line graph path */}
                    <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full p-2 overflow-visible">
                      <path 
                        d="M 10 30 L 50 15 L 90 8" 
                        fill="none" 
                        stroke="#3b66c5" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="30" r="2.5" fill="#3b66c5" />
                      <circle cx="50" cy="15" r="2.5" fill="#3b66c5" />
                      <circle cx="90" cy="8" r="2.5" fill="#3b66c5" />
                    </svg>

                    <div className="flex items-center justify-between w-full text-[9px] text-[#777777] font-semibold">
                      {widget.chartData.map((data, idx) => (
                        <span key={idx}>{data.label} ({data.value}%)</span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-3 border-t border-[#eeeeee]/60">
                <span>Grouping by: {widget.xAxis}</span>
                <span className="font-bold text-[#5e5e5e] uppercase tracking-wider">{widget.yAxis}</span>
              </div>

            </div>
          );
        })}

      </div>

      {/* 4. Zoomed Widget Modal overlay (View Larger Option) */}
      {zoomedWidgetId && (() => {
        const zWidget = widgets.find(w => w.id === zoomedWidgetId);
        if (!zWidget) return null;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-2xl p-6 relative flex flex-col justify-between gap-6">
              
              <button 
                onClick={() => setZoomedWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Maximize2 className="h-4.5 w-4.5 text-[#3b66c5]" />
                  <span>{zWidget.title} (View Larger Mode)</span>
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">High-contrast metrics summary connected directly to active projects.</p>
              </div>

              {/* Large Chart Area */}
              <div className="h-64 border border-[#e2e2e2] bg-[#fafafb] rounded-lg flex items-center justify-center p-6">
                
                {zWidget.type === 'bar' && (
                  <div className="flex items-end justify-around w-full max-w-md h-48 border-b border-[#eeeeee] pb-2 px-6">
                    {zWidget.chartData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-24">
                        <div className="w-12 bg-[#3b66c5] rounded-t" style={{ height: `${data.value * 50}px` }}></div>
                        <span className="text-[10px] font-bold text-[#1a1c1c] text-center truncate w-full">{data.label}</span>
                        <span className="text-[9px] font-mono text-gray-400">({data.value})</span>
                      </div>
                    ))}
                  </div>
                )}

                {zWidget.type === 'doughnut' && (
                  <div className="flex items-center justify-around w-full max-w-md gap-6">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="h-full w-full rotate-[-90deg]">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eee" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b66c5" strokeWidth="3.8" strokeDasharray="60 40" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a78bfa" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="-60" />
                      </svg>
                      <div className="absolute h-16 w-16 bg-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
                        {zWidget.chartData.reduce((acc, curr) => acc + curr.value, 0)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {zWidget.chartData.map((data, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#5e5e5e]">
                          <div className={`h-3 w-3 rounded-full ${data.color || 'bg-[#3b66c5]'}`} />
                          <span>{data.label}: {data.value} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {zWidget.type === 'line' && (
                  <div className="relative w-full max-w-md h-44 border-b border-[#eeeeee] pb-2 px-6 flex items-end">
                    <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full p-6 overflow-visible">
                      <path d="M 10 30 L 50 15 L 90 8" fill="none" stroke="#3b66c5" strokeWidth="3" />
                      <circle cx="10" cy="30" r="3.5" fill="#3b66c5" />
                      <circle cx="50" cy="15" r="3.5" fill="#3b66c5" />
                      <circle cx="90" cy="8" r="3.5" fill="#3b66c5" />
                    </svg>
                    <div className="flex items-center justify-between w-full text-[10px] text-gray-500 font-bold">
                      {zWidget.chartData.map((data, idx) => (
                        <span key={idx}>{data.label} ({data.value}%)</span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="flex justify-end pt-2 border-t border-[#eeeeee]">
                <button 
                  onClick={() => setZoomedWidgetId(null)}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded shadow-sm hover:bg-neutral-800"
                >
                  Close View
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 5. Edit Chart Modal Popover overlay (Scrolled Up/Down Popup details) */}
      {editingWidgetId && (() => {
        const eWidget = widgets.find(w => w.id === editingWidgetId);
        if (!eWidget) return null;

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in select-none">
            <div className="bg-white rounded-xl border border-[#e2e2e2] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-5">
              
              <button 
                onClick={() => setEditingWidgetId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-[#f3f3f4] rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <Sliders className="h-4.5 w-4.5 text-[#3b66c5]" />
                  <span>Edit Chart Specifications</span>
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">Customize X-Axis groups, chart visualization types, and titles.</p>
              </div>

              <form onSubmit={handleSaveWidgetEdits} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Chart Title</label>
                  <input 
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  />
                </div>

                {/* Chart Type */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Visualization Type</label>
                  <select
                    value={editChartType}
                    onChange={(e) => setEditChartType(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                    <option value="line">Line Chart</option>
                  </select>
                </div>

                {/* X-Axis */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Grouping Parameter (X-Axis)</label>
                  <select
                    value={editXAxis}
                    onChange={(e) => setEditXAxis(e.target.value)}
                    className="w-full text-xs p-2 border border-[#c6c6c6] bg-white rounded outline-none focus:border-[#3b66c5]"
                  >
                    <option value="Project">Project Name</option>
                    <option value="Assignee">Assignee Email</option>
                    <option value="Status">Objective Status</option>
                    <option value="Timeline">Timeline / Quarterly</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#eeeeee] mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingWidgetId(null)}
                    className="px-3 py-1.5 border border-[#c6c6c6] text-xs font-semibold rounded text-[#5e5e5e] hover:bg-[#f3f3f4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#3b66c5] hover:bg-[#2e55aa] text-white text-xs font-bold rounded shadow-xs"
                  >
                    Save Specifications
                  </button>
                </div>

              </form>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default StrategyReportingView;
