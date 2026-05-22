import React, { useState, useEffect } from 'react';
import { X, Plus, Users, Check } from 'lucide-react';

const ProjectModal = ({ token, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mockUsers = [
    { _id: 'guest_id', email: 'guest@crewflow.com', role: 'Admin' },
    { _id: 'member_id_1', email: 'member@crewflow.com', role: 'Member' },
    { _id: 'admin_id_1', email: 'admin@crewflow.com', role: 'Admin' }
  ];

  useEffect(() => {
    if (!token) {
      setAvailableUsers(mockUsers);
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableUsers(data.length > 0 ? data : mockUsers);
        } else {
          setAvailableUsers(mockUsers);
        }
      } catch (err) {
        console.error('Error fetching users for project modal:', err);
        setAvailableUsers(mockUsers);
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

    if (!token) {
      // Simulate client-side project creation!
      setTimeout(() => {
        const newProject = {
          _id: `mock_project_${Date.now()}`,
          name: name.trim(),
          description: description,
          createdBy: 'guest_id',
          members: selectedMembers.map(memberId => {
            const matched = mockUsers.find(u => u._id === memberId);
            return matched ? { _id: matched._id, email: matched.email, role: matched.role } : { _id: memberId, email: 'collaborator@crewflow.com', role: 'Member' };
          })
        };
        onProjectCreated(newProject);
        setSubmitting(false);
      }, 300);
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rounded glass p-6 shadow-xl relative bg-white border border-[#e2e2e2]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#000000] rounded p-1 hover:bg-[#f3f3f4] transition-all"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <h3 className="text-base font-bold text-[#1a1c1c] mb-1 font-sans">Create Project</h3>
        <p className="text-[11px] text-[#5e5e5e] mb-6">Initialize a new project workspace and assign team members.</p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Roadmap Planning"
              className="glass-input block w-full rounded py-2 px-3 text-xs placeholder-[#a0a0a0]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed objectives and project boundaries..."
              className="glass-input block w-full rounded py-2 px-3 text-xs placeholder-[#a0a0a0]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] mb-1.5 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-[#5e5e5e]" /> Assign Team Members
            </label>
            <div className="mt-1 max-h-36 overflow-y-auto rounded border border-[#e2e2e2] bg-[#f9f9f9] p-2 space-y-1">
              {availableUsers.length === 0 ? (
                <p className="text-xs text-[#777777] text-center py-4 italic">No members registered yet.</p>
              ) : (
                availableUsers.map((u) => {
                  const isSelected = selectedMembers.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => handleToggleMember(u._id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-black text-white border-black shadow-sm' 
                          : 'border-transparent text-[#5e5e5e] hover:bg-[#eeeeee]'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span>{u.email}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-[#c6c6c6]' : 'text-[#8a8b8c]'}`}>Role: {u.role}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#eeeeee]">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[#c6c6c6] px-4 py-2 text-xs font-semibold text-[#5e5e5e] hover:text-[#000000] hover:bg-[#f3f3f4] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-black text-xs font-bold py-2.5 px-4 flex items-center gap-1.5"
            >
              {submitting ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 text-white" /> Initialize Project
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
