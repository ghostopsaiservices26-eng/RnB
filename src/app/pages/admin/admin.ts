import { Component, OnInit, signal, inject } from '@angular/core';
import {} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BookingService, Trip } from '../../services/booking.service';
import { supabase } from '../../supabase.client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DecimalPipe, SlicePipe],
  template: `
    <div class="admin-page">
      <div class="admin-inner">
        <div class="admin-header">
          <div>
            <h1 class="admin-h1">Admin Dashboard</h1>
            <p class="admin-sub">Logged in as <strong>{{ auth.user()?.email }}</strong></p>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
        </div>

        <!-- Tabs -->
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
                    <label>Title</label>
                    <input [(ngModel)]="tripDraft.name" placeholder="Trip title" />
                  </div>
                  <div class="field">
                    <label>Tagline</label>
                    <input [(ngModel)]="tripDraft.tagline" placeholder="Short tagline" />
                  </div>
                  <div class="field">
                    <label>Destination</label>
                    <input [(ngModel)]="tripDraft.location" placeholder="City, State" />
                  </div>
                  <div class="field">
                    <label>Trip Type</label>
                    <select [(ngModel)]="tripDraft.category">
                      <option value="group">Group Trip</option>
                      <option value="workcation">Workcation</option>
                      <option value="corporate">Corporate</option>
                      <option value="villa">Private Villa</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Start Date</label>
                    <input type="date" [(ngModel)]="tripDraft.startDate" />
                  </div>
                  <div class="field">
                    <label>End Date</label>
                    <input type="date" [(ngModel)]="tripDraft.endDate" />
                  </div>
                  <div class="field">
                    <label>Price (₹)</label>
                    <input type="number" [(ngModel)]="tripDraft.price" />
                  </div>
                  <div class="field">
                    <label>Original Price (₹)</label>
                    <input type="number" [(ngModel)]="tripDraft.originalPrice" />
                  </div>
                  <div class="field">
                    <label>Capacity</label>
                    <input type="number" [(ngModel)]="tripDraft.maxSeats" />
                  </div>
                  <div class="field">
                    <label>Seats Left</label>
                    <input type="number" [(ngModel)]="tripDraft.seatsLeft" />
                  </div>
                  <div class="field">
                    <label>Status</label>
                    <select [(ngModel)]="tripDraft.status">
                      <option value="upcoming">Upcoming</option>
                      <option value="full">Full</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div class="field full">
                    <label>Description</label>
                    <textarea [(ngModel)]="tripDraft.description" rows="3"></textarea>
                  </div>
                  <div class="field full">
                    <label>Highlights</label>
                    <div class="tag-input-row">
                      <input [(ngModel)]="newHighlight" placeholder="e.g. Sunrise at Hemakuta Hill" (keyup.enter)="addHighlight()" />
                      <button type="button" class="tag-add-btn" (click)="addHighlight()">Add</button>
                    </div>
                    @if (tripDraft.highlights?.length) {
                      <div class="tags">
                        @for (h of tripDraft.highlights!; track h) {
                          <span class="tag-item">{{ h }}<button type="button" (click)="removeHighlight(h)">×</button></span>
                        }
                      </div>
                    }
                  </div>
                  <div class="field full">
                    <label>What's Included</label>
                    <div class="tag-input-row">
                      <input [(ngModel)]="newInclude" placeholder="e.g. All breakfasts + 2 dinners" (keyup.enter)="addInclude()" />
                      <button type="button" class="tag-add-btn" (click)="addInclude()">Add</button>
                    </div>
                    @if (tripDraft.includes?.length) {
                      <div class="tags">
                        @for (inc of tripDraft.includes!; track inc) {
                          <span class="tag-item">{{ inc }}<button type="button" (click)="removeInclude(inc)">×</button></span>
                        }
                      </div>
                    }
                  </div>
                  <div class="field full">
                    <label>Images</label>
                    <label class="upload-area">
                      <input type="file" multiple accept="image/*" (change)="onImagesSelected($event)" style="display:none" />
                      <span class="upload-cta">
                        @if (uploading()) { Uploading… }
                        @else { Click to upload images (max 5, up to 5 MB each) }
                      </span>
                    </label>
                    @if (tripDraft.imageUrls?.length) {
                      <div class="image-preview-grid">
                        @for (url of tripDraft.imageUrls!; track url) {
                          <div class="preview-item">
                            <img [src]="url" />
                            <button type="button" class="remove-img" (click)="removeImage(url)">×</button>
                          </div>
                        }
                      </div>
                    }
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
                    <th>Name</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Actions</th>
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
                        <button class="del-btn" (click)="confirmDeleteTrip(t)">Delete</button>
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (u of users(); track u.id) {
                      <tr>
                        <td>{{ u.name || '—' }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.phone || '—' }}</td>
                        <td><span class="role-badge role-{{ u.role }}">{{ u.role }}</span></td>
                        <td>{{ u.created_at | slice:0:10 }}</td>
                        <td class="actions">
                          <button class="del-btn" (click)="confirmDeleteUser(u)">Delete</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }

        <!-- Delete confirm modal -->
        @if (deleteTarget()) {
          <div class="modal-overlay" (click)="deleteTarget.set(null)">
            <div class="modal" (click)="$event.stopPropagation()">
              <h3>Delete "{{ deleteTargetName() }}"?</h3>
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
    .tabs button.active { background: #2C4A3E; color: #fff; }

    .section { background: #fff; border-radius: 16px; border: 1px solid rgba(26,26,24,0.07); overflow: hidden; }
    .section-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(26,26,24,0.07); }
    .section-header h2 { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0; }
    .add-btn { padding: 8px 18px; background: #2C4A3E; color: #fff; border: none; border-radius: 100px; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .add-btn:hover { background: #3d6655; }

    .form-card { margin: 1.5rem; padding: 1.5rem; background: #F7F4EF; border-radius: 12px; }
    .form-card h3 { font-size: 0.95rem; font-weight: 700; color: #1A1A18; margin: 0 0 1.25rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field.full { grid-column: 1 / -1; }
    .field label { font-size: 0.75rem; font-weight: 600; color: #7A7167; text-transform: uppercase; letter-spacing: 0.05em; }
    .field input, .field select, .field textarea { padding: 9px 12px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 8px; font-size: 0.88rem; color: #1A1A18; background: #fff; font-family: inherit; outline: none; }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #2C4A3E; }
    .field textarea { resize: vertical; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.25rem; }
    .ghost-btn { padding: 9px 20px; background: none; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; color: #1A1A18; }
    .save-btn { padding: 9px 22px; background: #2C4A3E; color: #fff; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .save-btn:hover { background: #3d6655; }

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
    .role-badge { padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .role-user { background: rgba(26,26,24,0.07); color: #7A7167; }
    .role-admin { background: rgba(44,74,62,0.1); color: #2C4A3E; }
    .role-superadmin { background: rgba(200,98,42,0.1); color: #C8622A; }
    .loading { padding: 2rem; text-align: center; color: #7A7167; font-size: 0.9rem; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
    .modal { background: #fff; border-radius: 16px; padding: 2rem; max-width: 380px; width: 100%; }
    .modal h3 { font-size: 1rem; font-weight: 700; color: #1A1A18; margin: 0 0 0.5rem; }
    .modal p { font-size: 0.875rem; color: #7A7167; margin: 0 0 1.5rem; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .modal-danger { padding: 9px 20px; background: #EF4444; border: none; border-radius: 8px; color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .modal-danger:hover { background: #DC2626; }

    .tag-input-row { display: flex; gap: 8px; }
    .tag-input-row input { flex: 1; padding: 9px 12px; border: 1.5px solid rgba(26,26,24,0.15); border-radius: 8px; font-size: 0.88rem; color: #1A1A18; background: #fff; font-family: inherit; outline: none; }
    .tag-input-row input:focus { border-color: #2C4A3E; }
    .tag-add-btn { padding: 9px 16px; background: #2C4A3E; color: #fff; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; }
    .tag-add-btn:hover { background: #3d6655; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .tag-item { display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: rgba(44,74,62,0.08); border-radius: 100px; font-size: 0.8rem; color: #2C4A3E; font-weight: 500; }
    .tag-item button { background: none; border: none; cursor: pointer; color: #7A7167; font-size: 0.9rem; padding: 0; line-height: 1; }
    .tag-item button:hover { color: #EF4444; }
    .upload-area {
      display: flex; align-items: center; justify-content: center;
      padding: 1.25rem; border: 2px dashed rgba(26,26,24,0.2);
      border-radius: 10px; cursor: pointer; background: #fff;
      transition: border-color 0.15s;
    }
    .upload-area:hover { border-color: #2C4A3E; }
    .upload-cta { font-size: 0.85rem; color: #7A7167; }
    .image-preview-grid {
      display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;
    }
    .preview-item { position: relative; }
    .preview-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; display: block; }
    .remove-img {
      position: absolute; top: -6px; right: -6px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #EF4444; color: #fff; border: none;
      font-size: 0.75rem; line-height: 1; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .admin-inner { padding: 2rem 1rem 0; }
    }
  `],
})
export class AdminComponent implements OnInit {
  auth = inject(AuthService);
  private bookingSvc = inject(BookingService);

