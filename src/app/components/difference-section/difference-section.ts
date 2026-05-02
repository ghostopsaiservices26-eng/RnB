import { Component } from '@angular/core';

const ROWS = [
  { them: 'Random group assembly — first come, first served', us: 'Intentional group design through intake forms and composition rules' },
  { them: 'Stock photography, properties not inspected', us: 'Every property personally photographed and date-stamped by our operations lead' },
  { them: 'Transactional booking experience', us: 'Pre-trip community sequence creates connection before arrival' },
  { them: 'Slow response times, generic messaging', us: 'Personal responses from founders, 15-minute response standard' },
  { them: 'Destination-locked brand identity', us: 'Pan India brand from Day 1, geography-agnostic positioning' },
];

@Component({
  selector: 'app-difference-section',
  standalone: true,
  template: `
    <section class="diff-section">
      <div class="diff-inner">
        <div class="diff-header">
          <span class="diff-label">Why RnB</span>
          <h2 class="diff-h2">Not just better.<br/>Fundamentally different.</h2>
        </div>
        <div class="diff-table-wrap">
          <div class="diff-col-heads">
            <div class="diff-col-head them">Typical Operators</div>
            <div class="diff-col-head us">RnB Approach</div>
          </div>
          @for (row of rows; track row.them) {
            <div class="diff-row">
              <div class="diff-cell them">
                <svg class="diff-x" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#C8622A" fill-opacity="0.1"/>
                  <path d="M5 5l6 6M11 5l-6 6" stroke="#C8622A" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                {{ row.them }}
              </div>
              <div class="diff-cell us">
                <svg class="diff-check" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#2C4A3E" fill-opacity="0.12"/>
                  <path d="M4.5 8.5l2.5 2.5 5-5" stroke="#2C4A3E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ row.us }}
              </div>
            </div>
          }
        </div>
        <div class="diff-moat">
          <h3 class="diff-moat-title">Our Competitive Moat</h3>
          <div class="diff-moat-grid">
            <div class="diff-moat-card">
              <span class="diff-moat-num">01</span>
              <h4>Group Chemistry Methodology</h4>
              <p>No competitor systematically designs group composition. This cannot be copied without rebuilding operations from scratch.</p>
            </div>
            <div class="diff-moat-card">
              <span class="diff-moat-num">02</span>
              <h4>Trust Through Specificity</h4>
              <p>Date-stamped photography, founder responsiveness, and transparent pricing create brand equity that paid advertising cannot replicate.</p>
            </div>
            <div class="diff-moat-card">
              <span class="diff-moat-num">03</span>
              <h4>Referral Flywheel</h4>
              <p>Each successful trip generates 2–3 organic referrals. As the community grows, acquisition costs decrease while brand strength increases.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .diff-section { background: #F7F4EF; padding: 100px 2rem; }
    .diff-inner { max-width: 1100px; margin: 0 auto; }
    .diff-header { text-align: center; margin-bottom: 56px; }
    .diff-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .diff-h2 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #1A1A18;
      margin: 0;
    }
    .diff-table-wrap {
      border: 1px solid rgba(26,26,24,0.1);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 80px;
    }
    .diff-col-heads {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: #1A1A18;
    }
    .diff-col-head {
      padding: 14px 24px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .diff-col-head.them { color: rgba(247,244,239,0.5); }
    .diff-col-head.us { color: #C8622A; }
    .diff-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 1px solid rgba(26,26,24,0.07);
    }
    .diff-row:nth-child(even) { background: rgba(26,26,24,0.02); }
    .diff-cell {
      padding: 1.25rem 1.5rem;
      font-size: 0.88rem;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .diff-cell.them { color: #7A7167; border-right: 1px solid rgba(26,26,24,0.07); }
    .diff-cell.us { color: #1A1A18; font-weight: 500; }
    .diff-x, .diff-check { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; }

    /* Moat */
    .diff-moat { }
    .diff-moat-title {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1A1A18;
      text-align: center;
      margin: 0 0 2rem;
    }
    .diff-moat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .diff-moat-card {
      background: #2C4A3E;
      border-radius: 16px;
      padding: 2rem;
      color: #F7F4EF;
    }
    .diff-moat-num {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .diff-moat-card h4 {
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #F7F4EF;
    }
    .diff-moat-card p {
      font-size: 0.875rem;
      line-height: 1.7;
      color: rgba(247,244,239,0.6);
      margin: 0;
    }
    @media (max-width: 640px) {
      .diff-col-heads, .diff-row { grid-template-columns: 1fr; }
      .diff-cell.them { border-right: none; border-bottom: 1px solid rgba(26,26,24,0.07); }
      .diff-col-head.them { border-bottom: 1px solid rgba(255,255,255,0.1); }
    }
  `],
})
export class DifferenceSectionComponent {
  rows = ROWS;
}
