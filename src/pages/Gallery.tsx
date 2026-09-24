import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGallery } from '../hooks/useGallery'

export function Gallery() {
  const { gallery, loading } = useGallery()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const next = () => setLightbox((prev) => (prev === null ? prev : (prev + 1) % gallery.length))
  const prev = () => setLightbox((prev) => (prev === null ? prev : (prev - 1 + gallery.length) % gallery.length))

  return (
    <div className="animate-fade-in pt-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-700 to-accent-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">Galeri Hasil Pekerjaan</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Dokumentasi hasil pekerjaan service AC dan instalasi listrik yang telah kami kerjakan.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-neutral-200 animate-pulse" />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500">Belum ada foto di galeri.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 animate-scale-in"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item.title && (
                    <p className="absolute bottom-0 left-0 right-0 p-4 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={gallery[lightbox].image_url}
            alt={gallery[lightbox].title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          {gallery[lightbox].title && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-white font-medium">
              {gallery[lightbox].title}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
