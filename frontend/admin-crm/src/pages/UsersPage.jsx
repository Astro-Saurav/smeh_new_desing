import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import { usersApi } from '../api/usersApi'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { TableSkeleton } from '../components/Skeletons'

export function UsersPage () {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('editor')
  const [pendingDelete, setPendingDelete] = useState(null)

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
    refetchInterval: 30000
  })

  const createMutation = useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previous = queryClient.getQueryData(['users'])
      const optimisticUser = {
        id: `temp-${Date.now()}`,
        email: payload.email,
        role: payload.role,
        created_at: new Date().toISOString()
      }

      queryClient.setQueryData(['users'], (old = []) => [optimisticUser, ...old])
      return { previous }
    },
    onError: (error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['users'], context.previous)
      }
      toast.error(error.response?.data?.message || 'Failed to create user')
    },
    onSuccess: () => {
      toast.success('User created')
      setEmail('')
      setPassword('')
      setRole('editor')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previous = queryClient.getQueryData(['users'])
      queryClient.setQueryData(['users'], (old = []) => old.filter((item) => item.id !== id))
      return { previous }
    },
    onError: (error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['users'], context.previous)
      }
      toast.error(error.response?.data?.message || 'Failed to delete user')
    },
    onSuccess: () => {
      toast.success('User deleted')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  if (user?.role !== 'admin') {
    return <article className="panel">Only admins can access user management.</article>
  }

  const onSubmit = (event) => {
    event.preventDefault()
    createMutation.mutate({ email, password, role })
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Administration"
        title="User Management"
        subtitle="Provision editor/admin accounts while maintaining strict access control."
      />

      <article className="panel stack-md">
        <h3>Create User</h3>
        <form className="grid-three" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="user@manavrachna.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Strong password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </article>

      <article className="panel stack-md">
        <h3>Users</h3>
        {usersQuery.isLoading && <TableSkeleton rows={6} />}
        {usersQuery.error && <p className="error">Failed to load users.</p>}
        {!usersQuery.isLoading && !usersQuery.error && usersQuery.data.length === 0 && (
          <EmptyState
            title="No users available"
            message="Create an editor or admin account to start collaborative publishing."
          />
        )}

        {!usersQuery.isLoading && !usersQuery.error && usersQuery.data.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn ghost danger"
                        onClick={() => setPendingDelete(item)}
                        disabled={item.id === user.id || deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete user"
        message={`This will permanently remove ${pendingDelete?.email || 'this user'}.`}
        confirmLabel="Delete user"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete.id)
            setPendingDelete(null)
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

