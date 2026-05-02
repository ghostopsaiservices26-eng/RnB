import { Component } from '@angular/core';

const PILLARS = [
  {
    num: '01',
    title: 'Curated Group Chemistry',
    body: 'We design 12–16 person groups through detailed intake forms that screen for travel style, pace preference, and conversation potential. No random assembly — every group is intentionally composed.',
    img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80',
  },
  {
    num: '02',
    title: 'Personally Inspected Properties',
    body: 'Every villa, resort, and venue is photographed and verified by our operations lead. No stock photos, no surprises. What you see is exactly what you get — date-stamped and founder-verified.',
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  },
  {
    num: '03',
    title: 'Complete Trip Management',
    body: 'Transportation, activities, dining, group introductions, on-ground support. We handle everything so guests can be fully present. One price. One number. Zero logistics.',
    img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80',
  },
  {
    num: '04',
    title: 'Pre-Trip Community',
    body: 'WhatsApp introductions with personalised context, trip briefings with insider tips, designed ice-breaker moments that create shared stories before anyone meets in person.',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },
];

@Component({
  selector: 'app-solution-section',
  standalone: true,
  template: `
    <section class="sol-section" id="about">
      <div class="sol-inner">
        <div class="sol-header">
          <span class="sol-label">Our Solution</span>
          <h2 class="sol-h2">Intentional Travel.</h2>
          <p class="sol-sub">
            RnB is the only brand that treats group chemistry as a
            <em>designable product feature</em>. We don't just book properties —
            we build communities before the trip begins.
          </p>
        </div>
        <div class="sol-pillars">
          @for (p of pillars; track p.num) {
            <div class="sol-pillar" [class.reverse]="$even">
              <div class="sol-img-wrap">
                <img [src]="p.img" [alt]="p.title" class="sol-img" loading="lazy" />
                <div class="sol-num">{{ p.num }}</div>
              </div>
              <div class="sol-text">
                <h3 class="sol-pillar-title">{{ p.title }}</h3>
                <p class="sol-pillar-body">{{ p.body }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .sol-section { background: #F7F4EF; padding: 100px 2rem; }
    .sol-inner { max-width: 1100px; margin: 0 auto; }
    .sol-header { text-align: center; margin-bottom: 80px; }
    .sol-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .sol-h2 {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.05;
      color: #1A1A18;
      margin: 0 0 1.25rem;
    }
    .sol-sub {
      font-size: 1rem;
      color: #7A7167;
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.75;
    }
    .sol-sub em { color: #2C4A3E; font-style: normal; font-weight: 600; }
    .sol-pillars { display: flex; flex-direction: column; gap: 80px; }
    .sol-pillar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    .sol-pillar.reverse { direction: rtl; }
    .sol-pillar.reverse > * { direction: ltr; }
    .sol-img-wrap { position: relative; border-radius: 20px; overflow: hidden; }
    .sol-img { width: 100%; height: 360px; object-fit: cover; display: block; }
    .sol-num {
      position: absolute;
      top: 1.25rem;
      left: 1.25rem;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fff;
      background: #C8622A;
      border-radius: 100px;
      padding: 4px 12px;
    }
    .sol-pillar-title {
      font-size: clamp(1.4rem, 3vw, 2rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #1A1A18;
      margin: 0 0 1rem;
      line-height: 1.15;
    }
    .sol-pillar-body {
      font-size: 0.95rem;
      line-height: 1.8;
      color: #7A7167;
      margin: 0;
    }
    @media (max-width: 768px) {
      .sol-pillar { grid-template-columns: 1fr; gap: 24px; }
      .sol-pillar.reverse { direction: ltr; }
      .sol-img { height: 240px; }
    }
  `],
})
export class SolutionSectionComponent {
  pillars = PILLARS;
}
