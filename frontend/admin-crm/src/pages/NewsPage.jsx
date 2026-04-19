import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesApi } from '../api/categoriesApi'
import { newsApi } from '../api/newsApi'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { RichEditor } from '../components/RichEditor'
import { TableSkeleton } from '../components/Skeletons'
import { useAuth } from '../context/AuthContext'

const initialForm = {
  title: '',
  content: '',
  categoryId: '',
  imageUrl: '',
  youtubeUrl: '',
  status: 'draft',
  publishedAt: ''
}

export function NewsPage () {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        setIsUploadingImage(true)
        const result = await newsApi.uploadImage({
          base64Data: reader.result,
          fileName: file.name,
          mimeType: file.type
        })
        setForm((value) => ({ ...value, imageUrl: result.url || '' }))
        toast.success('Image uploaded')
      } catch (error) {
        toast.error(error.response?.data?.error || 'Image upload failed')
      } finally {
        setIsUploadingImage(false)
      }
    }
    reader.onerror = () => {
      toast.error('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const queryParams = useMemo(() => ({
    page,
    pageSize: 10,
    search: search || undefined,
    category: category || undefined,
    status: status || undefined
  }), [page, search, category, status])

  const newsQuery = useQuery({
    queryKey: ['news', queryParams],
    queryFn: () => newsApi.list(queryParams),
    refetchInterval: 15000
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list()
  })

  const createMutation = useMutation({
    mutationFn: (payload) => newsApi.create(payload),
    onSuccess: () => {
      toast.success('News created')
      setForm(initialForm)
      queryClient.invalidateQueries({ queryKey: ['news'] })
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create news')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => newsApi.update(id, payload),
    onSuccess: () => {
      toast.success('News updated')
      setForm(initialForm)
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ['news'] })
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update news')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => newsApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['news'] })
      const previousSnapshots = queryClient.getQueriesData({ queryKey: ['news'] })

      queryClient.setQueriesData({ queryKey: ['news'] }, (old) => {
        if (!old?.items) {
          return old
        }

        return {
          ...old,
          items: old.items.filter((item) => (item._id || item.id) !== id)
        }
      })

      return { previousSnapshots }
    },
    onSuccess: () => {
      toast.success('News deleted')
      queryClient.invalidateQueries({ queryKey: ['news'] })
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] })
    },
    onError: (error, _, context) => {
      if (context?.previousSnapshots) {
        for (const [key, value] of context.previousSnapshots) {
          queryClient.setQueryData(key, value)
        }
      }
      toast.error(error.response?.data?.message || 'Failed to delete news')
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()

    const payload = {
      title: form.title,
      content: form.content,
      categoryId: String(form.categoryId),
      imageUrl: form.imageUrl || null,
      youtubeUrl: form.youtubeUrl || null,
      status: form.status,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload })
      return
    }

    createMutation.mutate(payload)
  }

  const startEdit = (item) => {
    setEditingId(item._id || item.id)
    setForm({
      title: item.title,
      content: item.content,
      categoryId: String((item.category?._id || '')),
      imageUrl: item.image_url || '',
      youtubeUrl: item.youtube_url || item.youtubeUrl || '',
      status: item.status,
      publishedAt: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : ''
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setStatus('')
    setPage(1)
  }

  const pagination = newsQuery.data?.pagination

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Editorial"
        title="News Management"
        subtitle="Create, schedule, and update stories with a clear publishing workflow."
        actions={(
          <button type="button" className="btn ghost" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      />

      <article className="panel stack-md">
        <h3>{editingId ? 'Edit News' : 'Create News'}</h3>
        <form className="stack-md" onSubmit={onSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
            required
          />

          <RichEditor
            value={form.content}
            onChange={(content) => setForm((value) => ({ ...value, content }))}
          />

          <div className="grid-two">
            <select
              value={form.categoryId}
              onChange={(event) => setForm((value) => ({ ...value, categoryId: event.target.value }))}
              required
            >
              <option value="">Select category</option>
              {(categoriesQuery.data || []).map((item) => (
                <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="grid-two">
            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(event) => setForm((value) => ({ ...value, imageUrl: event.target.value }))}
            />
            <input
              placeholder="YouTube URL"
              value={form.youtubeUrl}
              onChange={(event) => setForm((value) => ({ ...value, youtubeUrl: event.target.value }))}
            />
          </div>

          <div className="grid-two">
            <div className="stack-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />
              {isUploadingImage && <p className="helper-text">Uploading image...</p>}
            </div>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) => setForm((value) => ({ ...value, publishedAt: event.target.value }))}
              disabled={form.status === 'draft'}
            />
          </div>

          <div className="action-row">
            <button type="submit" className="btn primary" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Update news' : 'Create news'}
            </button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={resetForm}>Cancel edit</button>
            )}
          </div>
          <p className="helper-text">
            Tip: Use "Scheduled" status with a date-time to automate publishing through the backend scheduler.
          </p>
        </form>
      </article>

      <article className="panel stack-md">
        <div className="grid-three">
          <input placeholder="Search title/content" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {(categoriesQuery.data || []).map((item) => (
              <option key={item._id || item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {newsQuery.isLoading && <TableSkeleton rows={8} />}
        {newsQuery.error && <p className="error">Unable to load news.</p>}

        {!newsQuery.isLoading && !newsQuery.error && newsQuery.data.items.length === 0 && (
          <EmptyState
            title="No news found"
            message="Try adjusting filters, or create a new story to get started."
            action={(
              <button type="button" className="btn ghost" onClick={clearFilters}>Reset filters</button>
            )}
          />
        )}

        {!newsQuery.isLoading && !newsQuery.error && newsQuery.data.items.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsQuery.data.items.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>{item.title}</td>
                      <td>{(item.category?.name || 'Uncategorized')}</td>
                      <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                      <td>{item.published_at ? new Date(item.published_at).toLocaleString() : '-'}</td>
                      <td>
                        <div className="action-row">
                          <button type="button" className="btn ghost" onClick={() => startEdit(item)}>Edit</button>
                          {user?.role === 'admin' && (
                            <button
                              type="button"
                              className="btn ghost danger"
                              onClick={() => setPendingDelete(item)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <button type="button" className="btn ghost" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </button>
              <span>Page {pagination?.page || 1} of {pagination?.totalPages || 1}</span>
              <button
                type="button"
                className="btn ghost"
                disabled={!pagination || page >= pagination.totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </article>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete story"
        message={`This will permanently remove "${pendingDelete?.title || ''}".`}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate((pendingDelete._id || pendingDelete.id))
            setPendingDelete(null)
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
