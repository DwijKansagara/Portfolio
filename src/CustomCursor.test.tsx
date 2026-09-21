import { render, fireEvent, act } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest'
import { CustomCursor } from './App'

describe('CustomCursor', () => {
  test('renders without crashing', () => {
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('.cursor-dot')).toBeInTheDocument()
    expect(container.querySelector('.cursor-glow')).toBeInTheDocument()
  })

  test('updates position on mousemove', () => {
    render(<CustomCursor />)

    act(() => {
      // Mock closest on the target element
      const target = document.createElement('div')
      target.closest = vi.fn().mockReturnValue(null)

      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
      })
      Object.defineProperty(event, 'target', { value: target, enumerable: true })

      window.dispatchEvent(event)
    })
  })

  test('updates hover state on hoverable elements', () => {
    render(
      <div>
        <CustomCursor />
      </div>
    )

    act(() => {
      const target = document.createElement('a')
      const closestMock = vi.fn().mockReturnValue(target)
      target.closest = closestMock

      const event = new MouseEvent('mousemove', {
        clientX: 10,
        clientY: 10,
        bubbles: true,
      })
      Object.defineProperty(event, 'target', { value: target, enumerable: true })

      window.dispatchEvent(event)
      expect(closestMock).toHaveBeenCalled()
    })
  })

  test('cleans up event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<CustomCursor />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })
})
