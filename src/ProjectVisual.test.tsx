import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectVisual } from './App'

describe('ProjectVisual', () => {
  it('renders lumina project visual correctly', () => {
    const { container } = render(<ProjectVisual type="lumina" />)

    // Check if correct art class is present
    expect(container.querySelector('.lumina-art')).toBeInTheDocument()

    // Check if specific text content is present
    expect(screen.getByText('AI MUSIC INTERACTION')).toBeInTheDocument()
    expect(screen.getByText('♫')).toBeInTheDocument()

    // Ensure other classes are NOT present
    expect(container.querySelector('.jarvis-art')).not.toBeInTheDocument()
    expect(container.querySelector('.avengers-art')).not.toBeInTheDocument()
  })

  it('renders jarvis project visual correctly', () => {
    const { container } = render(<ProjectVisual type="jarvis" />)

    // Check if correct art class is present
    expect(container.querySelector('.jarvis-art')).toBeInTheDocument()

    // Check if specific text content is present
    expect(screen.getByText('INTELLIGENT SYSTEM')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument()
    expect(screen.getByText('VOICE READY')).toBeInTheDocument()
    expect(screen.getByText('CORE ACTIVE')).toBeInTheDocument()

    // Ensure other classes are NOT present
    expect(container.querySelector('.lumina-art')).not.toBeInTheDocument()
    expect(container.querySelector('.avengers-art')).not.toBeInTheDocument()
  })

  it('renders avengers (default) project visual correctly', () => {
    // Passing a type that is neither 'lumina' nor 'jarvis'
    const { container } = render(<ProjectVisual type="unknown" />)

    // Check if correct art class is present
    expect(container.querySelector('.avengers-art')).toBeInTheDocument()

    // Check if specific text content is present
    expect(screen.getByText('CREATIVE WEB EXPERIENCE')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()

    // Ensure other classes are NOT present
    expect(container.querySelector('.lumina-art')).not.toBeInTheDocument()
    expect(container.querySelector('.jarvis-art')).not.toBeInTheDocument()
  })
})
