import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X, Sparkles, ArrowUpRight } from 'lucide-react'
import type { WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { assistantInstructions, quickAnswers } from './assistantKnowledge'
import { projects } from './portfolio'
import './PortfolioAssistant.css'

type Message = { role: 'user' | 'assistant'; content: string; kind?: 'quick' | 'ai' }
type Mode = 'idle' | 'loading' | 'ready' | 'unavailable'
const MODEL = 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC'

export default function PortfolioAssistant() {
  const dialog = useRef<HTMLDialogElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const worker = useRef<Worker | null>(null)
  const engine = useRef<WebWorkerMLCEngine | null>(null)
  const operation = useRef(0)
  const [mode, setMode] = useState<Mode>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => { operation.current++; worker.current?.terminate() }, [])
  useEffect(() => { transcript.current?.scrollTo({ top: transcript.current.scrollHeight }) }, [messages, busy])

  function stop() {
    operation.current++
    worker.current?.terminate()
    worker.current = null
    engine.current = null
    setBusy(false)
    setMode('idle')
  }

  function close() {
    stop()
    dialog.current?.close()
    launcher.current?.focus()
  }

  async function enableAI() {
    if (mode === 'loading' || mode === 'ready') return
    const id = ++operation.current
    setError('')
    setProgress(0)
    setMode('loading')
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
      if (!gpu || !await gpu.requestAdapter()) throw new Error('unsupported')
      if (id !== operation.current) return
      const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm')
      if (id !== operation.current) return
      worker.current = new Worker(new URL('./assistant.worker.ts', import.meta.url), { type: 'module' })
      const loaded = await Promise.race([
        CreateWebWorkerMLCEngine(worker.current, MODEL, {
          initProgressCallback: report => {
            if (id === operation.current) setProgress(Math.round(Math.max(0, Math.min(1, report.progress)) * 100))
          },
        }, { context_window_size: 2048 }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 300_000) }),
      ])
      if (id !== operation.current) return
      engine.current = loaded
      setMode('ready')
      requestAnimationFrame(() => input.current?.focus())
    } catch (cause) {
      if (id !== operation.current) return
      worker.current?.terminate()
      worker.current = null
      engine.current = null
      setMode('unavailable')
      setError(cause instanceof Error && cause.message === 'unsupported'
        ? 'Local AI needs a browser and GPU with WebGPU support. You can still use the quick answers and project links below.'
        : 'The model could not load. Check your connection and available device memory, then try again. Quick answers still work.')
    } finally { clearTimeout(timer) }
  }

  async function send() {
    const question = draft.trim()
    if (!question || busy || !engine.current || mode !== 'ready') return
    const id = ++operation.current
    const message: Message = { role: 'user', content: question.slice(0, 500) }
    setMessages(previous => [...previous.slice(-19), message])
    setDraft('')
    setBusy(true)
    setError('')
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      // Only send the current question: keeps the small model's context bounded and factual.
      const reply = await Promise.race([
        engine.current.chat.completions.create({
          messages: [{ role: 'system', content: assistantInstructions }, { role: 'user', content: message.content }],
          max_tokens: 180,
          temperature: 0.2,
        }),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 90_000) }),
      ])
      if (id !== operation.current) return
      const content = reply.choices[0]?.message.content?.trim()
      if (!content) throw new Error('empty')
      setMessages(previous => [...previous, { role: 'assistant', content, kind: 'ai' }])
    } catch {
      if (id !== operation.current) return
      stop()
      setError('That answer could not finish on this device. Try enabling AI again, or use a quick answer.')
    } finally {
      clearTimeout(timer)
      if (id === operation.current) { setBusy(false); input.current?.focus() }
    }
  }

  function quickAnswer(index: number) {
    const answer = quickAnswers[index]
    setMessages(previous => [...previous.slice(-18),
      { role: 'user', content: answer.question },
      { role: 'assistant', content: answer.answer, kind: 'quick' },
    ])
  }

  return <>
    <button ref={launcher} className="assistant-launcher" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
      <MessageCircle size={20} aria-hidden="true" /> Ask about Dwij <span>AI</span>
    </button>
    <dialog ref={dialog} className="assistant-dialog" aria-labelledby="assistant-title" onCancel={event => { event.preventDefault(); close() }}>
      <div className="assistant-header">
        <div><span className="assistant-eyebrow">THE PORTFOLIO GUIDE</span><h2 id="assistant-title">A little more about Dwij.</h2></div>
        <button className="assistant-icon" onClick={close} aria-label="Close assistant"><X size={22} /></button>
      </div>
      <div className="assistant-body">
        <section className="assistant-intro" aria-label="Local AI setup">
          <div className="assistant-mode"><Sparkles size={16} aria-hidden="true" /> {mode === 'ready' ? 'Local AI is ready' : 'Free AI. On your device.'}</div>
          <p>Explore projects, skills, and ways to get in touch. Quick answers work instantly.</p>
          {mode !== 'ready' && <p className="assistant-note">Optional AI downloads about 300 MB on first use, then uses your device’s graphics processor. Questions stay in this browser. Downloads come from Hugging Face and GitHub; normal data charges may apply.</p>}
          {mode === 'loading' ? <div className="assistant-loading" role="status">
            <label htmlFor="assistant-progress">Preparing local AI · {progress}%</label>
            <progress id="assistant-progress" value={progress} max="100" />
            <button onClick={stop}>Cancel download</button>
          </div> : mode !== 'ready' ? <button className="assistant-enable" onClick={() => void enableAI()}>Enable local AI <ArrowUpRight size={16} /></button>
            : <button className="assistant-text-button" onClick={stop}>Turn off AI & free device memory</button>}
        </section>
        {error && <p className="assistant-error" role="alert">{error}</p>}
        <div className="assistant-prompts" aria-label="Quick answers">
          {quickAnswers.map((answer, index) => <button key={answer.question} disabled={busy} onClick={() => quickAnswer(index)}>{answer.question}</button>)}
        </div>
        <div ref={transcript} className="assistant-transcript" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          {messages.map((message, index) => <div className={`assistant-message ${message.role}`} key={index}>
            <span>{message.role === 'user' ? 'YOU' : message.kind === 'quick' ? 'FROM THE PORTFOLIO · QUICK ANSWER' : 'LOCAL AI · CHECK IMPORTANT DETAILS'}</span>
            <p>{message.content}</p>
          </div>)}
          {busy && <p className="assistant-thinking" role="status">Thinking on your device…</p>}
        </div>
        <div className="assistant-sources"><span>EXPLORE THE SOURCE</span>{projects.map(project => <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer">{project.title} <ArrowUpRight size={12} /></a>)}</div>
      </div>
      <form className="assistant-form" onSubmit={event => { event.preventDefault(); void send() }}>
        <label className="assistant-sr-only" htmlFor="assistant-question">Ask a question about Dwij</label>
        <input id="assistant-question" ref={input} value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} disabled={mode !== 'ready' || busy} placeholder={mode === 'ready' ? 'Ask a specific question about Dwij…' : 'Enable local AI to ask your own question'} autoComplete="off" />
        {busy ? <button type="button" className="assistant-icon" onClick={stop} aria-label="Stop generating"><X size={19} /></button>
          : <button type="submit" className="assistant-icon" disabled={mode !== 'ready' || !draft.trim()} aria-label="Send question"><Send size={19} /></button>}
      </form>
      <div className="assistant-bottom"><span>AI can make mistakes. Each question stands alone.</span><button disabled={busy || messages.length === 0} onClick={() => { setMessages([]); setDraft(''); setError('') }}>Clear chat</button></div>
    </dialog>
  </>
}
