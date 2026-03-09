'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const INITIAL = { name: '', isbn: '', description: '', image: '', publishingDate: '' }

export default function CrearBookPage() {
  const router = useRouter()
  const [form, setForm]               = useState(INITIAL)
  const [errors, setErrors]           = useState({})
  const [loading, setLoading]         = useState(false)
  const [authors, setAuthors]         = useState([])
  const [editorials, setEditorials]   = useState([])
  const [authorId, setAuthorId]       = useState('')
  const [editorialId, setEditorialId] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/authors')
      .then(res => res.json())
      .then(data => setAuthors(data))
      .catch(err => console.log('Error autores:', err))

    fetch('http://127.0.0.1:8080/api/editorials')
      .then(res => res.json())
      .then(data => {
        console.log('Editoriales:', data)
        setEditorials(data)
      })
      .catch(err => console.log('Error editoriales:', err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name           = 'El nombre es requerido'
    if (!form.isbn.trim())        e.isbn           = 'El ISBN es requerido'
    if (!form.publishingDate)     e.publishingDate = 'La fecha de publicación es requerida'
    if (!form.description.trim()) e.description    = 'La descripción es requerida'
    if (!form.image.trim())       e.image          = 'La URL de la imagen es requerida'
    if (!authorId)                e.authorId       = 'Debes seleccionar un autor'
    if (!editorialId)             e.editorialId    = 'Debes seleccionar una editorial'
    return e
  }

  const selectStyle = {
    width: '100%', background: 'transparent', border: '1px solid #222',
    color: '#f5f5f0', fontFamily: 'DM Mono, monospace', fontSize: '0.9rem',
    padding: '0.75rem 1rem', outline: 'none', colorScheme: 'dark'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    console.log('Editorial ID:', editorialId, 'tipo:', typeof editorialId)
    console.log('Author ID:', authorId, 'tipo:', typeof authorId)

    setLoading(true)

    const res = await fetch('http://127.0.0.1:8080/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:           form.name,
        isbn:           form.isbn,
        description:    form.description,
        image:          form.image,
        publishingDate: form.publishingDate,
        editorial:      { id: Number(editorialId) }
      })
    })
    const newBook = await res.json()
    console.log('Libro creado:', newBook)

    if (newBook.id) {
      await fetch(`http://127.0.0.1:8080/api/authors/${authorId}/books/${newBook.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    }

    setLoading(false)
    router.push('/books')
    router.refresh()
  }

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1>Nuevo libro</h1>
        <Link href="/books" className="btn btn-ghost">← Volver</Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={handleChange}
            aria-describedby="name-error" aria-invalid={!!errors.name}
            placeholder="Ej: Harry Potter y la piedra filosofal" />
          {errors.name && <span id="name-error" className="error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" name="isbn" value={form.isbn} onChange={handleChange}
            aria-describedby="isbn-error" aria-invalid={!!errors.isbn}
            placeholder="Ej: 9786073193894" />
          {errors.isbn && <span id="isbn-error" className="error" role="alert">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="publishingDate">Fecha de publicación</label>
          <input id="publishingDate" name="publishingDate" type="date"
            value={form.publishingDate} onChange={handleChange}
            aria-describedby="publishingDate-error" aria-invalid={!!errors.publishingDate}
            style={{ colorScheme: 'dark' }} />
          {errors.publishingDate && <span id="publishingDate-error" className="error" role="alert">{errors.publishingDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange}
            aria-describedby="description-error" aria-invalid={!!errors.description}
            rows={4} placeholder="Breve descripción del libro..." />
          {errors.description && <span id="description-error" className="error" role="alert">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de imagen</label>
          <input id="image" name="image" value={form.image} onChange={handleChange}
            aria-describedby="image-error" aria-invalid={!!errors.image}
            placeholder="https://..." />
          {errors.image && <span id="image-error" className="error" role="alert">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="editorialId">Editorial</label>
          {editorials.length === 0
            ? <p style={{ color: '#666', fontSize: '0.8rem' }}>Cargando editoriales...</p>
            : <select id="editorialId" value={editorialId}
                onChange={e => { setEditorialId(e.target.value); setErrors({...errors, editorialId: ''}) }}
                aria-describedby="editorialId-error" aria-invalid={!!errors.editorialId}
                style={selectStyle}>
                <option value="" style={{ background: '#0a0a0a' }}>— selecciona una editorial —</option>
                {editorials.map(ed => (
                  <option key={ed.id} value={ed.id} style={{ background: '#0a0a0a' }}>{ed.name}</option>
                ))}
              </select>
          }
          {errors.editorialId && <span id="editorialId-error" className="error" role="alert">{errors.editorialId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="authorId">Autor</label>
          {authors.length === 0
            ? <p style={{ color: '#666', fontSize: '0.8rem' }}>Cargando autores...</p>
            : <select id="authorId" value={authorId}
                onChange={e => { setAuthorId(e.target.value); setErrors({...errors, authorId: ''}) }}
                aria-describedby="authorId-error" aria-invalid={!!errors.authorId}
                style={selectStyle}>
                <option value="" style={{ background: '#0a0a0a' }}>— selecciona un autor —</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id} style={{ background: '#0a0a0a' }}>{a.name}</option>
                ))}
              </select>
          }
          {errors.authorId && <span id="authorId-error" className="error" role="alert">{errors.authorId}</span>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear libro'}
        </button>

      </form>
    </div>
  )
}