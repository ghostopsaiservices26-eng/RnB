import { Component, OnInit, signal, inject } from '@angular/core';
import {} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { AuthService, UserRole } from '../../services/auth.service';
import { BookingService, Trip } from '../../services/booking.service';
import { supabase } from '../../supabase.client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [FormsModule, DecimalPipe, SlicePipe],
  template: `
    <div class="admin-page">
      <div class="admin-inner">
        <div class="admin-header">
          <div>
            <h1 class="admin-h1">Super Admin Dashboard</h1>
            <p class="admin-sub">{{ auth.user()?.email }}</p>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
        </div>

        <div class="tabs">
          <button [class.active]="tab() === 'trips'" (click)="tab.set('trips')">Trips</button>
          <button [class.active]="tab() === 'users'" (click)="tab.set('users')">Users</button>
        </div>

        <!-- TRIPS TAB -->
        @if (tab() === 'trips') {
          <div class="section">
            <div class="section-header">
              <h2>Trips</h2>
              <button class="add-btn" (click)="openTripForm()">+ Add Trip</button>
            </div>

            @if (tripFormOpen()) {
              <div class="form-card">
                <h3>{{ editingTrip() ? 'Edit Trip' : 'New Trip' }}</h3>
                <div class="form-grid">
                  <div class="field">
                    <label>Name</label>
                    <input [(ngModel)]="tripDraft.name" placeholder="Trip name" />
                  </div>
                  <div class="field">
                    <label>Tagline</label>
                    <input [(ngModel)]="tripDraft.tagline" placeholder="Short tagline" />
                  </div>
                  <div class="field">
                    <label>Location</label>
                    <input [(ngModel)]="tripDraft.location" placeholder="City, State" />
                  </div>
                  <div class="field">
                    <label>Duration</label>
                    <input [(ngModel)]="tripDraft.duration" placeholder="e.g. 3 Days / 2 Nights" />
                  </div>
                  <div class="field">
                    <label>Price (₹)</label>
                    <input type="number" [(ngModel)]="tripDraft.price" />
                  </div>
                  <div class="field">
                    <label>Max Seats</label>
                    <input type="number" [(ngModel)]="tripDraft.maxSeats" />
                  </div>
                  <div class="field">
                    <label>Seats Left</label>
                    <input type="number" [(ngModel)]="tripDraft.seatsLeft" />
                  </div>
                  <div class="field">
                    <label>Category</label>
                    <select [(ngModel)]="tripDraft.category">
                      <option value="group">Group Trip</option>
                      <option value="workcation">Workcation</option>
                      <option value="corporate">Corporate</option>
                      <option value="villa">Private Villa</option>
                    </select>
                  </div>
                  <div class="field full">
                    <label>Description</label>
                    <textarea [(ngModel)]="tripDraft.description" rows="3"></textarea>
                  </div>
                  <div class="field full">
                    <label>Image URL</label>
                    <input [(ngModel)]="tripDraft.imageUrl" placeholder="https://..." />
                  </div>
                </div>
                <div class="form-actions">
                  <button class="ghost-btn" (click)="closeTripForm()">Cancel</button>
                  <button class="save-btn" (click)="saveTrip()">Save Trip</button>
                </div>
              </div>
            }

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Location</th><th>Category</th><th>Price</th><th>Seats</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of trips(); track t.id) {
                    <tr>
                      <td>{{ t.name }}</td>
                      <td>{{ t.location }}</td>
                      <td class="tag">{{ t.category }}</td>
                      <td>₹{{ t.price | number }}</td>
                      <td>{{ t.seatsLeft }}/{{ t.maxSeats }}</td>
                      <td class="actions">
                        <button class="edit-btn" (click)="editTrip(t)">Edit</button>
                        <button class="del-btn" (click)="setDelete('trip', t.id, t.name)">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- USERS TAB -->
        @if (tab() === 'users') {
          <div class="section">
            <div class="section-header">
              <h2>Users</h2>
            </div>
            @if (usersLoading()) {
              <p class="loading">Loading users…</p>
            } @else {
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (u of users(); track u.id) {
                      <tr>
                        <td>{{ u.name || '—' }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.phone || '—' }}</td>
                        <td>
                          <select class="role-select role-{{ u.role }}" [ngModel]="u.role" (ngModelChange)="changeRole(u, $event)">
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                        </td>
                        <td>{{ u.created_at | slice:0:10 }}</td>
                        <td class="actions">
                          <button class="del-btn" (click)="setDelete('user', u.id, u.email)">Delete</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }

        @if (deleteTarget()) {
          <div class="modal-overlay" (click)="deleteTarget.set(null)">
            <div class="modal" (click)="$event.stopPropagation()">
              <h3>Delete "{{ deleteTarget()!.name }}"?</h3>
              <p>This action cannot be undone.</p>
              <div class="modal-actions">
                <button class="ghost-btn" (click)="deleteTarget.set(null)">Cancel</button>
                <button class="modal-danger" (click)="executeDelete()">Delete</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page { min-height: 100vh; background: #F7F4EF; padding: 80px 0 5rem; }
    .admin-inner { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 0; }
    .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .admin-h1 { font-size: 1.5rem; font-weight: 700; color: #1A1A18; margin: 0 0 4px; }
    .admin-sub { font-size: 0.82rem; color: #7A7167; margin: 0; }
    .logout-btn { padding: 9px 20px; border: 1.5px solid rgba(26,26,24,0.15); background: #fff; border-radius: 100px; font-size: 0.82rem; font-weight: 600; color: #7A7167; cursor: pointer; font-family: inherit; }
    .logout-btn:hover { border-color: #EF4444; color: #EF4444; }

    .tabs { display: flex; gap: 4px; margin-bottom: 2rem; background: #fff; border-radius: 12px; padding: 4px; border: 1px solid rgba(26,26,24,0.07); width: fit-content; }
    .tabs button { padding: 8px 20px; border: none; background: none; border-radius: 9px; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: #7A7167; font-family: inherit; transition: all 0.15s; }
    .tabs button.active { background: #C8622A; color: #fff; }

    .section { background: #fff; border-radius: 16px; border: 1px solid rgba(26,26,24,0.07); overflow: hidden; }
    .section-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(26,26,24,0.07); }
    .section-header h2 { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0; }
    .add-btn { padding: 8px 18px; background: #C8622A; color: #fff; border: none; border-radius: 100px; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .add-btn:hover { background: #E8845A; }

    .form-card { margin: 1.5rem; padding: 1.5rem; background: #F7F4EF; border-radius: 12px; }
    .form-card h3 { font-size: 0.95rem; font-weight: 700; color: #1A1A18; margin: 0 0 1.25rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field.full { grid-column: 1 / -1; }
    .field label { font-size: 0.75rem; font-weight: 600; color: #7A7167; text-transform: uppercase; letter-spacing: 0.05em; }
    .field input, .field select, .field textarea { padding: 9px 12px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 8px; font-size: 0.88rem; color: #1A1A18; background: #fff; font-family: inherit; outline: none; }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #C8622A; }
    .field textarea { resize: vertical; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.25rem; }
    .ghost-btn { padding: 9px 20px; background: none; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; color: #1A1A18; }
    .save-btn { padding: 9px 22px; background: #C8622A; color: #fff; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .save-btn:hover { background: #E8845A; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 10px 16px; text-align: left; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #7A7167; border-bottom: 1px solid rgba(26,26,24,0.07); white-space: nowrap; }
    td { padding: 12px 16px; font-size: 0.85rem; color: #1A1A18; border-bottom: 1px solid rgba(26,26,24,0.05); }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(26,26,24,0.02); }
    .tag { font-size: 0.75rem; font-weight: 600; color: #2C4A3E; }
    .actions { display: flex; gap: 8px; }
    .edit-btn { padding: 5px 14px; background: rgba(44,74,62,0.08); color: #2C4A3E; border: none; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .edit-btn:hover { background: rgba(44,74,62,0.16); }
    .del-btn { padding: 5px 14px; background: rgba(239,68,68,0.08); color: #EF4444; border: none; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .del-btn:hover { background: rgba(239,68,68,0.16); }
    .role-select { padding: 4px 8px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; color: #1A1A18; background: #fff; }
    .loading { padding: 2rem; text-align: center; color: #7A7167; font-size: 0.9rem; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; padding: 2rem; max-width: 380px; width: 100%; }
    .modal h3 { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0 0 0.5rem; }
    .modal p { font-size: 0.875rem; color: #7A7167; margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .modal-danger { padding: 9px 20px; background: #EF4444; border: none; border-radius: 8px; color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .modal-danger:hover { background: #DC2626; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .admin-inner { padding: 2rem 1rem 0; }
    }
  `],
})
export class SuperadminComponent implements OnInit {
  auth = inject(AuthService);
  private bookingSvc = inject(BookingService);

