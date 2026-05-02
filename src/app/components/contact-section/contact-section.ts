import { Component } from '@angular/core';

const ENGAGE = [
  {
    icon: '📈',
    who: 'For Investors',
    body: 'We\'re building a category-defining brand with strong unit economics, defensible competitive advantages, and a clear path to profitable scale.',
    items: ['Seed capital for Phase 1 execution', 'Strategic partnerships in travel & fintech', 'Advisory roles for community-brand operators'],
  },
  {
    icon: '🌿',
    who: 'For Team Members',
    body: 'We\'re hiring people who believe experiences are worth building properly.',
    items: ['Operations & on-ground execution', 'Content & community building', 'B2B sales & corporate partnerships'],
  },
  {
    icon: '🤝',
    who: 'For Partners',
    body: 'We\'re actively seeking strategic partnerships with aligned brands and operators.',
    items: ['Property owners & hospitality operators', 'Travel creators & content producers', 'Co-working spaces & lifestyle brands', 'Tech platforms for payments & bookings'],
  },
];

const ROADMAP = [
  { phase: 'Phase 1', years: 'Year 1–2', label: 'Prove', desc: '1–3 cities. 3 product verticals tested. Brand identity established. Community of 10,000+ built.' },
  { phase: 'Phase 2', years: 'Year 3–5', label: 'Scale', desc: '8–12 cities. Dedicated verticals launched. Influencer ecosystem activated. Revenue ₹5Cr+.' },
  { phase: 'Phase 3', years: 'Year 6–15', label: 'Define', desc: 'Category leadership. Membership model. International destinations. The reference brand for a generation.' },
];

