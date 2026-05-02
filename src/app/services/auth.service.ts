import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.loadUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  constructor(private router: Router) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('rnb_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  private getAllUsers(): Record<string, { user: User; password: string }> {
    try {
      const raw = localStorage.getItem('rnb_users');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const key = email.toLowerCase().trim();
    if (users[key]) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const user: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: key,
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };
    users[key] = { user, password };
    localStorage.setItem('rnb_users', JSON.stringify(users));
    this.persist(user);
    return { success: true };
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const entry = users[email.toLowerCase().trim()];
    if (!entry) return { success: false, error: 'No account found with this email.' };
    if (entry.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
    this.persist(entry.user);
    return { success: true };
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('rnb_user');
    this.router.navigate(['/']);
  }

  private persist(user: User) {
    this._user.set(user);
    localStorage.setItem('rnb_user', JSON.stringify(user));
  }
}
