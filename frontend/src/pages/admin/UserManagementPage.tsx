import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.service.js';
import { User, Role } from '../../types/index.js';
import {
  Search,
  UserPlus,
  X,
  Mail,
  Phone,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Create Staff Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('KITCHEN_STAFF');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status !== 'ACTIVE';
    try {
      await AdminService.toggleUserStatus(user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus ? 'ACTIVE' : 'INACTIVE' } : u))
      );
    } catch (e: any) {
      alert(e.message || 'Failed to update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdminService.createUser({ name, email, phone, password, role });
      setModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to create user account');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Access & Accounts</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">User Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor registered student accounts, manage kitchen staff credentials, and enforce access control.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 font-bold shadow-3d-btn"
        >
          <UserPlus className="w-4 h-4" /> Add Staff Account
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card-3d p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or staff name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-elevated border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-2 px-3 rounded-xl bg-dark-elevated border border-white/10 text-xs font-semibold text-slate-200 focus:border-brand-500 w-full sm:w-auto"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students Only</option>
          <option value="KITCHEN_STAFF">Kitchen Staff</option>
          <option value="ADMIN">System Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-elevated/80 border-b border-white/[0.08] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 font-black flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-500">{u.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="text-slate-300 font-medium block flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> {u.email}
                      </span>
                      {u.phone && (
                        <span className="text-slate-500 text-[10px] block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-950/70 text-purple-300 border-purple-500/30'
                          : u.role === 'KITCHEN_STAFF'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                          : 'bg-dark-elevated text-slate-300 border-white/5'
                      }`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-950/70 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.email !== 'admin@campusbite.local' && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-xs font-bold py-1 px-3 rounded-xl transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'text-rose-400 hover:bg-rose-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d max-w-md w-full p-6 space-y-4 border border-brand-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-bold text-white text-base">Create Staff Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Chef Name / Admin Name"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@campusbite.local"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white font-bold focus:border-brand-500"
                >
                  <option value="KITCHEN_STAFF">Kitchen Staff (Kitchen Display & Prep)</option>
                  <option value="ADMIN">System Administrator (Full Access)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold shadow-3d-btn">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
