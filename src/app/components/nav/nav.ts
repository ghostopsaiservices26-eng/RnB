import { Component, HostListener, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="rnb-nav" [class.scrolled]="scrolled()">
      <div class="nav-inner">
        <a routerLink="/" class="nav-logo">
          <span class="logo-rnb">RnB</span>
          <span class="logo-sub">Roam &amp; Beyond</span>
        </a>
        <ul class="nav-links">
          <li><a routerLink="/trips">Trips</a></li>
          <li><a routerLink="/" fragment="team">About</a></li>
          <li><a routerLink="/" fragment="contact">Contact</a></li>
        </ul>
        <div class="nav-actions">
          @if (auth.isLoggedIn()) {
            <a routerLink="/trips" class="nav-browse">Browse Trips</a>
            @if (auth.user()?.role === 'admin') {
              <a routerLink="/admin" class="nav-admin">Admin</a>
            }
            @if (auth.user()?.role === 'superadmin') {
              <a routerLink="/superadmin" class="nav-superadmin">Super Admin</a>
            }
            <a routerLink="/dashboard" class="nav-user-btn">
              <span class="nav-avatar">{{ initials() }}</span>
              <span class="nav-username">{{ firstName() }}</span>
            </a>
            <button class="nav-logout" (click)="auth.logout()">Sign Out</button>
          } @else {
            <a routerLink="/trips" class="nav-browse">Browse Trips</a>
            <a routerLink="/login" class="nav-signin">Sign In</a>
            <a routerLink="/register" class="nav-cta">Get Started</a>
          }
        </div>
        <button class="nav-burger" (click)="menuOpen.set(!menuOpen())">
          <span></span><span></span><span></span>
        </button>
      </div>
      @if (menuOpen()) {
        <div class="nav-mobile">
          <a routerLink="/trips" (click)="menuOpen.set(false)">Trips</a>
          <a routerLink="/" fragment="team" (click)="menuOpen.set(false)">About</a>
          <a routerLink="/" fragment="contact" (click)="menuOpen.set(false)">Contact</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/dashboard" (click)="menuOpen.set(false)">My Bookings</a>
            @if (auth.user()?.role === 'admin') {
              <a routerLink="/admin" (click)="menuOpen.set(false)">Admin</a>
            }
            @if (auth.user()?.role === 'superadmin') {
              <a routerLink="/superadmin" (click)="menuOpen.set(false)">Super Admin</a>
            }
            <button class="mobile-logout" (click)="auth.logout(); menuOpen.set(false)">Sign Out</button>
          } @else {
            <a routerLink="/login" (click)="menuOpen.set(false)">Sign In</a>
            <a routerLink="/register" (click)="menuOpen.set(false)" class="mobile-cta">Get Started</a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .rnb-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 0 2rem;
      transition: background 0.3s, box-shadow 0.3s;
    }
    .rnb-nav.scrolled {
      background: rgba(247,244,239,0.94);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 rgba(26,26,24,0.08);
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
      height: 64px;
    }
    .nav-logo {
      text-decoration: none;
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-shrink: 0;
    }
    .logo-rnb {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #2C4A3E;
    }
    .logo-sub {
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #C8622A;
    }
    .nav-links {
      display: flex;
      gap: 0.25rem;
      list-style: none;
      margin: 0 auto;
      padding: 0;
    }
    .nav-links a {
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 500;
      color: #1A1A18;
      text-decoration: none;
      border-radius: 100px;
      transition: background 0.15s;
    }
    .nav-links a:hover { background: rgba(26,26,24,0.06); }
    .nav-links a.active-link { color: #2C4A3E; font-weight: 600; }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .nav-browse {
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #2C4A3E;
      text-decoration: none;
      border-radius: 100px;
      transition: background 0.15s;
    }
    .nav-browse:hover { background: rgba(44,74,62,0.08); }
    .nav-admin {
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #2C4A3E;
      background: rgba(44,74,62,0.08);
      text-decoration: none;
      border-radius: 100px;
      transition: background 0.15s;
    }
    .nav-admin:hover { background: rgba(44,74,62,0.16); }
    .nav-superadmin {
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #C8622A;
      background: rgba(200,98,42,0.08);
      text-decoration: none;
      border-radius: 100px;
      transition: background 0.15s;
    }
    .nav-superadmin:hover { background: rgba(200,98,42,0.16); }
    .nav-signin {
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #1A1A18;
      text-decoration: none;
      border-radius: 100px;
      transition: background 0.15s;
    }
    .nav-signin:hover { background: rgba(26,26,24,0.06); }
    .nav-cta {
      padding: 8px 22px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #fff;
      background: #C8622A;
      border-radius: 100px;
      text-decoration: none;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .nav-cta:hover { background: #E8845A; }
    .nav-user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px 5px 5px;
      background: rgba(44,74,62,0.08);
      border-radius: 100px;
      text-decoration: none;
      transition: background 0.15s;
    }
    .nav-user-btn:hover { background: rgba(44,74,62,0.14); }
    .nav-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: #2C4A3E;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
    }
    .nav-username { font-size: 0.82rem; font-weight: 600; color: #2C4A3E; }
    .nav-logout {
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #7A7167;
      background: none;
      border: 1.5px solid rgba(26,26,24,0.12);
      border-radius: 100px;
      cursor: pointer;
      font-family: inherit;
      transition: border-color 0.15s, color 0.15s;
    }
    .nav-logout:hover { border-color: #EF4444; color: #EF4444; }

    .nav-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;
    }
    .nav-burger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #1A1A18;
      border-radius: 2px;
    }
    .nav-mobile {
      display: flex;
      flex-direction: column;
      background: rgba(247,244,239,0.97);
      backdrop-filter: blur(12px);
      padding: 1rem 2rem 1.5rem;
      border-top: 1px solid rgba(26,26,24,0.08);
    }
    .nav-mobile a {
      padding: 12px 0;
      font-size: 1rem;
      font-weight: 500;
      color: #1A1A18;
      text-decoration: none;
      border-bottom: 1px solid rgba(26,26,24,0.06);
    }
    .mobile-logout {
      padding: 12px 0;
      font-size: 1rem;
      font-weight: 500;
      color: #EF4444;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(26,26,24,0.06);
      text-align: left;
      cursor: pointer;
      font-family: inherit;
    }
    .mobile-cta { color: #C8622A !important; font-weight: 600 !important; }
    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .nav-burger { display: flex; }
    }
  `],
})
export class NavComponent {
  auth = inject(AuthService);
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 20); }

  firstName(): string {
    return this.auth.user()?.name.split(' ')[0] ?? '';
  }

  initials(): string {
    const name = this.auth.user()?.name ?? '';
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }
}
