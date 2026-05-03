import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { BookingService, Trip } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  template: `
    @if (trip()) {
      <div class="booking-page">
        <!-- Progress bar -->
        <div class="progress-bar-wrap">
          <div class="progress-inner">
            @for (s of steps; track s.num) {
              <div class="step" [class.active]="step() === s.num" [class.done]="step() > s.num">
                <div class="step-dot">
                  @if (step() > s.num) { <span>✓</span> }
                  @else { <span>{{ s.num }}</span> }
                </div>
                <span class="step-label">{{ s.label }}</span>
              </div>
              @if (s.num < steps.length) {
                <div class="step-line" [class.done]="step() > s.num"></div>
              }
            }
          </div>
        </div>

        <div class="booking-body">
          <div class="booking-layout">
            <!-- Form area -->
            <div class="booking-form-area">

              <!-- Step 1: Select Date & Seats -->
              @if (step() === 1) {
                <div class="form-step">
                  <h2 class="step-title">Choose your date & seats</h2>
                  <p class="step-sub">Select when you'd like to travel and how many spots you need.</p>
                  <form [formGroup]="step1Form" (ngSubmit)="nextStep()">
                    <div class="field">
                      <label>Select a date</label>
                      @for (d of trip()!.dates; track d) {
                        <label class="radio-card" [class.selected]="step1Form.get('date')?.value === d">
                          <input type="radio" formControlName="date" [value]="d" />
                          <span class="radio-label">{{ d }}</span>
                        </label>
                      }
                      @if (showStep1Error('date')) {
                        <span class="field-error">Please select a date.</span>
                      }
                    </div>

                    <div class="field">
                      <label for="seats">Number of seats</label>
                      <select id="seats" formControlName="seats" [class.invalid]="showStep1Error('seats')">
                        @for (n of seatOptions(); track n) {
                          <option [value]="n">{{ n }} {{ n === 1 ? 'seat' : 'seats' }}</option>
                        }
                      </select>
                      @if (showStep1Error('seats')) {
                        <span class="field-error">Please select number of seats.</span>
                      }
                    </div>

                    <button type="submit" class="btn-primary">Continue →</button>
                  </form>
                </div>
              }

              <!-- Step 2: Contact Details -->
              @if (step() === 2) {
                <div class="form-step">
                  <h2 class="step-title">Your contact details</h2>
                  <p class="step-sub">We'll send your confirmation to this information.</p>
                  <form [formGroup]="step2Form" (ngSubmit)="nextStep()">
                    <div class="field">
                      <label for="contactName">Full name</label>
                      <input id="contactName" type="text" formControlName="contactName"
                        placeholder="Arjun Sharma" [class.invalid]="showStep2Error('contactName')" />
                      @if (showStep2Error('contactName')) {
                        <span class="field-error">Full name is required.</span>
                      }
                    </div>
                    <div class="field">
                      <label for="contactPhone">Phone number</label>
                      <input id="contactPhone" type="tel" formControlName="contactPhone"
                        placeholder="+91 98765 43210" [class.invalid]="showStep2Error('contactPhone')" />
                      @if (showStep2Error('contactPhone')) {
                        <span class="field-error">
                          {{ step2Form.get('contactPhone')?.hasError('required') ? 'Phone is required.' : 'Enter a valid 10-digit number.' }}
                        </span>
                      }
                    </div>
                    <div class="field">
                      <label for="specialRequests">Special requests <span class="optional">(optional)</span></label>
                      <textarea id="specialRequests" formControlName="specialRequests"
                        rows="3" placeholder="Dietary preferences, accessibility needs, anything else…"></textarea>
                    </div>
                    <div class="btn-row">
                      <button type="button" class="btn-ghost" (click)="step.set(1)">← Back</button>
                      <button type="submit" class="btn-primary">Continue →</button>
                    </div>
                  </form>
                </div>
              }

              <!-- Step 3: Review & Confirm -->
              @if (step() === 3) {
                <div class="form-step">
                  <h2 class="step-title">Review your booking</h2>
                  <p class="step-sub">Everything look right? Confirm to secure your spot.</p>

                  <div class="review-card">
                    <div class="review-trip">
                      <img [src]="trip()!.images[0]" [alt]="trip()!.name" class="review-img" />
                      <div>
                        <h3 class="review-trip-name">{{ trip()!.name }}</h3>
                        <p class="review-trip-loc">📍 {{ trip()!.location }} · {{ trip()!.duration }}</p>
                      </div>
                    </div>

                    <div class="review-details">
                      <div class="review-row">
                        <span class="review-key">Travel date</span>
                        <span class="review-val">{{ step1Form.get('date')?.value }}</span>
                      </div>
                      <div class="review-row">
                        <span class="review-key">Seats</span>
                        <span class="review-val">{{ step1Form.get('seats')?.value }}</span>
                      </div>
                      <div class="review-row">
                        <span class="review-key">Contact name</span>
                        <span class="review-val">{{ step2Form.get('contactName')?.value }}</span>
                      </div>
                      <div class="review-row">
                        <span class="review-key">Phone</span>
                        <span class="review-val">{{ step2Form.get('contactPhone')?.value }}</span>
                      </div>
                      @if (step2Form.get('specialRequests')?.value) {
                        <div class="review-row">
                          <span class="review-key">Special requests</span>
                          <span class="review-val">{{ step2Form.get('specialRequests')?.value }}</span>
                        </div>
                      }
                    </div>

                    <div class="review-total">
                      <span>Total</span>
                      <span class="total-amount">₹{{ totalPrice() | number }}</span>
                    </div>
                  </div>

                  <div class="guarantee-box">
                    🔒 Your booking is secured and confirmed instantly. Free cancellation applies within 48 hours.
                  </div>

                  <div class="btn-row">
                    <button type="button" class="btn-ghost" (click)="step.set(2)">← Back</button>
                    <button type="button" class="btn-primary btn-confirm" (click)="confirmBooking()" [disabled]="loading()">
                      @if (loading()) { <span class="spinner"></span> }
                      {{ loading() ? 'Confirming…' : 'Confirm & Book' }}
                    </button>
                  </div>
                </div>
              }

              <!-- Step 4: Success -->
              @if (step() === 4) {
                <div class="form-step success-step">
                  <div class="success-icon">🎉</div>
                  <h2 class="step-title">Booking confirmed!</h2>
                  <p class="step-sub">
                    Your spot on <strong>{{ trip()!.name }}</strong> is secured.
                    Our team will reach out within 24 hours with next steps and pre-trip details.
                  </p>
                  <div class="booking-id-box">
                    Booking ID: <strong>{{ bookingId() }}</strong>
                  </div>
                  <div class="success-actions">
                    <a routerLink="/dashboard" class="btn-primary">View My Bookings</a>
                    <a routerLink="/trips" class="btn-ghost">Explore More Trips</a>
                  </div>
                </div>
              }
            </div>

            <!-- Summary sidebar -->
            <aside class="booking-summary">
              <div class="summary-card">
                <img [src]="trip()!.images[0]" [alt]="trip()!.name" class="summary-img" />
                <div class="summary-body">
                  <span class="summary-category">{{ categoryLabel(trip()!.category) }}</span>
                  <h3 class="summary-name">{{ trip()!.name }}</h3>
                  <p class="summary-loc">📍 {{ trip()!.location }}</p>
                  <p class="summary-dur">🕐 {{ trip()!.duration }}</p>
                  <div class="summary-divider"></div>
                  @if (step1Form.get('date')?.value) {
                    <div class="summary-row">
                      <span>Date</span>
                      <span>{{ step1Form.get('date')?.value }}</span>
                    </div>
                  }
                  @if (step1Form.get('seats')?.value) {
                    <div class="summary-row">
                      <span>Seats</span>
                      <span>{{ step1Form.get('seats')?.value }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row summary-total">
                      <span>Total</span>
                      <span>₹{{ totalPrice() | number }}</span>
                    </div>
                  }
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <h2>Trip not found</h2>
        <a routerLink="/trips">← Back to trips</a>
      </div>
    }
  `,
  styles: [`
    .booking-page { min-height: 100vh; background: #F7F4EF; padding-top: 64px; }
    .progress-bar-wrap {
      background: #fff;
      border-bottom: 1px solid rgba(26,26,24,0.08);
      padding: 1.25rem 2rem;
    }
    .progress-inner {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
    }
    .step { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .step-dot {
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(26,26,24,0.08);
      color: #7A7167;
      transition: background 0.2s, color 0.2s;
    }
    .step.active .step-dot { background: #2C4A3E; color: #fff; }
    .step.done .step-dot { background: #2C4A3E; color: #fff; }
    .step-label { font-size: 0.78rem; font-weight: 500; color: #7A7167; }
    .step.active .step-label { color: #1A1A18; font-weight: 600; }
    .step-line { flex: 1; height: 2px; background: rgba(26,26,24,0.1); margin: 0 8px; }
    .step-line.done { background: #2C4A3E; }

    .booking-body { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 5rem; }
    .booking-layout { display: grid; grid-template-columns: 1fr 300px; gap: 3rem; align-items: start; }
    .booking-form-area { min-width: 0; }
    .form-step {  }
    .step-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #1A1A18;
      margin: 0 0 0.4rem;
    }
    .step-sub { font-size: 0.9rem; color: #7A7167; margin: 0 0 2rem; }

    .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
    .field > label { font-size: 0.82rem; font-weight: 600; color: #1A1A18; }
    .field input, .field select, .field textarea {
      padding: 11px 14px;
      border: 1.5px solid rgba(26,26,24,0.15);
      border-radius: 10px;
      font-size: 0.9rem;
      color: #1A1A18;
      background: #fff;
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #2C4A3E; }
    .field input.invalid, .field select.invalid { border-color: #EF4444; }
    .field textarea { resize: vertical; }
    .field-error { font-size: 0.78rem; color: #EF4444; }
    .optional { color: #7A7167; font-weight: 400; }

    .radio-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1.5px solid rgba(26,26,24,0.12);
      border-radius: 10px;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      margin-bottom: 6px;
      background: #fff;
    }
    .radio-card:hover { border-color: #2C4A3E; background: #F7F4EF; }
    .radio-card.selected { border-color: #2C4A3E; background: rgba(44,74,62,0.05); }
    .radio-card input { accent-color: #2C4A3E; }
    .radio-label { font-size: 0.9rem; color: #1A1A18; font-weight: 500; }

    .btn-primary {
      padding: 13px 28px;
      background: #2C4A3E;
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: inherit;
      text-decoration: none;
    }
    .btn-primary:hover:not(:disabled) { background: #3d6655; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-confirm { width: 100%; justify-content: center; padding: 14px; }
    .btn-ghost {
      padding: 13px 24px;
      background: none;
      color: #1A1A18;
      border: 1.5px solid rgba(26,26,24,0.15);
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }
    .btn-ghost:hover { background: rgba(26,26,24,0.04); }
    .btn-row { display: flex; gap: 12px; align-items: center; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Review */
    .review-card {
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(26,26,24,0.08);
      overflow: hidden;
      margin-bottom: 1.25rem;
    }
    .review-trip {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      border-bottom: 1px solid rgba(26,26,24,0.08);
    }
    .review-img { width: 72px; height: 60px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
    .review-trip-name { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0 0 4px; }
    .review-trip-loc { font-size: 0.8rem; color: #7A7167; margin: 0; }
    .review-details { padding: 1rem 1.25rem; }
    .review-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(26,26,24,0.06);
    }
    .review-row:last-child { border-bottom: none; }
    .review-key { font-size: 0.82rem; color: #7A7167; }
    .review-val { font-size: 0.82rem; color: #1A1A18; font-weight: 500; text-align: right; max-width: 60%; }
    .review-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #F7F4EF;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1A1A18;
    }
    .total-amount { font-size: 1.3rem; font-weight: 800; color: #2C4A3E; }
    .guarantee-box {
      padding: 1rem;
      background: rgba(44,74,62,0.06);
      border-radius: 12px;
      font-size: 0.82rem;
      color: #2C4A3E;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    /* Success */
    .success-step { text-align: center; }
    .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .booking-id-box {
      display: inline-block;
      padding: 10px 20px;
      background: #fff;
      border: 1px solid rgba(26,26,24,0.1);
      border-radius: 10px;
      font-size: 0.85rem;
      color: #7A7167;
      margin: 1.5rem 0;
      font-family: monospace;
    }
    .success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    /* Summary sidebar */
    .booking-summary { position: sticky; top: 80px; }
    .summary-card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(26,26,24,0.08);
      box-shadow: 0 4px 20px rgba(26,26,24,0.06);
    }
    .summary-img { width: 100%; height: 160px; object-fit: cover; display: block; }
    .summary-body { padding: 1.25rem; }
    .summary-category {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #C8622A;
    }
    .summary-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1A1A18;
      margin: 0.25rem 0 0.4rem;
      letter-spacing: -0.02em;
    }
    .summary-loc, .summary-dur { font-size: 0.8rem; color: #7A7167; margin: 0 0 3px; }
    .summary-divider { height: 1px; background: rgba(26,26,24,0.08); margin: 0.75rem 0; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #7A7167;
      margin-bottom: 4px;
    }
    .summary-total { font-size: 0.95rem; font-weight: 700; color: #1A1A18; margin-top: 4px; }
    .not-found {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #1A1A18;
    }
    .not-found a { color: #2C4A3E; font-weight: 600; text-decoration: none; }
    @media (max-width: 768px) {
      .booking-layout { grid-template-columns: 1fr; }
      .booking-summary { position: static; order: -1; }
      .booking-body { padding: 1.5rem 1rem 4rem; }
    }
  `],
})
export class BookingComponent implements OnInit {
  private fb         = inject(FormBuilder);
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private bookingSvc = inject(BookingService);
  private auth       = inject(AuthService);

