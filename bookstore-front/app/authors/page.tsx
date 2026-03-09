'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AuthorsPage() {
  const [authors, setAuthors]   = useState([])
  const [errors, setErrors]      = useState({})
  const [expanded, setExpanded] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [search, setSearch] = useState("")   // 🔍 nuevo estado

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/authors', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setAuthors(data))
    const stored = localStorage.getItem('favoritos')
    if (stored) setFavoritos(JSON.parse(stored))
  }, [])

  const handleDelete = async (id) => {
    const res = await fetch(`http://127.0.0.1:8080/api/authors/${id}`)
    const author = await res.json()
    if (author.books?.length > 0) {
      for (const book of author.books) {
        await fetch(`http://127.0.0.1:8080/api/authors/${id}/books/${book.id}`, { method: 'DELETE' })
      }
    }
    await fetch(`http://127.0.0.1:8080/api/authors/${id}`, { method: 'DELETE' })
    setAuthors(prev => prev.filter(a => a.id !== id))
  }

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id)
  }
  
  const toggleFavorito = (book) => {
    const isFav = favoritos.some(f => f.id === book.id)
    const updated = isFav
      ? favoritos.filter(f => f.id !== book.id)
      : [...favoritos, book]
    setFavoritos(updated)
    localStorage.setItem('favoritos', JSON.stringify(updated))
  }

  // 🔍 Filtrado dinámico
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Autores</h1>
        <Link href="/crear" className="btn">+ Nuevo autor</Link>
      </div>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Buscar autor por nombre"
        style={{ margin: "1rem 0", padding: "0.5rem", width: "100%" }}
      />

      {filteredAuthors.length === 0
        ? <p className="empty">— No se encontraron coincidencias —</p>
        : filteredAuthors.map(author => (
          <div key={author.id} style={{ borderBottom: '1px solid #222' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '1.5rem 0',
              animation: 'fadeIn 0.3s ease forwards'
            }}>
              <img src={author.image} alt={author.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>{author.name}</span>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => toggleExpand(author.id)}>
                  {expanded === author.id ? 'Ocultar ↑' : 'Libros ↓'}
                </button>
                <Link href={`/editar/${author.id}`} className="btn btn-ghost">Editar</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(author.id)}>Eliminar</button>
              </div>
            </div>

            {/* Accordion */}
            {expanded === author.id && (
              <div style={{ paddingBottom: '1.5rem', paddingLeft: '96px' }}>
                {author.books?.length === 0
                  ? <p style={{ color: '#666', fontSize: '0.8rem' }}>— sin libros asociados —</p>
                  : author.books.map(book => {
                    const isFav = favoritos.some(f => f.id === book.id)
                    return (
                      <div key={book.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr auto',
                        gap: '1rem',
                        alignItems: 'center',
                        padding: '0.75rem 0',
                        borderTop: '1px solid #1a1a1a'
                      }}>
                        <img src={book.image} alt={book.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover'}} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem' }}>{book.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.08em' }}>
                            {book.isbn} · {book.publishingDate && new Date(book.publishingDate).toLocaleDateString('es-ES', { year: 'numeric' })}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFavorito(book)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.3rem',
                            cursor: 'pointer',
                            color: isFav ? 'red' : 'white',
                            transition: 'color 0.2s, transform 0.15s'
                          }}
                        >
                          ♥
                        </button>
                      </div>
                    )
                  })
                }
              </div>
            )}
          </div>
        ))
      }
    </div>
  )
}