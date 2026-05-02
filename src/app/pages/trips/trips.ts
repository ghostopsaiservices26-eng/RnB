import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { BookingService, Trip } from '../../services/booking.service';

type Filter = 'all' | 'group' | 'workcation' | 'corporate' | 'villa';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="trips-page">
      <!-- Header -->
      <div class="trips-header">
        <div class="trips-header-inner">
          <span class="page-label">All Experiences</span>
          <h1 class="trips-h1">Find your next<br/>beyond-usual trip.</h1>
          <p class="trips-sub">
            Every RnB trip is curated end-to-end — the right group, the right property, the right experience.
          </p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-inner">
          @for (f of filters; track f.key) {
            <button
              class="filter-btn"
              [class.active]="activeFilter() === f.key"
              (click)="activeFilter.set(f.key)"
            >
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Grid -->
      <div class="trips-body">
        <div class="trips-grid">
          @for (trip of filteredTrips(); track trip.id) {
            <div class="trip-card">
              <a [routerLink]="['/trips', trip.id]" class="trip-img-wrap">
                <img [src]="trip.images[0]" [alt]="trip.name" class="trip-img" loading="lazy" />
                <span class="trip-category-badge">{{ categoryLabel(trip.category) }}</span>
                @if (trip.seatsLeft <= 3 && trip.seatsLeft > 0) {
                  <span class="trip-urgency">Only {{ trip.seatsLeft }} spots left!</span>
                }
              </a>
              <div class="trip-body">
                <div class="trip-meta">
                  <span class="trip-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                    {{ trip.location }}
                  </span>
                  <span class="trip-duration">{{ trip.duration }}</span>
                </div>
                <a [routerLink]="['/trips', trip.id]" class="trip-name">{{ trip.name }}</a>
                <p class="trip-tagline">{{ trip.tagline }}</p>
                <div class="trip-rating">
                  <span class="stars">★★★★★</span>
                  <span class="rating-val">{{ trip.rating }}</span>
                  <span class="rating-count">({{ trip.reviews }} reviews)</span>
                </div>
                <div class="trip-footer">
                  <div class="trip-price">
                    @if (trip.category === 'corporate') {
                      <span class="price-main">Custom pricing</span>
                    } @else {
                      @if (trip.originalPrice) {
                        <span class="price-original">₹{{ trip.originalPrice | number }}</span>
                      }
                      <span class="price-main">₹{{ trip.price | number }}</span>
                      <span class="price-per">/ person</span>
                    }
                  </div>
                  <a [routerLink]="['/trips', trip.id]" class="trip-cta">View Trip →</a>
                </div>
              </div>
            </div>
          }
        </div>

        @if (filteredTrips().length === 0) {
          <div class="empty-state">
            <p>No trips found for this category.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .trips-page { min-height: 100vh; background: #F7F4EF; }
    .trips-header {
      background: #2C4A3E;
      padding: 120px 2rem 60px;
    }
    .trips-header-inner { max-width: 800px; margin: 0 auto; }
    .page-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(247,244,239,0.6);
      margin-bottom: 1rem;
    }
    .trips-h1 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #F7F4EF;
      margin: 0 0 1rem;
    }
    .trips-sub {
      font-size: 1rem;
      color: rgba(247,244,239,0.65);
      margin: 0;
      max-width: 520px;
      line-height: 1.7;
    }
    .filter-bar {
      background: #fff;
      border-bottom: 1px solid rgba(26,26,24,0.08);
      position: sticky;
      top: 64px;
      z-index: 10;
    }
    .filter-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      gap: 4px;
      overflow-x: auto;
    }
    .filter-btn {
      padding: 14px 20px;
      border: none;
      background: none;
      font-size: 0.85rem;
      font-weight: 500;
      color: #7A7167;
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
      font-family: inherit;
    }
    .filter-btn:hover { color: #1A1A18; }
    .filter-btn.active { color: #2C4A3E; border-bottom-color: #2C4A3E; font-weight: 600; }
    .trips-body { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; }
    .trips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }
    .trip-card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(26,26,24,0.06);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .trip-card:hover { box-shadow: 0 12px 40px rgba(26,26,24,0.1); transform: translateY(-2px); }
    .trip-img-wrap {
      position: relative;
      display: block;
      overflow: hidden;
    }
    .trip-img {
      width: 100%; height: 220px; object-fit: cover; display: block;
      transition: transform 0.4s;
    }
    .trip-card:hover .trip-img { transform: scale(1.04); }
    .trip-category-badge {
      position: absolute;
      top: 12px; left: 12px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background: rgba(26,26,24,0.7);
      backdrop-filter: blur(8px);
      border-radius: 100px;
      padding: 4px 12px;
    }
    .trip-urgency {
      position: absolute;
      top: 12px; right: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      color: #fff;
      background: #C8622A;
      border-radius: 100px;
      padding: 4px 10px;
    }
    .trip-body { padding: 1.25rem; }
    .trip-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .trip-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      color: #7A7167;
    }
    .trip-duration { font-size: 0.78rem; color: #7A7167; }
    .trip-name {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1A1A18;
      text-decoration: none;
      margin-bottom: 0.3rem;
      line-height: 1.3;
    }
    .trip-name:hover { color: #2C4A3E; }
    .trip-tagline { font-size: 0.85rem; color: #7A7167; margin: 0 0 0.75rem; line-height: 1.5; }
    .trip-rating {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 1rem;
    }
    .stars { color: #F59E0B; font-size: 0.8rem; letter-spacing: 1px; }
    .rating-val { font-size: 0.82rem; font-weight: 700; color: #1A1A18; }
    .rating-count { font-size: 0.78rem; color: #7A7167; }
    .trip-footer { display: flex; align-items: center; justify-content: space-between; }
    .trip-price { display: flex; align-items: baseline; gap: 5px; }
    .price-original { font-size: 0.8rem; color: #7A7167; text-decoration: line-through; }
    .price-main { font-size: 1.1rem; font-weight: 700; color: #1A1A18; }
    .price-per { font-size: 0.75rem; color: #7A7167; }
    .trip-cta {
      padding: 9px 18px;
      background: #2C4A3E;
      color: #fff;
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .trip-cta:hover { background: #3d6655; }
    .empty-state {
      text-align: center;
      padding: 5rem 0;
      color: #7A7167;
      font-size: 1rem;
    }
    @media (max-width: 768px) {
      .trips-header { padding: 100px 1.5rem 40px; }
      .trips-body { padding: 2rem 1rem 4rem; }
      .trips-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class TripsPageComponent {
  private bookingSvc = inject(BookingService);

  filters: { key: Filter; label: string }[] = [
    { key: 'all',        label: 'All Trips' },
    { key: 'group',      label: 'Group Trips' },
    { key: 'workcation', label: 'Workcations' },
    { key: 'corporate',  label: 'Corporate' },
    { key: 'villa',      label: 'Private Villas' },
  ];

  activeFilter = signal<Filter>('all');
  allTrips = this.bookingSvc.getTrips();

  filteredTrips = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? this.allTrips : this.allTrips.filter(t => t.category === f);
  });

  categoryLabel(cat: Trip['category']): string {
    return { group: 'Group Trip', workcation: 'Workcation', corporate: 'Corporate', villa: 'Private Villa' }[cat];
  }
}
