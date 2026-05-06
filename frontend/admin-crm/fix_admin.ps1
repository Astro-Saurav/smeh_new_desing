$code = @'
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
  publishedAt: '',
  isFeatured: false
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

  const compressImage = (file) => new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = reject
    img.src = objectUrl
  })

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    try {
      setIsUploadingImage(true)
      const compressed = await compressImage(file)
      const result = await newsApi.uploadImage({
        base64Data: compressed,
        fileName: file.name.replace(/\.[^.]+$/, '.jpg'),
        mimeType: 'image/jpeg'
      })
      setForm((value) => ({ ...value, imageUrl: result.url || '' }))
      toast.success('Image uploaded successfully!')
      event.target.value = null
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setIsUploadingImage(false)
    }
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
    },
    onError: () => toast.error('Failed to create news')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => newsApi.update(id, payload),
    onSuccess: () => {
      toast.success('News updated')
      setForm(initialForm)
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: () => toast.error('Failed to update news')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => newsApi.remove(id),
    onSuccess: () => {
      toast.success('News deleted')
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: () => toast.error('Failed to delete news')
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
      isFeatured: !!form.isFeatured,
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
      isFeatured: !!item.is_featured,
      publishedAt: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : ''
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const pagination = newsQuery.data?.pagination

  return (
    <div className='stack-lg'>
      <PageHeader
        eyebrow='Editorial'
        title='News Management'
        subtitle='Create, schedule, and update stories.'
        actions={(
          <button type='button' className='btn ghost' onClick={() => {setSearch(''); setCategory(''); setStatus(''); setPage(1)}}>
            Clear filters
          </button>
        )}
      />

      <article className='panel stack-md'>
        <h3>{editingId ? 'Edit News' : 'Create News'}</h3>
        <form className='stack-md' onSubmit={onSubmit}>
          <input
            placeholder='Title'
            value={form.title}
            onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
            required
          />

          <RichEditor
            value={form.content}
            onChange={(content) => setForm((value) => ({ ...value, content }))}
          />

          <div className='grid-two'>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((value) => ({ ...value, categoryId: event.target.value }))}
              required
            >
              <option value=''>Select category</option>
              {(categoriesQuery.data || []).map((item) => (
                <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))}
            >
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
              <option value='scheduled'>Scheduled</option>
            </select>
          </div>

          <div className='flex items-center gap-2 px-1 py-2 bg-zinc-50 border border-zinc-100 rounded'>
             <input
               type='checkbox'
               id='isFeatured'
               checked={form.isFeatured}
               onChange={(e) => setForm(v => ({...v, isFeatured: e.target.checked}))}
             />
             <label htmlFor='isFeatured' className='text-sm font-bold uppercase tracking-widest cursor-pointer'>
               Mark as Featured
             </label>
          </div>

          <div className='grid-two'>
            <input
              placeholder='Image URL'
              value={form.imageUrl}
              onChange={(event) => setForm((value) => ({ ...value, imageUrl: event.target.value }))}
            />
            <input
              placeholder='YouTube URL'
              value={form.youtubeUrl}
              onChange={(event) => setForm((value) => ({ ...value, youtubeUrl: event.target.value }))}
            />
          </div>

          <div className='action-row'>
            <button type='submit' className='btn primary' disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Update news' : 'Create news'}
            </button>
            {editingId && (
              <button type='button' className='btn ghost' onClick={resetForm}>Cancel edit</button>
            )}
          </div>
        </form>
      </article>

      <article className='panel stack-md'>
        <div className='table-wrap'>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(newsQuery.data?.items || []).map((item) => (
                <tr key={item._id || item.id}>
                  <td>
                    <div className='flex flex-col gap-1'>
                      <span className='font-bold'>{item.title}</span>
                      {item.is_featured && <span className='badge warning text-[9px]'>FEATURED</span>}
                    </div>
                  </td>
                  <td>{item.category?.name}</td>
                  <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button type='button' className='btn ghost small' onClick={() => startEdit(item)}>Edit</button>
                      <button type='button' className='btn danger-ghost small' onClick={() => setPendingDelete(item._id || item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete News Article"
        message="Are you sure you want to permanently delete this news article? This action cannot be undone."
        confirmLabel="Delete permanently"
        onConfirm={() => {
          deleteMutation.mutate(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
'@;  | Out-File -FilePath 'src\pages\NewsPage.jsx' -Encoding utf8