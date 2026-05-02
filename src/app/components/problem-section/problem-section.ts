import { Component } from '@angular/core';

const PROBLEMS = [
  {
    icon: '📱',
    title: 'Coordination Chaos',
    body: '50+ WhatsApp messages, multiple spreadsheets, endless follow-ups. Someone always drops out. The organiser becomes group admin instead of enjoying the trip.',
  },
  {
    icon: '🧩',
    title: 'Chemistry Mismatch',
    body: 'Three introverts, seven extroverts. Five wanting adventure, five wanting to lounge. Random groups ruin even the best properties — forced conversations, awkward silences.',
  },
  {
    icon: '⚠️',
    title: 'Trust Deficit',
    body: 'Stock photos that don\'t match reality. Hidden costs. Unresponsive operators. Travellers have been burned repeatedly and have no brand they genuinely trust.',
  },
  {
    icon: '🏠',
    title: 'Experience Gap',
    body: 'Operators aggregate properties but don\'t design experiences. A villa booking is not the same as a curated trip. The traveller still carries all the cognitive load.',
  },
];

@Component({
  selector: 'app-problem-section',
  standalone: true,
  template: `
    <section class="problem-section">
      <div class="ps-inner">
        <div class="ps-header">
          <span class="ps-label">The Problem</span>
          <h2 class="ps-h2">Group travel in India<br/>is broken.</h2>
          <p class="ps-sub">
            Despite being a <strong>₹35,000+ crore market</strong>, the experience remains
            consistently disappointing. Young India takes 2–4 trips per year and consistently
            reports the same story.
          </p>
        </div>
        <div class="ps-grid">
          @for (p of problems; track p.title) {
            <div class="ps-card">
              <div class="ps-icon">{{ p.icon }}</div>
              <h3 class="ps-card-title">{{ p.title }}</h3>
              <p class="ps-card-body">{{ p.body }}</p>
            </div>
          }
        </div>
        <div class="ps-bottom">
          <p class="ps-verdict">
            The market exists. The willingness to pay exists.<br/>
            <strong>What's missing is a brand that actually solves the problem.</strong>
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .problem-section {
      background: #2C4A3E;
      padding: 100px 2rem;
      color: #F7F4EF;
    }
    .ps-inner { max-width: 1100px; margin: 0 auto; }
    .ps-header { text-align: center; margin-bottom: 64px; }
    .ps-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .ps-h2 {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.05;
      margin: 0 0 1.5rem;
      color: #F7F4EF;
    }
    .ps-sub {
      font-size: 1rem;
      color: rgba(247,244,239,0.65);
      max-width: 560px;
      margin: 0 auto;
      line-height: 1.75;
    }
    .ps-sub strong { color: rgba(247,244,239,0.9); }
    .ps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 64px;
    }
    .ps-card {
      background: rgba(247,244,239,0.06);
      border: 1px solid rgba(247,244,239,0.1);
      border-radius: 16px;
      padding: 2rem;
      transition: background 0.2s;
    }
    .ps-card:hover { background: rgba(247,244,239,0.1); }
    .ps-icon { font-size: 1.75rem; margin-bottom: 1rem; }
    .ps-card-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #F7F4EF;
      letter-spacing: -0.01em;
    }
    .ps-card-body {
      font-size: 0.88rem;
      line-height: 1.7;
      color: rgba(247,244,239,0.6);
      margin: 0;
    }
    .ps-bottom { text-align: center; }
    .ps-verdict {
      font-size: 1.1rem;
      line-height: 1.75;
      color: rgba(247,244,239,0.7);
      margin: 0;
    }
    .ps-verdict strong { color: #F7F4EF; }
  `],
})
export class ProblemSectionComponent {
  problems = PROBLEMS;
}
