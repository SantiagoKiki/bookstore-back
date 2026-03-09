'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BooksPage() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/books', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.log('Error libros:', err))
  }, [])

  const handleDelete = async (id) => {
    const res = await fetch(`http://127.0.0.1:8080/api/books/${id}`)
    const book = await res.json()

    if (book.authors?.length > 0) {
      for (const author of book.authors) {
        await fetch(`http://127.0.0.1:8080/api/authors/${author.id}/books/${id}`, { method: 'DELETE' })
      }
    }

    await fetch(`http://127.0.0.1:8080/api/books/${id}`, { method: 'DELETE' })
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Libros</h1>
        <Link href="/books/crear" className="btn">+ Nuevo libro</Link>
      </div>

      {books.length === 0
        ? <p className="empty">— sin libros registrados —</p>
        : books.map(book => (
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
                ISBN: {book.isbn} · {book.editorial?.name} · {book.publishingDate && new Date(book.publishingDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: '1.5',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {book.description}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href={`/books/editar/${book.id}`} className="btn btn-ghost">Editar</Link>
              <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>Eliminar</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}