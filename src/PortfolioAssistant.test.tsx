import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PortfolioAssistant from './PortfolioAssistant'

const runtime = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('@mlc-ai/web-llm', () => ({ CreateWebWorkerMLCEngine: runtime.create }))

beforeEach(() => {
  runtime.create.mockReset()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
  HTMLElement.prototype.scrollTo = vi.fn()
})
afterEach(() => { vi.unstubAllGlobals() })

describe('portfolio guide', () => {
  it('requires explicit opt-in and offers factual quick answers without an AI download', () => {
    const worker = vi.fn()
    vi.stubGlobal('Worker', worker)
    render(<PortfolioAssistant />)
    fireEvent.click(screen.getByRole('button', { name: /Ask about Dwij/ }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox')).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'What has Dwij built?' }))
    expect(screen.getByRole('log')).toHaveTextContent('LUMINA AI')
    expect(screen.getByRole('log')).toHaveTextContent('QUICK ANSWER')
    expect(worker).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Clear chat' }))
    expect(screen.getByRole('log')).toBeEmptyDOMElement()
  })

  it('handles missing WebGPU without pretending quick answers are AI', async () => {
    vi.stubGlobal('navigator', {})
    render(<PortfolioAssistant />)
    fireEvent.click(screen.getByRole('button', { name: /Ask about Dwij/ }))
    fireEvent.click(screen.getByRole('button', { name: /Enable local AI/ }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('WebGPU'))
    fireEvent.click(screen.getByRole('button', { name: 'How can I contact him?' }))
    expect(screen.getByRole('log')).toHaveTextContent('kansagara.dwij@gmail.com')
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('closes the dialog and returns keyboard focus to the launcher', () => {
    render(<PortfolioAssistant />)
    const launcher = screen.getByRole('button', { name: /Ask about Dwij/ })
    fireEvent.click(launcher)
    fireEvent.click(screen.getByRole('button', { name: 'Close assistant' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(launcher).toHaveFocus()
  })

  it('generates locally and renders model output as text, then terminates the worker on close', async () => {
    const terminate = vi.fn()
    const generate = vi.fn().mockResolvedValue({ choices: [{ message: { content: '<img src=x onerror=alert(1)> LUMINA explores AI music.' } }] })
    vi.stubGlobal('navigator', { gpu: { requestAdapter: vi.fn().mockResolvedValue({}) } })
    vi.stubGlobal('Worker', vi.fn(function () { return { terminate } }))
    runtime.create.mockResolvedValue({ chat: { completions: { create: generate } } })
    const { container } = render(<PortfolioAssistant />)
    fireEvent.click(screen.getByRole('button', { name: /Ask about Dwij/ }))
    fireEvent.click(screen.getByRole('button', { name: /Enable local AI/ }))
    await screen.findByText('Local AI is ready')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'What is LUMINA?' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send question' }))
    await screen.findByText(/LUMINA explores AI music/)
    expect(container.querySelector('img')).toBeNull()
    expect(generate.mock.calls[0][0].messages[0].content).toContain('Dwij Kansagara')
    expect(generate.mock.calls[0][0].messages[1].content).toBe('What is LUMINA?')
    fireEvent.click(screen.getByRole('button', { name: 'Close assistant' }))
    expect(terminate).toHaveBeenCalledOnce()
  })
})