  tab = signal<'trips' | 'users'>('trips');
  trips = signal<Trip[]>([]);
  users = signal<AdminUser[]>([]);
  usersLoading = signal(false);
  tripFormOpen = signal(false);
  editingTrip = signal<Trip | null>(null);
  deleteTarget = signal<{ type: 'trip' | 'user'; id: string; name: string } | null>(null);

  tripDraft: Partial<Trip> & { imageUrls?: string[]; startDate?: string; endDate?: string } = {};
  newHighlight = '';
  newInclude = '';
  uploading = signal(false);

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
    const { data: meta } = await supabase.rpc('get_users_metadata');
    this.users.set((meta ?? []).map((m: any) => ({
      id: m.id,
      email: m.email ?? '',
      name: m.name ?? '',
      phone: m.phone ?? '',
      role: m.role ?? 'user',
      created_at: m.created_at ?? '',
    })));
    this.usersLoading.set(false);
  }

  openTripForm() {
    this.editingTrip.set(null);
    this.tripDraft = { category: 'group', maxSeats: 12, seatsLeft: 12, price: 0, status: 'upcoming', imageUrls: [], highlights: [], includes: [] };
    this.newHighlight = ''; this.newInclude = '';
    this.tripFormOpen.set(true);
  }

  editTrip(t: Trip) {
    this.editingTrip.set(t);
    this.tripDraft = { ...t, imageUrls: [...t.images], startDate: (t as any).startDate ?? '', endDate: (t as any).endDate ?? '', highlights: [...(t.highlights ?? [])], includes: [...(t.includes ?? [])] };
    this.newHighlight = ''; this.newInclude = '';
    this.tripFormOpen.set(true);
  }

  addHighlight() {
    if (!this.newHighlight.trim()) return;
    this.tripDraft.highlights = [...(this.tripDraft.highlights ?? []), this.newHighlight.trim()];
    this.newHighlight = '';
  }
  removeHighlight(h: string) {
    this.tripDraft.highlights = (this.tripDraft.highlights ?? []).filter(x => x !== h);
  }
  addInclude() {
    if (!this.newInclude.trim()) return;
    this.tripDraft.includes = [...(this.tripDraft.includes ?? []), this.newInclude.trim()];
    this.newInclude = '';
  }
  removeInclude(inc: string) {
    this.tripDraft.includes = (this.tripDraft.includes ?? []).filter(x => x !== inc);
  }

  async onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const existing = this.tripDraft.imageUrls ?? [];
    const MAX_IMAGES = 5;
    const MAX_SIZE_MB = 5;

    const allowed = Array.from(files).filter(f => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`"${f.name}" exceeds ${MAX_SIZE_MB} MB and was skipped.`);
        return false;
      }
      return true;
    }).slice(0, MAX_IMAGES - existing.length);

    if (existing.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      input.value = '';
      return;
    }

    this.uploading.set(true);
    const urls: string[] = [...existing];
    for (const file of allowed) {
      const ext = file.name.split('.').pop();
      const path = `trips/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('trip-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('trip-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    this.tripDraft.imageUrls = urls;
    input.value = '';
    this.uploading.set(false);
  }

  removeImage(url: string) {
    this.tripDraft.imageUrls = (this.tripDraft.imageUrls ?? []).filter(u => u !== url);
  }

  closeTripForm() {
    this.tripFormOpen.set(false);
    this.editingTrip.set(null);
  }

  async saveTrip() {
    const draft = this.tripDraft;
    if (!draft.name || !draft.location) return;

    const payload = {
      title:          draft.name!,
      tagline:        draft.tagline ?? '',
      destination:    draft.location!,
      trip_type:      draft.category ?? 'group',
      start_date:     draft.startDate || null,
      end_date:       draft.endDate || null,
      price:          draft.price ?? 0,
      original_price: draft.originalPrice ?? null,
      capacity:       draft.maxSeats ?? 12,
      seats_left:     draft.seatsLeft ?? 12,
      status:         (draft.status as string) ?? 'upcoming',
      description:    draft.description ?? '',
      highlights:     draft.highlights ?? [],
      includes:       draft.includes ?? [],
      images:         draft.imageUrls ?? [],
    };

    const editing = this.editingTrip();
    if (editing) {
      await supabase.from('trips').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('trips').insert(payload);
    }

    await this.loadTrips();

    this.closeTripForm();
  }

  confirmDeleteTrip(t: Trip) {
    this.deleteTarget.set({ type: 'trip', id: t.id, name: t.name });
  }

  confirmDeleteUser(u: AdminUser) {
    this.deleteTarget.set({ type: 'user', id: u.id, name: u.email });
  }

  deleteTargetName() {
    return this.deleteTarget()?.name ?? '';
  }

  async executeDelete() {
    const target = this.deleteTarget();
    if (!target) return;

    if (target.type === 'trip') {
      await supabase.from('trips').delete().eq('id', target.id);
      this.trips.update(ts => ts.filter(t => t.id !== target.id));
    } else {
      await supabase.from('profiles').delete().eq('id', target.id);
      this.users.update(us => us.filter(u => u.id !== target.id));
    }

    this.deleteTarget.set(null);
  }

  private mapTripRow(row: any): Trip & { startDate?: string; endDate?: string } {
    const nights = row.start_date && row.end_date
      ? Math.round((new Date(row.end_date).getTime() - new Date(row.start_date).getTime()) / 86400000)
      : 0;
    const duration = nights > 0 ? `${nights + 1} Days / ${nights} Nights` : '';
    const dateLabel = row.start_date && row.end_date
      ? `${new Date(row.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(row.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : '';
    return {
      id:            row.id,
      name:          row.title ?? '',
      tagline:       row.tagline ?? '',
      location:      row.destination ?? '',
      duration,
      price:         row.price ?? 0,
      originalPrice: row.original_price ?? undefined,
      maxSeats:      row.capacity ?? 12,
      seatsLeft:     row.seats_left ?? 0,
      dates:         dateLabel ? [dateLabel] : [],
      category:      row.trip_type ?? 'group',
      images:        Array.isArray(row.images) && row.images.length ? row.images : [],
      description:   row.description ?? '',
      highlights:    Array.isArray(row.highlights) ? row.highlights : [],
      includes:      Array.isArray(row.includes) ? row.includes : [],
      rating:        0,
      reviews:       0,
      status:        row.status ?? 'upcoming',
      startDate:     row.start_date ?? '',
      endDate:       row.end_date ?? '',
    };
  }
}
