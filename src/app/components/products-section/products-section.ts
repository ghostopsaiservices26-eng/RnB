import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const PRODUCTS = [
  {
    id: 'trips',
    tag: 'Most Popular',
    icon: '🏕️',
    title: 'Curated Group Trips',
    price: '₹15,000 – ₹22,000',
    unit: 'per person',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    desc: '12–16 person experiences across India\'s most sought-after destinations. Every group is intentionally composed. Every detail handled.',
    features: ['Intake-based group matching', 'Personally inspected properties', 'All logistics handled', 'On-ground support'],
    cta: 'View Upcoming Trips',
    routerLink: '/trips',
    filterKey: 'group',
  },
  {
    id: 'workcations',
    tag: 'Remote-First',
    icon: '💻',
    title: 'Workcation Retreats',
    price: 'Premium',
    unit: '2–4 week stays',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    desc: 'Work somewhere beautiful surrounded by people who understand the builder identity. Certified workspaces, curated cohort, everything handled.',
    features: ['Workspace certified internet', 'Curated cohort of builders', '2–4 week stays', 'Community dinners included'],
    cta: 'Explore Workcations',
    routerLink: '/trips',
    filterKey: 'workcation',
  },
  {
    id: 'corporate',
    tag: 'B2B',
    icon: '🤝',
    title: 'Corporate Offsites',
    price: 'Custom',
    unit: 'per team',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80',
    desc: 'Team building and company retreats with full customisation. One number, one price. Your team shows up — we handle the rest.',
    features: ['Fully customised experience', 'Team building activities', 'One-price transparency', 'Dedicated operations lead'],
    cta: 'Get a Quote',
    routerLink: '/trips',
    filterKey: 'corporate',
  },
  {
    id: 'villa',
    tag: 'Private',
    icon: '🏡',
    title: 'Private Villa Bookings',
    price: '₹12,000 – ₹35,000',
    unit: 'per person',
    img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
    desc: 'Curated property booking with concierge service for your own group. Founder-verified villas, complete trip management, zero surprises.',
    features: ['Founder-verified properties', 'Private group only', 'Concierge service', 'Transparent pricing'],
    cta: 'Book a Villa',
    routerLink: '/trips',
    filterKey: 'villa',
  },
];

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="prod-section" id="trips">
      <div class="prod-inner">
        <div class="prod-header">
          <span class="prod-label">What We Offer</span>
          <h2 class="prod-h2">Four ways to travel<br/>beyond usual.</h2>
        </div>
        <div class="prod-grid">
          @for (p of products; track p.id) {
            <div class="prod-card" [id]="p.filterKey">
              <div class="prod-img-wrap">
                <img [src]="p.img" [alt]="p.title" class="prod-img" loading="lazy" />
                <span class="prod-tag">{{ p.tag }}</span>
              </div>
              <div class="prod-body">
                <div class="prod-icon">{{ p.icon }}</div>
                <h3 class="prod-title">{{ p.title }}</h3>
                <p class="prod-desc">{{ p.desc }}</p>
                <ul class="prod-features">
                  @for (f of p.features; track f) {
                    <li>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="#2C4A3E" fill-opacity="0.1"/>
                        <path d="M4 7l2 2 4-4" stroke="#2C4A3E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ f }}
                    </li>
                  }
                </ul>
                <div class="prod-footer">
                  <div class="prod-price-block">
                    <span class="prod-price">{{ p.price }}</span>
                    <span class="prod-unit">{{ p.unit }}</span>
                  </div>
                  <a [routerLink]="p.routerLink" class="prod-cta">{{ p.cta }}</a>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .prod-section { background: #EDE8E0; padding: 100px 2rem; }
    .prod-inner { max-width: 1200px; margin: 0 auto; }
    .prod-header { text-align: center; margin-bottom: 64px; }
    .prod-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .prod-h2 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #1A1A18;
      margin: 0;
    }
    .prod-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .prod-card {
      background: #F7F4EF;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(26,26,24,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .prod-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(26,26,24,0.1);
    }
    .prod-img-wrap { position: relative; }
    .prod-img { width: 100%; height: 200px; object-fit: cover; display: block; }
    .prod-tag {
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
      background: #C8622A;
      border-radius: 100px;
      padding: 4px 12px;
    }
    .prod-body { padding: 1.5rem; display: flex; flex-direction: column; flex: 1; }
    .prod-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
    .prod-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1A1A18;
      margin: 0 0 0.75rem;
    }
    .prod-desc {
      font-size: 0.875rem;
      line-height: 1.7;
      color: #7A7167;
      margin: 0 0 1.25rem;
    }
    .prod-features {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .prod-features li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: #1A1A18;
    }
    .prod-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid rgba(26,26,24,0.08);
    }
    .prod-price-block { display: flex; flex-direction: column; }
    .prod-price { font-size: 1rem; font-weight: 700; color: #2C4A3E; }
    .prod-unit { font-size: 0.72rem; color: #7A7167; }
    .prod-cta {
      padding: 8px 18px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #fff;
      background: #2C4A3E;
      border-radius: 100px;
      text-decoration: none;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .prod-cta:hover { background: #3d6655; }
  `],
})
export class ProductsSectionComponent {
  products = PRODUCTS;
}
