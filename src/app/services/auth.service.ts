import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  private _roleReady = false;
  private _rolePromise: Promise<void>;
  private _roleResolve!: () => void;

  constructor() {
    this._rolePromise = new Promise(res => { this._roleResolve = res; });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const u = await this.mapUser(session.user);
        this._user.set(u);
      }
      this._roleReady = true;
      this._roleResolve();
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const u = await this.mapUser(session.user);
        this._user.set(u);
      } else {
        this._user.set(null);
      }
    });
  }

  roleLoaded(): Promise<void> {
    return this._roleReady ? Promise.resolve() : this._rolePromise;
  }

  private async mapUser(u: SupabaseUser): Promise<User> {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', u.id)
      .single();
    return {
      id: u.id,
      name: u.user_metadata?.['name'] ?? u.email ?? '',
      email: u.email ?? '',
      phone: u.user_metadata?.['phone'] ?? '',
      role: (data?.['role'] as UserRole) ?? 'user',
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
