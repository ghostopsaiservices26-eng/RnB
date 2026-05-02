import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  constructor() {
    // Load existing session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      this._user.set(session ? this.mapUser(session.user) : null);
    });

    // Keep signal in sync with Supabase auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this._user.set(session ? this.mapUser(session.user) : null);
    });
  }

  private mapUser(u: SupabaseUser): User {
    return {
      id: u.id,
      name: u.user_metadata?.['name'] ?? u.email ?? '',
      email: u.email ?? '',
      phone: u.user_metadata?.['phone'] ?? '',
    };
  }

  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this._user.set(null);
    this.router.navigate(['/']);
  }
}
