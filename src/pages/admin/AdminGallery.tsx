import { useState, useRef } from 'react'
import { Upload, Trash2, X, Save, GripVertical, ImageIcon } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useGallery } from '../../hooks/useGallery'
import { supabase, GALLERY_BUCKET } from '../../lib/supabase'
import type { GalleryItem } from '../../types'

export function AdminGallery() {
  const { gallery, loading, refetch } = useGallery()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [titleValue, setTitleValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(GALLERY_BUCKET)
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from(GALLERY_BUCKET)
          .getPublicUrl(filePath)

        const { error: insertError } = await supabase
          .from('gallery')
          .insert({
            image_url: urlData.publicUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            sort_order: gallery.length + 1,
          })

        if (insertError) throw insertError
      }
      refetch()
    } catch (err) {
      setError('Gagal mengunggah foto. Pastikan file adalah gambar dan coba lagi.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Hapus foto ini?')) return

    const path = item.image_url.split('/gallery/').pop()
    if (path) {
      await supabase.storage.from(GALLERY_BUCKET).remove([path])
    }
    await supabase.from('gallery').delete().eq('id', item.id)
    refetch()
  }

  const handleSaveTitle = async (id: string) => {
    await supabase.from('gallery').update({ title: titleValue }).eq('id', id)
    setEditingTitle(null)
    refetch()
  }

  const handleSortChange = async (item: GalleryItem, newOrder: number) => {
    await supabase.from('gallery').update({ sort_order: newOrder }).eq('id', item.id)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">Galeri</h1>
          <p className="text-sm text-neutral-500">Unggah dan kelola foto hasil pekerjaan.</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Unggah Foto
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error-50 border border-error-200 text-sm text-error-700">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <div className="card p-12 text-center">
          <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">Belum ada foto. Klik "Unggah Foto" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="relative aspect-square">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDelete(item)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                {editingTitle === item.id ? (
                  <div className="flex gap-1">
                    <input
                      className="input text-sm py-1.5 px-2"
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(item.id)}
                      autoFocus
                    />
                    <button onClick={() => handleSaveTitle(item.id)} className="btn-primary p-1.5 shrink-0">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingTitle(item.id); setTitleValue(item.title) }}
                    className="text-sm text-neutral-600 hover:text-primary-600 text-left w-full truncate"
                  >
                    {item.title || 'Tanpa judul'}
                  </button>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <GripVertical className="w-3 h-3 text-neutral-300" />
                  <input
                    type="number"
                    className="input text-xs py-1 px-2 w-16"
                    value={item.sort_order}
                    onChange={(e) => handleSortChange(item, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
