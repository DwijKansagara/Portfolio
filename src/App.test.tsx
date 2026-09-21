import React from 'react'
import { render, screen, act } from '@testing-library/react'
import App from './App'
import { vi } from 'vitest'

// Mock framer-motion to avoid animation complexities in jsdom
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, ...props }: any) => {
        const {
          initial, animate, exit, whileInView, viewport, transition, whileHover, style, ...validProps
        } = props
        return React.createElement('div', validProps, children)
      },
      article: ({ children, ...props }: any) => {
        const {
          initial, animate, exit, whileInView, viewport, transition, whileHover, style, ...validProps
        } = props
        return React.createElement('article', validProps, children)
      },
      h2: ({ children, ...props }: any) => {
        const {
          initial, animate, exit, whileInView, viewport, transition, whileHover, style, ...validProps
        } = props
        return React.createElement('h2', validProps, children)
      },
      button: ({ children, ...props }: any) => {
        const {
          initial, animate, exit, whileInView, viewport, transition, whileHover, style, ...validProps
        } = props
        return React.createElement('button', validProps, children)
      },
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: () => 0,
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  }
})

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}))

// Mock global.fetch
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    localStorage.clear()

    // Default fetch implementation for tests
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        login: 'DwijKansagara',
        avatar_url: 'https://example.com/avatar.png',
        html_url: 'https://github.com/DwijKansagara',
        name: 'Dwij',
        bio: 'Developer',
        public_repos: 42,
        followers: 100,
        following: 50,
      }),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders LoadingScreen initially and transitions to main app', () => {
    render(<App />)

    // Verify loading screen is displayed
    expect(screen.getByText('INITIALIZING EXPERIENCE...')).toBeInTheDocument()

    // Fast-forward timers to simulate progress reaching 100 and loading completing
    act(() => {
      vi.runAllTimers()
    })

    // Verify main app is rendered (LoadingScreen is unmounted)
    expect(screen.queryByText('INITIALIZING EXPERIENCE...')).not.toBeInTheDocument()
    expect(screen.getByText('A LITTLE ABOUT ME')).toBeInTheDocument()
  })

  it('toggles theme correctly', () => {
    render(<App />)

    act(() => {
      vi.runAllTimers()
    })

    const appContainer = document.querySelector('.app')
    expect(appContainer).toBeInTheDocument()

    // Default theme based on mocked localStorage (cleared in beforeEach) should be light or dark depending on implementation
    // The implementation is: localStorage.getItem("theme") !== "light"
    // Since we cleared localStorage, it returns true, so dark theme is default
    expect(appContainer).toHaveClass('dark-theme')
    expect(appContainer).not.toHaveClass('light-theme')

    const toggleButton = screen.getByRole('button', { name: 'Toggle theme' })

    // Toggle to light theme
    act(() => {
      toggleButton.click()
    })

    expect(appContainer).toHaveClass('light-theme')
    expect(appContainer).not.toHaveClass('dark-theme')

    // Toggle back to dark theme
    act(() => {
      toggleButton.click()
    })

    expect(appContainer).toHaveClass('dark-theme')
    expect(appContainer).not.toHaveClass('light-theme')
  })

  it('fetches and displays GitHub profile data', async () => {
    render(<App />)

    act(() => {
      vi.runAllTimers()
    })

    // When fake timers are enabled, promises that use timers (like sometimes inside useEffect or fetch)
    // might not resolve properly if we just await a real timeout.
    // However, since we mock fetch which returns a simple resolved promise, it should resolve immediately,
    // but React's state update inside useEffect might be delayed.
    // Because we are using fake timers, let's restore real timers specifically to wait for DOM changes
    // or just use runAllTimers to clear any internal timeouts, and then flush promises.

    // We need to resolve all pending promises to allow the mocked fetch to resolve and the subsequent state update to happen.
    await act(async () => {
      vi.runAllTimers() // Trigger any internal state timeouts if any
      await vi.runAllTimersAsync() // This allows asynchronous fake timers to resolve
    })

    // Verify global.fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/DwijKansagara')

    // Since we used fake timers, findByText might hang if it relies on real timeouts under the hood in older jsdom/testing-library,
    // but usually it works if we use act. Let's just use getByText if the DOM is already updated,
    // or wrap findByText with real timers.
    vi.useRealTimers()

    expect(await screen.findByText('Dwij')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument() // public_repos
    expect(screen.getByText('100')).toBeInTheDocument() // followers
    expect(screen.getByText('50')).toBeInTheDocument() // following
  })
})
