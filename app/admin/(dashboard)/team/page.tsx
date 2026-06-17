'use client'

import { useState, useEffect } from 'react'
import { getTeamMembers, createTeamMember, deleteTeamMember } from '@/lib/team-actions'
import { UserPlus, Shield, User, Trash2, Mail } from 'lucide-react'

type TeamMember = {
  id: string
  email: string
  fullName: string
  role: string
  lastSignInAt?: string
  createdAt?: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    setLoading(true)
    const { data, error } = await getTeamMembers()
    if (error) setError(error)
    if (data) setMembers(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsCreating(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTeamMember(formData)

    if (result.error) {
      setFormError(result.error)
      setIsCreating(false)
      return
    }

    // Success
    ;(e.target as HTMLFormElement).reset()
    await loadTeamMembers()
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member? This cannot be undone.')) return

    const result = await deleteTeamMember(id)
    if (result.error) {
      alert(result.error)
      return
    }
    
    await loadTeamMembers()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage admins and editors</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name / Email</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Role</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Joined</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading team members...</td>
                      </tr>
                    ) : members.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No team members found.</td>
                      </tr>
                    ) : (
                      members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-500" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {member.fullName || 'No Name'}
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              member.role === 'admin' 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                            }`}>
                              {member.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Create Member Form */}
          <div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Team Member</h2>
              </div>

              {formError && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-2"
                >
                  {isCreating ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
