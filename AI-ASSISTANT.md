# Free local portfolio assistant

The portfolio includes opt-in, in-browser AI via WebLLM and Qwen2.5 0.5B Instruct (q4f32). No API key, AI wallet, paid model endpoint, or backend is used. The site stays static and works on Antideploy and GitHub Pages.

The visitor explicitly chooses **Enable local AI** before the engine or model downloads. Model weights are about 278 MB, plus tokenizer/runtime files; allow roughly 300 MB of network transfer and around 1 GB of graphics memory. Browser storage may cache downloads, but eviction/private browsing can require another download. Model files come from Hugging Face and the WebLLM runtime from GitHub. Normal visitor network/data costs still apply.

WebGPU and a compatible GPU/browser are required. Model loading has a five-minute timeout; individual answers have a 90-second timeout. Cancel, Stop, closing the dialog, or turning off AI terminates the worker and releases its resources. Quick answers and project links work without AI or WebGPU and are explicitly labeled as portfolio facts, not generated responses.

Questions run locally, without being sent to an AI service. Chat history is held in memory and can be cleared. Each generated answer uses the current question and a bounded portfolio context; follow-ups should be self-contained. Model responses are rendered as plain text. Source links come from the portfolio's known project list, not generated URLs.

`src/portfolio.ts` supplies the visible projects and skills and the assistant's context. `src/assistantKnowledge.ts` supplies the bio/contact facts and quick answers. Keep these accurate when editing the portfolio. Small local models can make mistakes; the UI labels generated answers accordingly. There is no guarantee of perfect factual grounding.

Validation: `npm run build`, `npm test`, `npm run lint`. Use desktop and mobile browser checks for the dialog, keyboard focus, quick answers, unsupported hardware, cancellation, and an actual model answer on compatible hardware.

References: https://webllm.mlc.ai/docs/ and https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f32_1-MLC
