import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <a routerLink="/" class="auth-logo">
          <span class="logo-rnb">RnB</span>
          <span class="logo-sub">Roam &amp; Beyond</span>
        </a>

        <h1 class="auth-title">Create your account</h1>
        <p class="auth-sub">Join thousands of intentional travellers.</p>

        @if (serverError()) {
          <div class="auth-error-banner">{{ serverError() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="name">Full name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Arjun Sharma"
              autocomplete="name"
              [class.invalid]="showError('name')"
            />
            @if (showError('name')) {
              <span class="field-error">Full name is required.</span>
            }
          </div>

          <div class="field">
            <label for="email">Email address</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              autocomplete="email"
              [class.invalid]="showError('email')"
            />
            @if (showError('email')) {
              <span class="field-error">
                {{ form.get('email')?.hasError('required') ? 'Email is required.' : 'Enter a valid email address.' }}
              </span>
            }
          </div>

          <div class="field">
            <label for="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              formControlName="phone"
              placeholder="+91 98765 43210"
              autocomplete="tel"
              [class.invalid]="showError('phone')"
            />
            @if (showError('phone')) {
              <span class="field-error">
                {{ form.get('phone')?.hasError('required') ? 'Phone number is required.' : 'Enter a valid 10-digit number.' }}
              </span>
            }
          </div>

          <div class="field-row">
            <div class="field">
              <label for="password">Password</label>
              <div class="input-row">
                <input
                  id="password"
                  [type]="showPw() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Min. 8 characters"
                  autocomplete="new-password"
                  [class.invalid]="showError('password')"
                />
                <button type="button" class="pw-toggle" (click)="showPw.set(!showPw())">
                  {{ showPw() ? 'Hide' : 'Show' }}
                </button>
              </div>
              @if (showError('password')) {
                <span class="field-error">
                  {{ form.get('password')?.hasError('required') ? 'Password is required.' : 'Minimum 8 characters.' }}
                </span>
              }
            </div>

            <div class="field">
              <label for="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                [type]="showPw() ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Repeat password"
                autocomplete="new-password"
                [class.invalid]="showConfirmError()"
              />
              @if (showConfirmError()) {
                <span class="field-error">Passwords do not match.</span>
              }
            </div>
          </div>

          <p class="terms-note">
            By creating an account you agree to our
            <a href="#" (click)="$event.preventDefault()">Terms of Service</a> and
            <a href="#" (click)="$event.preventDefault()">Privacy Policy</a>.
          </p>

          <button type="submit" class="auth-btn" [disabled]="loading()">
            @if (loading()) { <span class="spinner"></span> }
            {{ loading() ? 'Creating account…' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <a routerLink="/login">Sign in →</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: #F7F4EF;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 1rem 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 480px;
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 4px 40px rgba(26,26,24,0.08);
    }
    .auth-logo {
      display: flex;
      align-items: baseline;
      gap: 8px;
      text-decoration: none;
      margin-bottom: 2rem;
    }
    .logo-rnb { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; color: #2C4A3E; }
    .logo-sub { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #C8622A; }
    .auth-title { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.03em; color: #1A1A18; margin: 0 0 0.4rem; }
    .auth-sub { font-size: 0.9rem; color: #7A7167; margin: 0 0 1.75rem; }
    .auth-error-banner {
      background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C;
      border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1.25rem;
    }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1.25rem; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field label { font-size: 0.82rem; font-weight: 600; color: #1A1A18; }
    .field input {
      padding: 11px 14px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 10px;
      font-size: 0.9rem; color: #1A1A18; background: #FAFAF9; outline: none;
      transition: border-color 0.15s; font-family: inherit; width: 100%; box-sizing: border-box;
    }
    .field input:focus { border-color: #2C4A3E; background: #fff; }
    .field input.invalid { border-color: #EF4444; }
    .input-row { display: flex; gap: 8px; }
    .input-row input { flex: 1; }
    .pw-toggle {
      padding: 0 12px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 10px;
      background: #FAFAF9; font-size: 0.78rem; font-weight: 600; color: #7A7167;
      cursor: pointer; white-space: nowrap; font-family: inherit;
    }
    .field-error { font-size: 0.78rem; color: #EF4444; }
    .terms-note {
      font-size: 0.78rem; color: #7A7167; margin-bottom: 1rem; line-height: 1.6;
    }
    .terms-note a { color: #2C4A3E; font-weight: 600; text-decoration: none; }
    .terms-note a:hover { text-decoration: underline; }
    .auth-btn {
      width: 100%; padding: 13px; background: #2C4A3E; color: #fff; border: none;
      border-radius: 12px; font-size: 0.95rem; font-weight: 600; cursor: pointer;
      transition: background 0.2s; display: flex; align-items: center; justify-content: center;
      gap: 8px; font-family: inherit;
    }
    .auth-btn:hover:not(:disabled) { background: #3d6655; }
    .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-switch { text-align: center; font-size: 0.875rem; color: #7A7167; margin-top: 1.5rem; }
    .auth-switch a { color: #C8622A; font-weight: 600; text-decoration: none; }
    .auth-switch a:hover { text-decoration: underline; }
    @media (max-width: 480px) {
      .field-row { grid-template-columns: 1fr; }
      .auth-card { padding: 2rem 1.5rem; }
    }
  `],
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name:            ['', Validators.required],
    email:           ['', [Validators.required, Validators.email]],
    phone:           ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatch });

  loading     = signal(false);
  showPw      = signal(false);
  serverError = signal('');
  submitted   = false;

  showError(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched || this.submitted);
  }

  showConfirmError(): boolean {
    const c = this.form.get('confirmPassword');
    const mismatch = this.form.hasError('passwordMismatch');
    return !!c && (c.dirty || c.touched || this.submitted) &&
      (c.hasError('required') || mismatch);
  }

  submit() {
    this.submitted = true;
    this.serverError.set('');
    if (this.form.invalid) return;

    this.loading.set(true);
    const { name, email, phone, password } = this.form.getRawValue();
    const result = this.auth.register(name, email, phone, password);
    this.loading.set(false);

    if (!result.success) {
      this.serverError.set(result.error ?? 'Registration failed.');
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
