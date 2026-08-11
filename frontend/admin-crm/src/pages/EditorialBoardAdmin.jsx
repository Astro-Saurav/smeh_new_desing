import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { editorialApi } from '../api/editorialApi'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { TableSkeleton } from '../components/Skeletons'

export function EditorialBoardAdmin () {
  const queryClient = useQueryClient()
  const [roleName, setRoleName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')

  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ['editorialRoles'],
    queryFn: () => editorialApi.listRoles(),
    refetchInterval: 30000
  })

  const createRoleMutation = useMutation({
    mutationFn: (payload) => editorialApi.createRole(payload),
    onSuccess: () => {
      toast.success('Role created')
      setRoleName('')
      queryClient.invalidateQueries({ queryKey: ['editorialRoles'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create role')
    }
  })

  const deleteRoleMutation = useMutation({
    mutationFn: (id) => editorialApi.removeRole(id),
    onSuccess: () => {
      toast.success('Role deleted')
      queryClient.invalidateQueries({ queryKey: ['editorialRoles'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete role')
    }
  })

  const createMemberMutation = useMutation({
    mutationFn: (payload) => editorialApi.createMember(payload),
    onSuccess: () => {
      toast.success('Member added')
      setMemberName('')
      queryClient.invalidateQueries({ queryKey: ['editorialRoles'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add member')
    }
  })

  const deleteMemberMutation = useMutation({
    mutationFn: (id) => editorialApi.removeMember(id),
    onSuccess: () => {
      toast.success('Member removed')
      queryClient.invalidateQueries({ queryKey: ['editorialRoles'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove member')
    }
  })

  const onRoleSubmit = (event) => {
    event.preventDefault()
    createRoleMutation.mutate({ name: roleName })
  }

  const onMemberSubmit = (event) => {
    event.preventDefault()
    if (!selectedRoleId) {
      toast.error('Select a role first')
      return
    }
    createMemberMutation.mutate({ name: memberName, role_id: selectedRoleId })
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Organization"
        title="Editorial Board"
        subtitle="Manage the hierarchy of editors and board members."
      />

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <article className="panel">
          <h3>Add Role</h3>
          <form className="inline-form" onSubmit={onRoleSubmit}>
            <input
              type="text"
              placeholder="e.g. Editor-in-Chief"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              required
            />
            <button type="submit" className="btn primary" disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </form>
        </article>

        <article className="panel">
          <h3>Add Member</h3>
          <form className="stack" onSubmit={onMemberSubmit}>
            <div className="form-group">
              <label>Role</label>
              <select 
                value={selectedRoleId} 
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
              >
                <option value="">Select a role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="inline-form">
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                required
              />
              <button type="submit" className="btn primary" disabled={createMemberMutation.isPending}>
                {createMemberMutation.isPending ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </article>
      </div>

      <article className="panel">
        <h3>Board Hierarchy</h3>
        {isLoading && <TableSkeleton rows={4} />}
        {error && <p className="error">Failed to load editorial board.</p>}
        
        {!isLoading && !error && roles.length === 0 && (
          <EmptyState
            title="No roles defined"
            message="Start by adding the first editorial role."
          />
        )}

        {!isLoading && !error && roles.length > 0 && (
          <div className="stack-lg">
            {roles.map((role) => (
              <div key={role.id} className="card p-4">
                <div className="flex-between mb-4">
                  <h4 className="m-0">{role.name}</h4>
                  <button 
                    className="btn ghost danger sm"
                    onClick={() => deleteRoleMutation.mutate(role.id)}
                    disabled={deleteRoleMutation.isPending || role.members.length > 0}
                    title={role.members.length > 0 ? 'Cannot delete role with active members' : 'Delete role'}
                  >
                    Delete Role
                  </button>
                </div>
                
                {role.members && role.members.length > 0 ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Member Name</th>
                          <th>Added</th>
                          <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {role.members.map((member) => (
                          <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{new Date(member.created_at).toLocaleDateString()}</td>
                            <td>
                              <button 
                                type="button" 
                                className="btn ghost danger sm" 
                                onClick={() => deleteMemberMutation.mutate(member.id)}
                                disabled={deleteMemberMutation.isPending}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-sm m-0">No members assigned to this role yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
