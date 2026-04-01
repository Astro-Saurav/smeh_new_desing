import { useState } from 'react'
import toast from 'react-hot-toast'
import { uploadApi } from '../api/uploadApi'
import { PageHeader } from '../components/PageHeader'

function readFileAsBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const base64 = String(dataUrl).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function MediaPage () {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const copyUploadedUrl = async () => {
    if (!uploadedUrl) {
      return
    }

    await navigator.clipboard.writeText(uploadedUrl)
    toast.success('URL copied to clipboard')
  }

  const onUpload = async (event) => {
    event.preventDefault()

    if (!file) {
      toast.error('Select an image first')
      return
    }

    setLoading(true)

    try {
      const base64Data = await readFileAsBase64(file)
      const result = await uploadApi.uploadImage({
        fileName: file.name,
        mimeType: file.type,
        base64Data
      })
      setUploadedUrl(result.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Media"
        title="Asset Upload"
        subtitle="Upload optimized images once and reuse secure blob URLs across stories."
      />

      <article className="panel stack-md">
        <h3>Media Upload</h3>
        <p>Upload images to Azure Blob Storage and reuse the URL in news posts.</p>

        <form className="stack-md" onSubmit={onUpload}>
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
          {file && (
            <p className="helper-text">Selected: {file.name} ({Math.ceil(file.size / 1024)} KB)</p>
          )}
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload image'}
          </button>
        </form>

        {uploadedUrl && (
          <div className="stack-sm">
            <label>Uploaded URL</label>
            <div className="action-row">
              <input value={uploadedUrl} readOnly />
              <button type="button" className="btn ghost" onClick={copyUploadedUrl}>Copy URL</button>
            </div>
            <img src={uploadedUrl} alt="Uploaded preview" className="media-preview" />
          </div>
        )}
      </article>
    </div>
  )
}
