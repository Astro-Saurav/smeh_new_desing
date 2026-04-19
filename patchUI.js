const fs = require('fs');

const uiPath = 'frontend/admin-crm/src/pages/CategoriesPage.jsx';
let uiContent = fs.readFileSync(uiPath, 'utf8');

if (!uiContent.includes('pendingDelete')) {
  // Add state and ConfirmDialog
  uiContent = uiContent.replace(
    "import { EmptyState } from '../components/EmptyState'",
    "import { EmptyState } from '../components/EmptyState'\nimport { ConfirmDialog } from '../components/ConfirmDialog'"
  ).replace(
    "const [name, setName] = useState('')",
    "const [name, setName] = useState('')\n  const [pendingDelete, setPendingDelete] = useState(null)"
  );

  // Add deleteMutation
  uiContent = uiContent.replace(
    "  const onSubmit = (event) => {",
    `  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  })

  const onSubmit = (event) => {`
  );

  // Update table HTML
  uiContent = uiContent.replace(
    "<th>Created</th>",
    "<th>Created</th>\n                  <th>Actions</th>"
  ).replace(
    "<td>{new Date(item.created_at).toLocaleString()}</td>",
    `<td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        type="button" 
                        className="btn ghost danger" 
                        onClick={() => setPendingDelete(item)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>`
  );

  // Append dialog to end
  uiContent = uiContent.replace(
    "    </div>\n  )\n}",
    `      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete category"
        message={\`This will permanently remove "\${pendingDelete?.name || ''}". Make sure no news is associated with it.\`}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete.id || pendingDelete._id)
            setPendingDelete(null)
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}`
  );
  
  fs.writeFileSync(uiPath, uiContent);
}
console.log('UI patch complete.');
