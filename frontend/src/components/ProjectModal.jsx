import React, { useState, useEffect } from 'react';
import { X, Plus, Users, Check } from 'lucide-react';

const ProjectModal = ({ token, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users for project modal:', err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleToggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim() === '') {
      setError('Project name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          members: selectedMembers
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        onProjectCreated(newProject);
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create project');
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

        <h3 className="text-xl font-bold text-white mb-1.5 font-sans">Create Project</h3>
        <p className="text-xs text-slate-400 mb-6">Initialize a new project workspace and assign team members.</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Roadmap Planning"
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed objectives and project boundaries..."
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-indigo-400" /> Assign Team Members
            </label>
            <div className="mt-1 max-h-36 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/40 p-2 space-y-1">
              {availableUsers.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No members registered yet.</p>
              ) : (
                availableUsers.map((u) => {
                  const isSelected = selectedMembers.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => handleToggleMember(u._id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-300' 
                          : 'border border-transparent text-slate-400 hover:bg-slate-800/20'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span>{u.email}</span>
                        <span className="text-[9px] text-slate-500">Role: {u.role}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-indigo-400" />}
                    </button>
                  );
                })
              )}
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
                  <Plus className="h-3.5 w-3.5" /> Initialize Project
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProjectModal;