@Component({
  selector: 'app-contact-section',
  standalone: true,
  template: `
    <section class="contact-section" id="contact">
      <div class="cs-inner">

        <!-- Roadmap -->
        <div class="cs-roadmap-block">
          <span class="cs-label">The 15-Year Vision</span>
          <h2 class="cs-h2">Built to define<br/>a category.</h2>
          <div class="cs-roadmap">
            @for (r of roadmap; track r.phase) {
              <div class="cs-roadmap-item">
                <div class="cs-roadmap-meta">
                  <span class="cs-roadmap-phase">{{ r.phase }}</span>
                  <span class="cs-roadmap-years">{{ r.years }}</span>
                </div>
                <div class="cs-roadmap-label">{{ r.label }}</div>
                <p class="cs-roadmap-desc">{{ r.desc }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Engage options -->
        <div class="cs-engage-block">
          <span class="cs-label">How to Engage</span>
          <h3 class="cs-engage-h3">Join us in building<br/>India's most intentional travel brand.</h3>
          <div class="cs-engage-grid">
            @for (e of engage; track e.who) {
              <div class="cs-engage-card">
                <div class="cs-engage-icon">{{ e.icon }}</div>
                <h4 class="cs-engage-who">{{ e.who }}</h4>
                <p class="cs-engage-body">{{ e.body }}</p>
                <ul class="cs-engage-list">
                  @for (item of e.items; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
                <a href="mailto:roamnbeyondteam@gmail.com" class="cs-engage-cta">Get in Touch</a>
              </div>
            }
          </div>
        </div>

        <!-- Contact strip -->
        <div class="cs-contact-strip">
          <div class="cs-contact-info">
            <a href="mailto:roamnbeyondteam@gmail.com" class="cs-contact-link">
              <svg viewBox="0 0 20 16" fill="none"><path d="M1 1h18v14H1V1zm0 0l9 8 9-8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              roamnbeyondteam&#64;gmail.com
            </a>
            <a href="https://instagram.com/roamn_beyond" target="_blank" class="cs-contact-link">
              <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              &#64;roamn_beyond
            </a>
            <a href="https://linkedin.com/company/roamnbeyond" target="_blank" class="cs-contact-link">
              <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M7 10v7M7 7v.5M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              linkedin.com/company/roamnbeyond
            </a>
          </div>
          <a href="mailto:roamnbeyondteam@gmail.com" class="cs-join-btn">Join the Waitlist →</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="rnb-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">RnB</span>
          <span class="footer-tagline">Go Beyond Usual.</span>
        </div>
        <p class="footer-copy">© 2026 Roam &amp; Beyond Travel Experiences. Bengaluru, India.</p>
        <p class="footer-mission">We exist for people who travel to become, not just to go.</p>
      </div>
    </footer>
  `,
  styles: [`
    .contact-section { background: #F7F4EF; padding: 100px 2rem 0; }
    .cs-inner { max-width: 1100px; margin: 0 auto; }

    /* Roadmap */
    .cs-roadmap-block { text-align: center; margin-bottom: 100px; }
    .cs-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .cs-h2 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #1A1A18;
      margin: 0 0 3rem;
    }
    .cs-roadmap {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      border: 1px solid rgba(26,26,24,0.1);
      border-radius: 16px;
      overflow: hidden;
    }
    .cs-roadmap-item {
      padding: 2rem;
      text-align: left;
      border-right: 1px solid rgba(26,26,24,0.1);
    }
    .cs-roadmap-item:last-child { border-right: none; }
    .cs-roadmap-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1rem;
    }
    .cs-roadmap-phase {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #C8622A;
    }
    .cs-roadmap-years {
      font-size: 0.65rem;
      color: #7A7167;
      letter-spacing: 0.05em;
    }
    .cs-roadmap-label {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #1A1A18;
      margin-bottom: 0.75rem;
    }
    .cs-roadmap-desc {
      font-size: 0.875rem;
      line-height: 1.7;
      color: #7A7167;
      margin: 0;
    }

    /* Engage */
    .cs-engage-block { margin-bottom: 80px; }
    .cs-engage-h3 {
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #1A1A18;
      margin: 0 0 2.5rem;
      line-height: 1.1;
    }
    .cs-engage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .cs-engage-card {
      background: #EDE8E0;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .cs-engage-icon { font-size: 1.75rem; margin-bottom: 1rem; }
    .cs-engage-who {
      font-size: 1rem;
      font-weight: 700;
      color: #1A1A18;
      margin: 0 0 0.5rem;
      letter-spacing: -0.01em;
    }
    .cs-engage-body {
      font-size: 0.875rem;
      line-height: 1.7;
      color: #7A7167;
      margin: 0 0 1rem;
    }
    .cs-engage-list {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }
    .cs-engage-list li {
      font-size: 0.82rem;
      color: #1A1A18;
      padding-left: 1rem;
      position: relative;
      line-height: 1.5;
    }
    .cs-engage-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #C8622A;
      font-size: 0.7rem;
    }
    .cs-engage-cta {
      display: inline-block;
      padding: 10px 20px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #fff;
      background: #2C4A3E;
      border-radius: 100px;
      text-decoration: none;
      text-align: center;
      transition: background 0.2s;
    }
    .cs-engage-cta:hover { background: #3d6655; }

    /* Contact strip */
    .cs-contact-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 2rem;
      background: #2C4A3E;
      border-radius: 16px;
      margin-bottom: 0;
    }
    .cs-contact-info { display: flex; flex-wrap: wrap; gap: 1.5rem; }
    .cs-contact-link {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: rgba(247,244,239,0.75);
      text-decoration: none;
      transition: color 0.2s;
    }
    .cs-contact-link:hover { color: #F7F4EF; }
    .cs-contact-link svg { width: 16px; height: 16px; flex-shrink: 0; }
    .cs-join-btn {
      padding: 12px 28px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #1A1A18;
      background: #F7F4EF;
      border-radius: 100px;
      text-decoration: none;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .cs-join-btn:hover { background: #fff; }

    /* Footer */
    .rnb-footer {
      background: #1A1A18;
      padding: 3rem 2rem;
      margin-top: 0;
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .footer-brand {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .footer-logo {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #F7F4EF;
    }
    .footer-tagline {
      font-size: 0.85rem;
      color: rgba(247,244,239,0.4);
      font-style: italic;
    }
    .footer-copy {
      font-size: 0.78rem;
      color: rgba(247,244,239,0.3);
      margin: 0;
    }
    .footer-mission {
      font-size: 0.82rem;
      color: rgba(247,244,239,0.25);
      font-style: italic;
      margin: 0;
    }
    @media (max-width: 768px) {
      .cs-roadmap { grid-template-columns: 1fr; }
      .cs-roadmap-item { border-right: none; border-bottom: 1px solid rgba(26,26,24,0.1); }
      .cs-roadmap-item:last-child { border-bottom: none; }
      .cs-contact-strip { flex-direction: column; align-items: flex-start; }
    }
  `],
})
export class ContactSectionComponent {
  engage = ENGAGE;
  roadmap = ROADMAP;
}
