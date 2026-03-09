'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('favoritos')
    if (stored) setFavoritos(JSON.parse(stored))
  }, [])

  const handleRemove = (id) => {
    const updated = favoritos.filter(b => b.id !== id)
    setFavoritos(updated)
    localStorage.setItem('favoritos', JSON.stringify(updated))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Favoritos</h1>
      </div>

      {favoritos.length === 0
        ? <p className="empty">— no tienes libros favoritos aún —</p>
        : favoritos.map(book => (
          <div key={book.id} style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gap: '1.5rem',
            alignItems: 'center',
            padding: '1.5rem 0',
            borderBottom: '1px solid #222',
            animation: 'fadeIn 0.3s ease forwards'
          }}>
            <img src={book.image} alt={book.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>{book.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>
                ISBN: {book.isbn} · {book.editorial?.name}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: '1.5',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {book.description}
              </span>
            </div>
            <button className="btn btn-danger" onClick={() => handleRemove(book.id)}>
              Quitar
            </button>
          </div>
        ))
      }
    </div>
  )
}