  trip = signal<Trip | undefined>(undefined);
  step = signal(1);
  loading = signal(false);
  bookingId = signal('');
  submitted1 = false;
  submitted2 = false;

  steps = [
    { num: 1, label: 'Date & Seats' },
    { num: 2, label: 'Your Details' },
    { num: 3, label: 'Review' },
    { num: 4, label: 'Confirmed' },
  ];

  step1Form = this.fb.nonNullable.group({
    date:  ['', Validators.required],
    seats: [1, [Validators.required, Validators.min(1)]],
  });

  step2Form = this.fb.nonNullable.group({
    contactName:     ['', Validators.required],
    contactPhone:    ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    specialRequests: [''],
  });

  seatOptions = computed(() => {
    const t = this.trip();
    if (!t) return [1];
    return Array.from({ length: Math.min(t.seatsLeft, 10) }, (_, i) => i + 1);
  });

  totalPrice = computed(() => {
    const t = this.trip();
    const seats = this.step1Form.get('seats')?.value ?? 1;
    return t ? t.price * seats : 0;
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const trip = await this.bookingSvc.getTripById(id);
    if (!trip) { this.router.navigate(['/trips']); return; }
    this.trip.set(trip);

    // Pre-fill contact details from logged-in user
    const user = this.auth.user();
    if (user) {
      this.step2Form.patchValue({ contactName: user.name, contactPhone: user.phone });
    }
  }

  showStep1Error(field: string): boolean {
    const c = this.step1Form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched || this.submitted1);
  }

