'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditarPage() {
  const { id } = useParams()
  const router  = useRouter()
  const [form, setForm]     = useState({ name: '', birthDate: '', description: '', image: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/api/authors/${id}`)
      .then(res => res.json())
      .then(data => setForm({
        name:        data.name        ?? '',
        birthDate:   data.birthDate   ?? '',
        description: data.description ?? '',
        image:       data.image       ?? ''
      }))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'El nombre es requerido'
    if (!form.birthDate)          e.birthDate   = 'La fecha de nacimiento es requerida'
    if (!form.description.trim()) e.description = 'La descripción es requerida'
    if (!form.image.trim())       e.image       = 'La URL de la imagen es requerida'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    await fetch(`http://127.0.0.1:8080/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setLoading(false)
    router.push('/authors')
  }

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1>Editar autor</h1>
        <Link href="/authors" className="btn btn-ghost">← Volver</Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name" name="name"
            value={form.name} onChange={handleChange}
            aria-describedby="name-error"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span id="name-error" className="error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Fecha de nacimiento</label>
          <input
            id="birthDate" name="birthDate" type="date"
            value={form.birthDate} onChange={handleChange}
            aria-describedby="birthDate-error"
            aria-invalid={!!errors.birthDate}
            style={{ colorScheme: 'dark' }}
          />
          {errors.birthDate && <span id="birthDate-error" className="error" role="alert">{errors.birthDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description" name="description"
            value={form.description} onChange={handleChange}
            aria-describedby="description-error"
            aria-invalid={!!errors.description}
            rows={4}
          />
          {errors.description && <span id="description-error" className="error" role="alert">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de imagen</label>
          <input
            id="image" name="image"
            value={form.image} onChange={handleChange}
            aria-describedby="image-error"
            aria-invalid={!!errors.image}
          />
          {errors.image && <span id="image-error" className="error" role="alert">{errors.image}</span>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>

      </form>
    </div>
  )
}