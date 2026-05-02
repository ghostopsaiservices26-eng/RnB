import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BookingService, Booking } from '../../services/booking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="dash-page">
      <div class="dash-inner">
        <!-- Header -->
        <div class="dash-header">
          <div class="dash-welcome">
            <div class="avatar">{{ initials() }}</div>
            <div>
              <h1 class="dash-h1">Welcome back, {{ firstName() }}!</h1>
              <p class="dash-email">{{ auth.user()?.email }}</p>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-num">{{ bookings().length }}</span>
            <span class="stat-label">Total Bookings</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">{{ upcomingCount() }}</span>
            <span class="stat-label">Upcoming Trips</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">₹{{ totalSpent() | number }}</span>
            <span class="stat-label">Total Spent</span>
          </div>
        </div>

        <!-- Bookings list -->
        <div class="bookings-section">
          <div class="bookings-header-row">
            <h2 class="bookings-h2">My Bookings</h2>
            <a routerLink="/trips" class="browse-btn">Browse More Trips →</a>
          </div>

          @if (bookings().length === 0) {
            <div class="empty-bookings">
              <div class="empty-icon">🗺️</div>
              <h3>No bookings yet</h3>
              <p>Your next adventure is waiting. Browse our curated trips and book your spot.</p>
              <a routerLink="/trips" class="cta-btn">Explore Trips</a>
            </div>
          }

          @for (b of bookings(); track b.id) {
            <div class="booking-card" [class.cancelled]="b.status === 'cancelled'">
              <img [src]="b.tripImage" [alt]="b.tripName" class="booking-img" />
              <div class="booking-body">
                <div class="booking-top">
                  <div>
                    <h3 class="booking-name">{{ b.tripName }}</h3>
                    <p class="booking-loc">📍 {{ b.tripLocation }}</p>
                  </div>
                  <span class="status-badge" [class]="'status-' + b.status">
                    {{ statusLabel(b.status) }}
                  </span>
                </div>

                <div class="booking-meta">
                  <div class="meta-item">
                    <span class="meta-key">Travel date</span>
                    <span class="meta-val">{{ b.selectedDate }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-key">Seats</span>
                    <span class="meta-val">{{ b.seats }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-key">Total paid</span>
                    <span class="meta-val">₹{{ b.totalPrice | number }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-key">Booking ID</span>
                    <span class="meta-val mono">{{ b.id.slice(0, 8).toUpperCase() }}</span>
                  </div>
                </div>

                @if (b.status === 'confirmed') {
                  <div class="booking-actions">
                    <button class="cancel-btn" (click)="requestCancel(b)">
                      Cancel Booking
                    </button>
                    <a [routerLink]="['/trips', b.tripId]" class="view-trip-btn">View Trip →</a>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Cancel confirmation modal -->
        @if (cancelTarget()) {
          <div class="modal-overlay" (click)="cancelTarget.set(null)">
            <div class="modal" (click)="$event.stopPropagation()">
              <h3 class="modal-title">Cancel this booking?</h3>
              <p class="modal-body">
                Are you sure you want to cancel your booking for
                <strong>{{ cancelTarget()!.tripName }}</strong>?
                This action cannot be undone.
              </p>
              <div class="modal-actions">
                <button class="modal-ghost" (click)="cancelTarget.set(null)">Keep Booking</button>
                <button class="modal-danger" (click)="confirmCancel()">Yes, Cancel</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dash-page { min-height: 100vh; background: #F7F4EF; padding: 80px 0 5rem; }
    .dash-inner { max-width: 900px; margin: 0 auto; padding: 3rem 2rem 0; }

    /* Header */
    .dash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .dash-welcome { display: flex; align-items: center; gap: 1rem; }
    .avatar {
      width: 54px; height: 54px;
      border-radius: 50%;
      background: #2C4A3E;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .dash-h1 { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.03em; color: #1A1A18; margin: 0 0 2px; }
    .dash-email { font-size: 0.82rem; color: #7A7167; margin: 0; }
    .logout-btn {
      padding: 9px 20px;
      border: 1.5px solid rgba(26,26,24,0.15);
      background: #fff;
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #7A7167;
      cursor: pointer;
      font-family: inherit;
      transition: border-color 0.15s, color 0.15s;
    }
    .logout-btn:hover { border-color: #EF4444; color: #EF4444; }

    /* Stats */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      border: 1px solid rgba(26,26,24,0.06);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-num { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.04em; color: #2C4A3E; }
    .stat-label { font-size: 0.78rem; color: #7A7167; }

    /* Bookings */
    .bookings-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .bookings-h2 { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; color: #1A1A18; margin: 0; }
    .browse-btn { font-size: 0.85rem; font-weight: 600; color: #2C4A3E; text-decoration: none; }
    .browse-btn:hover { text-decoration: underline; }

    .empty-bookings {
      text-align: center;
      padding: 4rem 2rem;
      background: #fff;
      border-radius: 20px;
      border: 1px dashed rgba(26,26,24,0.15);
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-bookings h3 { font-size: 1.1rem; font-weight: 700; color: #1A1A18; margin: 0 0 0.5rem; }
    .empty-bookings p { font-size: 0.9rem; color: #7A7167; margin: 0 0 1.5rem; line-height: 1.6; }
    .cta-btn {
      display: inline-block;
      padding: 11px 24px;
      background: #2C4A3E;
      color: #fff;
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }
    .cta-btn:hover { background: #3d6655; }

    .booking-card {
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(26,26,24,0.07);
      display: flex;
      gap: 0;
      overflow: hidden;
      margin-bottom: 16px;
      transition: box-shadow 0.2s;
    }
    .booking-card:hover { box-shadow: 0 6px 24px rgba(26,26,24,0.08); }
    .booking-card.cancelled { opacity: 0.6; }
    .booking-img { width: 130px; height: auto; object-fit: cover; flex-shrink: 0; }
    .booking-body { padding: 1.25rem; flex: 1; min-width: 0; }
    .booking-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .booking-name { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0 0 3px; letter-spacing: -0.01em; }
    .booking-loc { font-size: 0.78rem; color: #7A7167; margin: 0; }
    .status-badge {
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .status-confirmed { background: rgba(44,74,62,0.1); color: #2C4A3E; }
    .status-pending { background: rgba(200,98,42,0.1); color: #C8622A; }
    .status-cancelled { background: rgba(239,68,68,0.1); color: #EF4444; }

    .booking-meta {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .meta-item { display: flex; flex-direction: column; gap: 2px; }
    .meta-key { font-size: 0.7rem; color: #7A7167; text-transform: uppercase; letter-spacing: 0.06em; }
    .meta-val { font-size: 0.85rem; font-weight: 600; color: #1A1A18; }
    .mono { font-family: monospace; }

    .booking-actions { display: flex; align-items: center; gap: 12px; }
    .cancel-btn {
      padding: 7px 16px;
      background: none;
      border: 1.5px solid rgba(239,68,68,0.3);
      color: #EF4444;
      border-radius: 100px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s;
    }
    .cancel-btn:hover { background: rgba(239,68,68,0.05); border-color: #EF4444; }
    .view-trip-btn { font-size: 0.82rem; font-weight: 600; color: #2C4A3E; text-decoration: none; }
    .view-trip-btn:hover { text-decoration: underline; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
    }
    .modal {
      background: #fff;
      border-radius: 20px;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; color: #1A1A18; margin: 0 0 0.75rem; }
    .modal-body { font-size: 0.9rem; color: #7A7167; line-height: 1.6; margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .modal-ghost {
      padding: 10px 20px;
      background: none;
      border: 1.5px solid rgba(26,26,24,0.15);
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      color: #1A1A18;
    }
    .modal-danger {
      padding: 10px 20px;
      background: #EF4444;
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s;
    }
    .modal-danger:hover { background: #DC2626; }

    @media (max-width: 640px) {
      .stats-row { grid-template-columns: 1fr 1fr; }
      .booking-card { flex-direction: column; }
      .booking-img { width: 100%; height: 160px; }
      .booking-meta { grid-template-columns: 1fr 1fr; }
      .dash-inner { padding: 2rem 1rem 0; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  cancelTarget = signal<Booking | null>(null);

  constructor(
    public auth: AuthService,
    private bookingSvc: BookingService,
  ) {}

  async ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.bookings.set(await this.bookingSvc.getUserBookings(user.id));
    }
  }

  firstName(): string {
    return this.auth.user()?.name.split(' ')[0] ?? '';
  }

  initials(): string {
    const name = this.auth.user()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  upcomingCount(): number {
    return this.bookings().filter(b => b.status === 'confirmed').length;
  }

  totalSpent(): number {
    return this.bookings()
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  }

  statusLabel(status: Booking['status']): string {
    return { confirmed: '✓ Confirmed', pending: '⏳ Pending', cancelled: '✕ Cancelled' }[status];
  }

  requestCancel(booking: Booking) {
    this.cancelTarget.set(booking);
  }

  async confirmCancel() {
    const b = this.cancelTarget();
    const user = this.auth.user();
    if (!b || !user) return;

    await this.bookingSvc.cancelBooking(b.id);
    this.bookings.set(await this.bookingSvc.getUserBookings(user.id));
    this.cancelTarget.set(null);
  }
}
