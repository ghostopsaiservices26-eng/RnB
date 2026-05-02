import { Component } from '@angular/core';

const TRENDS = [
  {
    num: '01',
    title: 'Remote Work Normalisation',
    body: 'Location flexibility is no longer the exception — it\'s expected among knowledge workers. Workcations have evolved from aspirational to operational. Professionals now search for productivity + community + environment.',
    stat: '30%+',
    statLabel: 'annual growth in workcation segment post-pandemic',
  },
  {
    num: '02',
    title: 'Experience Economy Shift',
    body: 'India\'s urban millennial and Gen Z cohorts prioritise experiences over possessions. Travel is identity. The trip someone takes signals who they are — creating demand for brands that deliver both quality and social currency.',
    stat: '₹1.6L Cr+',
    statLabel: 'India\'s domestic tourism market',
  },
  {
    num: '03',
    title: 'Trust Deficit in Travel',
    body: 'Stock photos, fake reviews, and properties that don\'t match listings have created widespread scepticism. Travellers desperately want a brand they can trust but have no credible option. RnB\'s specificity-driven approach directly addresses this.',
    stat: '50M+',
    statLabel: 'target demographic individuals taking 2–4 trips annually',
  },
  {
    num: '04',
    title: 'Community-as-Product Validation',
    body: 'Global brands — WeRoad, Contiki, Flash Pack — have proven curated group travel works at scale. India has no equivalent. The model is validated internationally. The opportunity is to execute it properly in the Indian market.',
    stat: '₹35,000 Cr',
    statLabel: 'group travel market with fragmented operators',
  },
];

@Component({
  selector: 'app-why-now-section',
  standalone: true,
  template: `
    <section class="wn-section">
      <div class="wn-inner">
        <div class="wn-header">
          <span class="wn-label">Why Now</span>
          <h2 class="wn-h2">Four converging trends.<br/>One perfect moment.</h2>
          <p class="wn-sub">
            The timing for RnB isn't coincidental — it's structural.
          </p>
        </div>
        <div class="wn-grid">
          @for (t of trends; track t.num) {
            <div class="wn-card">
              <div class="wn-card-top">
                <span class="wn-num">{{ t.num }}</span>
                <div class="wn-stat-block">
                  <span class="wn-stat">{{ t.stat }}</span>
                  <span class="wn-stat-label">{{ t.statLabel }}</span>
                </div>
              </div>
              <h3 class="wn-title">{{ t.title }}</h3>
              <p class="wn-body">{{ t.body }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wn-section { background: #1A1A18; padding: 100px 2rem; }
    .wn-inner { max-width: 1100px; margin: 0 auto; }
    .wn-header { text-align: center; margin-bottom: 64px; }
    .wn-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .wn-h2 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #F7F4EF;
      margin: 0 0 1rem;
    }
    .wn-sub {
      font-size: 1rem;
      color: rgba(247,244,239,0.45);
      margin: 0;
    }
    .wn-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .wn-card {
      background: rgba(247,244,239,0.04);
      border: 1px solid rgba(247,244,239,0.08);
      border-radius: 16px;
      padding: 2rem;
      transition: background 0.2s;
    }
    .wn-card:hover { background: rgba(247,244,239,0.07); }
    .wn-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .wn-num {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: rgba(247,244,239,0.3);
    }
    .wn-stat-block { text-align: right; }
    .wn-stat {
      display: block;
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #C8622A;
      line-height: 1;
    }
    .wn-stat-label {
      display: block;
      font-size: 0.68rem;
      color: rgba(247,244,239,0.35);
      line-height: 1.4;
      max-width: 140px;
      text-align: right;
      margin-top: 4px;
    }
    .wn-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #F7F4EF;
      margin: 0 0 0.75rem;
      letter-spacing: -0.01em;
    }
    .wn-body {
      font-size: 0.875rem;
      line-height: 1.75;
      color: rgba(247,244,239,0.5);
      margin: 0;
    }
  `],
})
export class WhyNowSectionComponent {
  trends = TRENDS;
}
