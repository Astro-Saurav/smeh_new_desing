import ReactQuill from 'react-quill'

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
}

export function RichEditor ({ value, onChange }) {
  return (
    <div className="editor-shell">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  )
}