  showStep2Error(field: string): boolean {
    const c = this.step2Form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched || this.submitted2);
  }

  nextStep() {
    if (this.step() === 1) {
      this.submitted1 = true;
      if (this.step1Form.invalid) return;
      this.step.set(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (this.step() === 2) {
      this.submitted2 = true;
      if (this.step2Form.invalid) return;
      this.step.set(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async confirmBooking() {
    const user = this.auth.user();
    const t = this.trip();
    if (!user || !t) return;

    this.loading.set(true);
    try {
      const { date, seats } = this.step1Form.getRawValue();
      const { contactName, contactPhone, specialRequests } = this.step2Form.getRawValue();

      const booking = await this.bookingSvc.createBooking({
        tripId: t.id,
        tripName: t.name,
        tripImage: t.images[0],
        tripLocation: t.location,
        userId: user.id,
        selectedDate: date,
        seats,
        totalPrice: this.totalPrice(),
        contactName,
        contactPhone,
        specialRequests,
      });

      this.bookingId.set(booking.id.slice(0, 8).toUpperCase());
      this.step.set(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      this.loading.set(false);
    }
  }

  categoryLabel(cat: Trip['category']): string {
    return { group: 'Group Trip', workcation: 'Workcation', corporate: 'Corporate', villa: 'Private Villa' }[cat];
  }
}
