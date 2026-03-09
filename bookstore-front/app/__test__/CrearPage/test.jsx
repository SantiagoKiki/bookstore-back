import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CrearPage from '../app/authors/create/page'

describe('Formulario de creación de autor', () => {
  test('Renderizado inicial con accesibilidad', () => {
    render(<CrearPage />)

    // Localizar campos por label (semántico)
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL de imagen/i)).toBeInTheDocument()

    // Botón inicial deshabilitado
    const button = screen.getByRole('button', { name: /Crear autor/i })
    expect(button).toBeDisabled()
  })
})