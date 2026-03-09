'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/authors')
      .then(res => res.json())
      .then(data => setAuthors(data))
  }, [])

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8080/api/authors/${id}`, { method: 'DELETE' })
    setAuthors(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Autores</h1>
        <Link href="/crear" className="btn btn-primary"> Nuevo autor</Link>
      </div>

      {authors.length === 0
        ? <p className="empty">— sin autores registrados —</p>
        : authors.map(author => (
          <div key={author.id} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gap: '1.5rem',
            alignItems: 'center',
            padding: '1.5rem 0',
            borderBottom: '1px solid #222',
            animation: 'fadeIn 0.3s ease forwards'
          }}>

            {/* Foto */}
            <img
              src={author.image}
              alt={author.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
                {author.name}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>
                {new Date(author.birthDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}
                {author.books?.length ?? 0} {author.books?.length === 1 ? 'libro' : 'libros'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: '1.5', 
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {author.description}
              </span>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href={`/editar/${author.id}`} className="btn btn-ghost">Editar</Link>
              <button className="btn btn-danger" onClick={() => handleDelete(author.id)}>Eliminar</button>
            </div>

          </div>
        ))
      }
    </div>
  )
}