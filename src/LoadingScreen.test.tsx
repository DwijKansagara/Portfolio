import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { LoadingScreen } from './App'

describe('LoadingScreen Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders INITIALIZING EXPERIENCE... when progress is < 35', () => {
    render(<LoadingScreen progress={34} />)
    expect(screen.getByText('INITIALIZING EXPERIENCE...')).toBeInTheDocument()
  })

  it('renders LOADING PROJECTS... when progress is 35 (lower bound)', () => {
    render(<LoadingScreen progress={35} />)
    expect(screen.getByText('LOADING PROJECTS...')).toBeInTheDocument()
  })

  it('renders LOADING PROJECTS... when progress is 69 (upper bound)', () => {
    render(<LoadingScreen progress={69} />)
    expect(screen.getByText('LOADING PROJECTS...')).toBeInTheDocument()
  })

  it('renders ALMOST READY... when progress is 70 (lower bound)', () => {
    render(<LoadingScreen progress={70} />)
    expect(screen.getByText('ALMOST READY...')).toBeInTheDocument()
  })

  it('renders ALMOST READY... when progress is 99 (upper bound)', () => {
    render(<LoadingScreen progress={99} />)
    expect(screen.getByText('ALMOST READY...')).toBeInTheDocument()
  })

  it('renders WELCOME. when progress is exactly 100', () => {
    render(<LoadingScreen progress={100} />)
    expect(screen.getByText('WELCOME.')).toBeInTheDocument()
  })
})
