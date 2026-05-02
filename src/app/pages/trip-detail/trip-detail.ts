import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { BookingService, Trip } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    @if (trip()) {
      <div class="detail-page">
        <!-- Hero -->
        <div class="detail-hero" [style.backgroundImage]="'url(' + trip()!.images[0] + ')'">
          <div class="detail-hero-overlay">
            <div class="detail-hero-inner">
              <a routerLink="/trips" class="back-link">← All Trips</a>
              <span class="detail-category">{{ categoryLabel(trip()!.category) }}</span>
              <h1 class="detail-title">{{ trip()!.name }}</h1>
              <p class="detail-tagline">{{ trip()!.tagline }}</p>
              <div class="detail-chips">
                <span class="chip">📍 {{ trip()!.location }}</span>
                <span class="chip">🕐 {{ trip()!.duration }}</span>
                <span class="chip">👥 Max {{ trip()!.maxSeats }} people</span>
                <span class="chip">⭐ {{ trip()!.rating }} ({{ trip()!.reviews }} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="detail-body">
          <div class="detail-content">
            <!-- Left: Details -->
            <div class="detail-main">
              <section class="detail-section">
                <h2 class="section-h2">About this trip</h2>
                <p class="detail-desc">{{ trip()!.description }}</p>
              </section>

              <section class="detail-section">
                <h2 class="section-h2">Highlights</h2>
                <ul class="highlight-list">
                  @for (h of trip()!.highlights; track h) {
                    <li>
                      <span class="bullet">✦</span>
                      {{ h }}
                    </li>
                  }
                </ul>
              </section>

              <section class="detail-section">
                <h2 class="section-h2">What's included</h2>
                <ul class="includes-list">
                  @for (inc of trip()!.includes; track inc) {
                    <li>
                      <span class="check">✓</span>
                      {{ inc }}
                    </li>
                  }
                </ul>
              </section>

              @if (trip()!.images.length > 1) {
                <section class="detail-section">
                  <h2 class="section-h2">Gallery</h2>
                  <div class="gallery-grid">
                    @for (img of trip()!.images; track img) {
                      <img [src]="img" [alt]="trip()!.name" class="gallery-img" loading="lazy" />
                    }
                  </div>
                </section>
              }
            </div>

            <!-- Right: Booking card -->
            <aside class="booking-card">
              <div class="booking-card-inner">
                @if (trip()!.category !== 'corporate') {
                  <div class="price-block">
                    @if (trip()!.originalPrice) {
                      <span class="original-price">₹{{ trip()!.originalPrice | number }}</span>
                    }
                    <span class="current-price">₹{{ trip()!.price | number }}</span>
                    <span class="price-label">per person</span>
                  </div>
                } @else {
                  <div class="price-block">
                    <span class="current-price">Custom</span>
                    <span class="price-label">pricing for your team</span>
                  </div>
                }

                <div class="seats-bar">
                  <div class="seats-info">
                    <span class="seats-left" [class.urgent]="trip()!.seatsLeft <= 3">
                      {{ trip()!.seatsLeft }} spots remaining
                    </span>
                    <span class="seats-total">of {{ trip()!.maxSeats }}</span>
                  </div>
                  <div class="seats-track">
                    <div
                      class="seats-fill"
                      [style.width.%]="((trip()!.maxSeats - trip()!.seatsLeft) / trip()!.maxSeats) * 100"
                    ></div>
                  </div>
                </div>

                <div class="dates-list">
                  <h4 class="dates-title">Available dates</h4>
                  @for (d of trip()!.dates; track d) {
                    <div class="date-chip">{{ d }}</div>
                  }
                </div>

                <button class="book-btn" (click)="handleBook()">
                  {{ trip()!.category === 'corporate' ? 'Get a Quote' : 'Book This Trip' }}
                </button>

                @if (!auth.isLoggedIn()) {
                  <p class="login-note">
                    <a routerLink="/login">Sign in</a> to complete your booking.
                  </p>
                }

                <div class="trust-badges">
                  <span>🔒 Secure booking</span>
                  <span>✅ Instant confirmation</span>
                  <span>🔄 Free cancellation</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <h2>Trip not found</h2>
        <a routerLink="/trips">← Back to all trips</a>
      </div>
    }
  `,
  styles: [`
    .detail-page { min-height: 100vh; background: #F7F4EF; }
    .detail-hero {
      height: 520px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .detail-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%);
      display: flex;
      align-items: flex-end;
    }
    .detail-hero-inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem 3rem;
      width: 100%;
    }
    .back-link {
      display: inline-block;
      color: rgba(255,255,255,0.8);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      margin-bottom: 1rem;
      transition: color 0.15s;
    }
    .back-link:hover { color: #fff; }
    .detail-category {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #F7F4EF;
      background: #C8622A;
      border-radius: 100px;
      padding: 4px 12px;
      margin-bottom: 0.75rem;
    }
    .detail-title {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      color: #fff;
      margin: 0 0 0.5rem;
      line-height: 1.1;
    }
    .detail-tagline { font-size: 1rem; color: rgba(255,255,255,0.75); margin: 0 0 1.25rem; }
    .detail-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      font-size: 0.78rem;
      color: #fff;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 100px;
      padding: 5px 14px;
    }
    .detail-body { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; }
    .detail-content { display: grid; grid-template-columns: 1fr 340px; gap: 3rem; align-items: start; }
    .detail-section { margin-bottom: 2.5rem; }
    .section-h2 {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1A1A18;
      margin: 0 0 1rem;
    }
    .detail-desc { font-size: 0.95rem; line-height: 1.8; color: #7A7167; margin: 0; }
    .highlight-list, .includes-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .highlight-list li, .includes-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.9rem;
      color: #1A1A18;
      line-height: 1.5;
    }
    .bullet { color: #C8622A; font-size: 0.7rem; margin-top: 3px; flex-shrink: 0; }
    .check { color: #2C4A3E; font-weight: 700; flex-shrink: 0; }
    .gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .gallery-img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; }

    /* Booking card */
    .booking-card { position: sticky; top: 80px; }
    .booking-card-inner {
      background: #fff;
      border-radius: 20px;
      padding: 1.75rem;
      border: 1px solid rgba(26,26,24,0.08);
      box-shadow: 0 4px 30px rgba(26,26,24,0.07);
    }
    .price-block { margin-bottom: 1.25rem; }
    .original-price { display: block; font-size: 0.85rem; color: #7A7167; text-decoration: line-through; }
    .current-price { font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; color: #1A1A18; }
    .price-label { font-size: 0.8rem; color: #7A7167; margin-left: 4px; }
    .seats-bar { margin-bottom: 1.25rem; }
    .seats-info { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .seats-left { font-size: 0.82rem; font-weight: 600; color: #2C4A3E; }
    .seats-left.urgent { color: #C8622A; }
    .seats-total { font-size: 0.78rem; color: #7A7167; }
    .seats-track { height: 6px; background: rgba(26,26,24,0.08); border-radius: 3px; overflow: hidden; }
    .seats-fill { height: 100%; background: #2C4A3E; border-radius: 3px; transition: width 0.3s; }
    .dates-list { margin-bottom: 1.5rem; }
    .dates-title { font-size: 0.78rem; font-weight: 700; color: #7A7167; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.75rem; }
    .date-chip {
      padding: 8px 12px;
      background: #F7F4EF;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #1A1A18;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .book-btn {
      width: 100%;
      padding: 14px;
      background: #C8622A;
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 0.75rem;
      font-family: inherit;
    }
    .book-btn:hover { background: #E8845A; }
    .login-note { font-size: 0.82rem; color: #7A7167; text-align: center; margin: 0 0 1rem; }
    .login-note a { color: #2C4A3E; font-weight: 600; text-decoration: none; }
    .trust-badges {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(26,26,24,0.07);
    }
    .trust-badges span { font-size: 0.78rem; color: #7A7167; }
    .not-found {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #1A1A18;
      padding-top: 80px;
    }
    .not-found a { color: #2C4A3E; font-weight: 600; text-decoration: none; }
    @media (max-width: 900px) {
      .detail-content { grid-template-columns: 1fr; }
      .booking-card { position: static; }
      .detail-hero { height: 380px; }
    }
    @media (max-width: 600px) {
      .detail-body { padding: 2rem 1rem 4rem; }
      .gallery-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class TripDetailComponent implements OnInit {
  trip = signal<Trip | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingSvc: BookingService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.trip.set(this.bookingSvc.getTripById(id));
  }

  categoryLabel(cat: Trip['category']): string {
    return { group: 'Group Trip', workcation: 'Workcation', corporate: 'Corporate', villa: 'Private Villa' }[cat];
  }

  handleBook() {
    const t = this.trip();
    if (!t) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/booking/${t.id}` } });
      return;
    }
    this.router.navigate(['/booking', t.id]);
  }
}
