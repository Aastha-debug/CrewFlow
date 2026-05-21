import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, AlertTriangle } from 'lucide-react';

const TaskModal = ({ token, projects, selectedProjectId, onClose, onTaskCreated }) => {
  const [projectId, setProjectId] = useState(selectedProjectId || '');
  const [assignedTo, setAssignedTo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [projectMembers, setProjectMembers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      const selectedProject = projects.find(p => p._id === projectId);
      if (selectedProject) {
        setProjectMembers(selectedProject.members || []);
        setAssignedTo('');
      }
    } else {
      setProjectMembers([]);
      setAssignedTo('');
    }
  }, [projectId, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!projectId) {
      setError('Please select a project');
      return;
    }

    if (!assignedTo) {
      setError('Please select an assignee');
      return;
    }

    if (!title || title.trim() === '') {
      setError('Task title is required');
      return;
    }

    if (!dueDate) {
      setError('Please select a due date');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId,
          assignedTo,
          title,
          description,
          dueDate,
          priority
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskCreated(newTask);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to assign task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl glass p-6 shadow-2xl glow-border relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800/40 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1.5 font-sans">Create Task</h3>
        <p className="text-xs text-slate-400 mb-6">Assign a specific workflow milestone to a workspace team member.</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Target Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-300 bg-slate-950 focus:text-slate-100"
            >
              <option value="" disabled>-- Choose a Project --</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assignee *</label>
            <select
              required
              disabled={!projectId}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-300 bg-slate-950 focus:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {projectId ? '-- Select a Team Member --' : '-- Choose Project First --'}
              </option>
              {projectMembers.map(m => (
                <option key={m._id} value={m._id}>{m.email}</option>
              ))}
            </select>
            {projectId && projectMembers.length === 0 && (
              <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Warning: No members are assigned to this project yet. Please assign members first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design relational data schemas"
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explicit sub-tasks and acceptance criteria..."
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-300 focus:text-slate-100 bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Priority Tier</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-300 bg-slate-950 focus:text-slate-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white border border-transparent hover:border-slate-800 hover:bg-slate-900/40 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/15"
            >
              {submitting ? (
                <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Assign Task
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TaskModal;
