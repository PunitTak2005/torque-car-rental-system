import React from 'react';
import { Users, UserCheck, Ban, ArrowUpRight } from 'lucide-react';

const RecentUsers = ({
  users = [],
  onToggleUserRole,
  onToggleUserStatus,
  onViewAll
}) => {
  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
              RECENT REGISTERED USERS
            </h3>
          </div>
          <p className="text-xs text-silver/70">
            Customer directory & role/status moderation
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="px-4 py-2 bg-neon-accent/10 hover:bg-neon-accent hover:text-asphalt text-neon-accent font-extrabold text-[9px] border border-neon-accent/30 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-widest rounded-xl"
          >
            <span>User Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-asphalt border-b border-white/10 text-silver uppercase font-extrabold tracking-widest text-[9px]">
              <th className="p-4">Customer Details</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[10px] tracking-wider">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-silver/60 italic uppercase tracking-widest">
                  No users found in directory logs.
                </td>
              </tr>
            ) : (
              users.slice(0, 6).map((u) => (
                <tr key={u._id} className="hover:bg-asphalt/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-asphalt border border-white/10 flex items-center justify-center font-extrabold text-neon-accent text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-chalk uppercase">
                          {u.name}
                        </h4>
                        <span className="text-[9px] text-silver/60 block lowercase">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full uppercase tracking-widest ${
                      u.role === 'admin'
                        ? 'bg-neon-accent/20 text-neon-accent border border-neon-accent/40'
                        : 'bg-white/5 text-silver border border-white/10'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full uppercase tracking-widest ${
                      u.status === 'active' || !u.status
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {u.status || 'active'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onToggleUserRole && onToggleUserRole(u._id, u.role)}
                        className="p-2 bg-asphalt hover:bg-white/10 text-silver hover:text-neon-accent border border-white/10 rounded-xl transition-all cursor-pointer"
                        title="Toggle admin role"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleUserStatus && onToggleUserStatus(u._id, u.status)}
                        className="p-2 bg-asphalt hover:bg-rose-955 text-silver hover:text-rose-400 border border-white/10 rounded-xl transition-all cursor-pointer"
                        title="Toggle account suspension"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentUsers;
