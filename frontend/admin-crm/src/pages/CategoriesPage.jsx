import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { categoriesApi } from '../api/categoriesApi'
import { EmptyState } from '../components/EmptyState'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { TableSkeleton } from '../components/Skeletons'

export function CategoriesPage () {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
    refetchInterval: 30000
  })

  const createMutation = useMutation({
    mutationFn: (payload) => categoriesApi.create(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })
      const previous = queryClient.getQueryData(['categories'])
      const optimisticRow = {
        id: `temp-${Date.now()}`,
        name: payload.name,
        created_at: new Date().toISOString()
      }

      queryClient.setQueryData(['categories'], (old = []) => [...old, optimisticRow])
      return { previous }
    },
    onSuccess: () => {
      toast.success('Category created')
      setName('')
    },
    onError: (mutationError, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous)
      }
      toast.error(mutationError.response?.data?.message || 'Failed to create category')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    createMutation.mutate({ name })
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Taxonomy"
        title="Category Management"
        subtitle="Keep classification clean so editors can publish quickly and readers can discover content faster."
      />

      <article className="panel">
        <h3>Add Category</h3>
        <form className="inline-form" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="e.g. Campus Buzz"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <button type="submit" className="btn primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </article>

      <article className="panel">
        <h3>All Categories</h3>
        {isLoading && <TableSkeleton rows={6} />}
        {error && <p className="error">Failed to load categories.</p>}
        {!isLoading && !error && data.length === 0 && (
          <EmptyState
            title="No categories yet"
            message="Create your first category to organize news stories by theme."
          />
        )}

        {!isLoading && !error && data.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        type="button" 
                        className="btn ghost danger" 
                        onClick={() => setPendingDelete(item)}
                        disabled={deleteMutation.isPending}
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
    </div>
  )
}