  tab = signal<'trips' | 'users'>('trips');
  trips = signal<Trip[]>([]);
  users = signal<AdminUser[]>([]);
  usersLoading = signal(false);
  tripFormOpen = signal(false);
  editingTrip = signal<Trip | null>(null);
  deleteTarget = signal<{ type: 'trip' | 'user'; id: string; name: string } | null>(null);

  tripDraft: Partial<Trip> & { imageUrl?: string } = {};

  async ngOnInit() {
    await Promise.all([this.loadTrips(), this.loadUsers()]);
  }

  async loadTrips() {
    const { data } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) this.trips.set(data.map(this.mapTripRow));
    else this.trips.set(await this.bookingSvc.getTrips());
  }

  async loadUsers() {
    this.usersLoading.set(true);

    const [{ data: meta }, { data: profiles }] = await Promise.all([
      supabase.rpc('get_users_metadata'),
      supabase.from('profiles').select('id, role, created_at'),
    ]);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

    const users: AdminUser[] = (meta ?? []).map((m: any) => {
      const p = profileMap.get(m.id);
      return {
        id: m.id,
        email: m.email ?? '',
        name: m.name ?? '',
        phone: m.phone ?? '',
        role: (p?.role ?? 'user') as UserRole,
        created_at: p?.created_at ?? m.created_at ?? '',
      };
    });

    this.users.set(users);
    this.usersLoading.set(false);
  }

  async changeRole(user: AdminUser, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    this.users.update(us => us.map(u => u.id === user.id ? { ...u, role: newRole as UserRole } : u));
  }

  openTripForm() {
    this.editingTrip.set(null);
    this.tripDraft = { category: 'group', maxSeats: 12, seatsLeft: 12, price: 0 };
    this.tripFormOpen.set(true);
  }

  editTrip(t: Trip) {
    this.editingTrip.set(t);
    this.tripDraft = { ...t, imageUrl: t.images[0] };
    this.tripFormOpen.set(true);
  }

  closeTripForm() { this.tripFormOpen.set(false); this.editingTrip.set(null); }

  async saveTrip() {
    const draft = this.tripDraft;
    if (!draft.name || !draft.location) return;

    const payload = {
      name: draft.name!, tagline: draft.tagline ?? '', location: draft.location!,
      duration: draft.duration ?? '', price: draft.price ?? 0,
      max_seats: draft.maxSeats ?? 12, seats_left: draft.seatsLeft ?? 12,
      category: draft.category ?? 'group', description: draft.description ?? '',
      image_url: draft.imageUrl ?? '',
    };

    const editing = this.editingTrip();
    if (editing) await supabase.from('trips').update(payload).eq('id', editing.id);
    else await supabase.from('trips').insert(payload);

    await this.loadTrips();
    this.closeTripForm();
  }

  setDelete(type: 'trip' | 'user', id: string, name: string) {
    this.deleteTarget.set({ type, id, name });
  }

  async executeDelete() {
    const t = this.deleteTarget();
    if (!t) return;
    if (t.type === 'trip') {
      await supabase.from('trips').delete().eq('id', t.id);
      this.trips.update(ts => ts.filter(x => x.id !== t.id));
    } else {
      await supabase.from('profiles').delete().eq('id', t.id);
      this.users.update(us => us.filter(x => x.id !== t.id));
    }
    this.deleteTarget.set(null);
  }

  private mapTripRow(row: any): Trip {
    return {
      id: row.id, name: row.name, tagline: row.tagline ?? '',
      location: row.location, duration: row.duration, price: row.price,
      maxSeats: row.max_seats, seatsLeft: row.seats_left, dates: row.dates ?? [],
      category: row.category, images: row.image_url ? [row.image_url] : [],
      description: row.description ?? '', highlights: row.highlights ?? [],
      includes: row.includes ?? [], rating: row.rating ?? 0, reviews: row.reviews ?? 0,
    };
  }
}
