(() => {
  const endpoint = "https://dwij-signal.vercel.app/api/engagement";
  class DwijEngagement extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.site = this.getAttribute("site") || "portfolio";
      this.storageKey = `dwij-engagement-${this.site}`;
      this.visitorId = this.readVisitorId();
      this.state = { visitors: 0, likes: 0, clicks: 0, pending: 0 };
      this.attachShadow({ mode: "open" });
      this.render();
      this.button = this.shadowRoot.querySelector("button");
      this.button.addEventListener("click", () => this.like());
      this.load(true);
    }
    readVisitorId() {
      try {
        return localStorage.getItem(this.storageKey) || "";
      } catch {
        return "";
      }
    }
    ensureVisitorId() {
      if (this.visitorId) return this.visitorId;
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      this.visitorId = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
      try {
        localStorage.setItem(this.storageKey, this.visitorId);
      } catch {
        // The in-memory ID still keeps rapid presses consistent for this page view.
      }
      return this.visitorId;
    }
    async request(path = "", options = {}) {
      const headers = new Headers(options.headers || {});
      if (this.visitorId) headers.set("X-Dwij-Visitor", this.visitorId);
      const response = await fetch(`${endpoint}/${this.site}${path}`, {
        cache: "no-store",
        ...options,
        headers,
      });
      if (!response.ok) throw new Error("Counter unavailable");
      return response.json();
    }
    async load(countView = false) {
      try {
        const stats = await this.request(countView ? "/view" : "", countView ? { method: "POST" } : {});
        if (this.state.pending === 0) {
          this.state.visitors = Number(stats.visitors) || 0;
          this.state.likes = Number(stats.likes) || 0;
          this.state.clicks = Math.min(20, Number(stats.yourClicks) || 0);
          this.paint();
        }
      } catch {
        this.setStatus("Live totals are reconnecting.");
      }
    }
    like() {
      if (this.state.clicks >= 20) return;
      this.ensureVisitorId();
      this.state.clicks += 1;
      this.state.likes += 1;
      this.state.pending += 1;
      this.paint(true);
      this.persist();
    }
    async persist() {
      let failed = false;
      try {
        await this.request("/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
      } catch {
        failed = true;
      } finally {
        this.state.pending = Math.max(0, this.state.pending - 1);
        if (this.state.pending === 0) {
          await this.load();
          if (failed) this.setStatus("One press did not save. Press again to retry.");
        } else {
          this.paint();
        }
      }
    }
    paint(animate = false) {
      const { visitors, likes, clicks, pending } = this.state;
      const progress = clicks * 5;
      this.shadowRoot.querySelector("[data-visitors]").textContent = visitors.toLocaleString();
      this.shadowRoot.querySelector("[data-likes]").textContent = likes.toLocaleString();
      this.shadowRoot.querySelector("[data-clicks]").textContent = `${clicks} / 20`;
      this.shadowRoot.querySelector("[data-percent]").textContent = `${progress}%`;
      this.shadowRoot.querySelectorAll("[data-segment]").forEach((segment, index) => {
        segment.classList.toggle("filled", index < clicks);
      });
      this.shadowRoot.querySelector("[role=progressbar]").setAttribute("aria-valuenow", String(progress));
      this.button.disabled = clicks === 20;
      this.button.setAttribute("aria-label", clicks === 20 ? "Appreciation signal complete" : `Add five percent. ${clicks} of 20 presses used`);
      this.shadowRoot.querySelector("[data-button-label]").textContent = clicks === 20 ? "Complete" : "Add 5%";
      this.setStatus(
        clicks === 20
          ? pending > 0 ? "Complete. Saving the final signal…" : "Complete. Signal received."
          : pending > 0 ? `Instantly added. Syncing ${pending} ${pending === 1 ? "press" : "presses"}…` : `${20 - clicks} presses remain.`,
      );
      if (animate) {
        this.button.classList.remove("pressed");
        requestAnimationFrame(() => this.button.classList.add("pressed"));
      }
    }
    setStatus(message) {
      this.shadowRoot.querySelector("[data-status]").textContent = message;
    }
    render() {
      const segments = Array.from({ length: 20 }, () => '<i data-segment></i>').join("");
      this.shadowRoot.innerHTML = `
        <style>
          :host{display:block;max-width:1120px;margin:clamp(2.5rem,6vw,5rem) auto 2rem;padding:0 1.25rem;color:var(--engagement-ink,#eff2e8);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
          *{box-sizing:border-box}
          .signal{position:relative;display:grid;grid-template-columns:minmax(150px,.5fr) minmax(280px,1.5fr) minmax(150px,.55fr);gap:clamp(1.25rem,3vw,2.5rem);align-items:center;padding:1.25rem 1.35rem;border-block:1px solid color-mix(in srgb,var(--engagement-accent,#d3f36b) 26%,transparent);background:color-mix(in srgb,var(--engagement-panel,#171a16) 96%,transparent)}
          .signal:before{content:"";position:absolute;left:0;top:-1px;width:64px;height:2px;background:var(--engagement-accent,#d3f36b)}
          .eyebrow{display:flex;align-items:center;gap:.5rem;margin:0 0 .7rem;color:var(--engagement-accent,#d3f36b);font:750 .66rem/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.16em;text-transform:uppercase}.eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 0 4px color-mix(in srgb,currentColor 12%,transparent)}
          .visitor-line{display:flex;align-items:baseline;gap:.55rem}.visitor-line strong{font-size:clamp(1.65rem,3vw,2.5rem);line-height:1;font-variant-numeric:tabular-nums}.visitor-line span{color:color-mix(in srgb,currentColor 56%,transparent);font-size:.72rem;text-transform:uppercase;letter-spacing:.1em}
          .meter-head{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}.meter-head strong{font-size:.85rem;letter-spacing:.03em}.totals{color:color-mix(in srgb,currentColor 60%,transparent);font:650 .68rem/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase}.totals b{color:currentColor;font-size:.82rem}
          .segments{display:grid;grid-template-columns:repeat(20,1fr);gap:4px;margin:.85rem 0 .7rem}.segments i{height:13px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);background:color-mix(in srgb,currentColor 4%,transparent);transform-origin:center;transition:background .16s ease,border-color .16s ease,transform .16s ease}.segments i.filled{border-color:var(--engagement-accent,#d3f36b);background:var(--engagement-accent,#d3f36b);transform:scaleY(1.18)}
          .meter-foot{display:flex;justify-content:space-between;gap:1rem;color:color-mix(in srgb,currentColor 56%,transparent);font:650 .65rem/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.06em;text-transform:uppercase}.meter-foot output{color:currentColor;font-variant-numeric:tabular-nums}.status{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          button{position:relative;width:100%;min-height:54px;border:1px solid var(--engagement-accent,#d3f36b);border-radius:12px;background:transparent;color:var(--engagement-accent,#d3f36b);cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.75rem .9rem;font:800 .8rem/1 inherit;letter-spacing:.04em;transition:background .15s ease,color .15s ease,transform .15s ease}button:hover:not(:disabled){background:var(--engagement-accent,#d3f36b);color:var(--engagement-button-ink,#10120f)}button:active:not(:disabled),button.pressed:not(:disabled){transform:scale(.97)}button:focus-visible{outline:3px solid color-mix(in srgb,var(--engagement-accent,#d3f36b) 48%,white);outline-offset:4px}button:disabled{cursor:default;background:color-mix(in srgb,var(--engagement-accent,#d3f36b) 14%,transparent);opacity:.75}button svg{width:19px;height:19px;fill:currentColor}button [data-button-label]{white-space:nowrap}.percent{font:800 .72rem/1 ui-monospace,SFMono-Regular,Consolas,monospace}
          .privacy{position:absolute;right:1.35rem;bottom:-1.55rem;color:color-mix(in srgb,currentColor 54%,transparent);font-size:.68rem;text-underline-offset:3px}.privacy:hover{color:var(--engagement-accent,#d3f36b)}
          :host([compact]){margin:0 auto 1.2vh;padding:0;max-width:1400px}:host([compact]) .signal{grid-template-columns:120px 1fr 145px;padding:.7rem 1rem;gap:1rem}:host([compact]) .visitor-line strong{font-size:1.35rem}:host([compact]) .segments{margin:.55rem 0}:host([compact]) .segments i{height:9px}:host([compact]) button{min-height:43px}:host([compact]) .privacy{display:none}
          @media(max-width:720px){.signal,:host([compact]) .signal{grid-template-columns:1fr auto;gap:1rem;padding:1rem}.meter{grid-column:1/-1;grid-row:2}.action{grid-column:2;grid-row:1}.visitor{grid-column:1;grid-row:1}.segments{gap:3px}.segments i{height:10px}.status{max-width:220px}.privacy{right:1rem}:host([compact]) .eyebrow{display:none}:host([compact]) .meter{grid-column:1/-1}:host([compact]) .visitor-line strong{font-size:1.2rem}}
          @media(max-width:420px){button{width:140px;gap:.55rem;padding:.7rem .75rem}.status{max-width:165px}.meter-head{align-items:center}.totals{font-size:.6rem}}
          @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        </style>
        <section class="signal" aria-label="Live site engagement">
          <div class="visitor"><p class="eyebrow">Live signal</p><div class="visitor-line"><strong data-visitors>—</strong><span>views</span></div></div>
          <div class="meter">
            <div class="meter-head"><strong>Appreciation signal</strong><span class="totals"><b data-likes>—</b> total presses</span></div>
            <div class="segments" role="progressbar" aria-label="Your appreciation signal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">${segments}</div>
            <div class="meter-foot"><span class="status" data-status role="status">Connecting to live totals…</span><output data-clicks>0 / 20</output></div>
          </div>
          <div class="action"><button type="button" aria-label="Add five percent"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.35-9.38-8.26C.75 9.38 2.26 5.5 5.86 4.67 8 4.18 10.08 5.1 12 7.13c1.92-2.03 4-2.95 6.14-2.46 3.6.83 5.11 4.71 3.24 8.07C19.2 16.65 12 21 12 21Z"/></svg><span data-button-label>Add 5%</span><span class="percent" data-percent>0%</span></button></div>
          <a class="privacy" href="https://dwij-portfolio.antideploy.app/privacy/">Anonymous by design</a>
        </section>`;
    }
  }
  if (!customElements.get("dwij-engagement")) customElements.define("dwij-engagement", DwijEngagement);
})();

