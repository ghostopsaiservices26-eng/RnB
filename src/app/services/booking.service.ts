import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface Trip {
  id: string;
  name: string;
  tagline: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  maxSeats: number;
  seatsLeft: number;
  dates: string[];
  category: 'group' | 'workcation' | 'corporate' | 'villa';
  images: string[];
  description: string;
  highlights: string[];
  includes: string[];
  rating: number;
  reviews: number;
  status?: string;
}

export interface Booking {
  id: string;
  tripId: string;
  tripName: string;
  tripImage: string;
  tripLocation: string;
  userId: string;
  selectedDate: string;
  seats: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  contactName: string;
  contactPhone: string;
  specialRequests: string;
}

// Hardcoded fallback — shown when Supabase trips table is empty
export const TRIPS: Trip[] = [
  {
    id: 'goa-group-01',
    name: 'Goa Sunsets & Stories',
    tagline: 'The beach trip that feels like a reset button',
    location: 'Goa, India',
    duration: '4 Days / 3 Nights',
    price: 18500,
    originalPrice: 22000,
    maxSeats: 12,
    seatsLeft: 4,
    dates: ['Jun 14–17, 2025', 'Jul 12–15, 2025', 'Aug 9–12, 2025'],
    category: 'group',
    images: [
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    ],
    description: 'Curated group trip for solo travellers and friend groups. Private villa, curated co-travellers, guided experiences — not a party package.',
    highlights: ['North Goa heritage walks', 'Sunset cruise on the Mandovi', 'Spice plantation visit', 'Private beach bonfire', 'Curated group dinner'],
    includes: ['Private villa accommodation', 'Airport transfers', 'All breakfasts + 2 dinners', 'All guided experiences', '24/7 RnB host on ground'],
    rating: 4.9,
    reviews: 47,
  },
  {
    id: 'hampi-01',
    name: 'Hampi — Stones & Stories',
    tagline: 'Where ancient history meets the horizon',
    location: 'Hampi, Karnataka',
    duration: '3 Days / 2 Nights',
    price: 15500,
    originalPrice: 19000,
    maxSeats: 10,
    seatsLeft: 6,
    dates: ['Jun 20–22, 2025', 'Jul 18–20, 2025', 'Aug 15–17, 2025'],
    category: 'group',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    ],
    description: 'Trek through ruins, watch sunrises on boulder tops, and connect with a curated group of curious travellers.',
    highlights: ['Sunrise at Hemakuta Hill', 'Coracle ride on Tungabhadra', 'Expert-guided ruins walk', 'Local heritage dinner', 'Sunset at Matanga Hill'],
    includes: ['Boutique riverside stay', 'All meals', 'Transport within Hampi', 'Expert heritage guide', 'RnB host'],
    rating: 4.8,
    reviews: 31,
  },
  {
    id: 'manali-01',
    name: 'Manali Snow & Soul',
    tagline: 'Mountains, campfires, and real conversation',
    location: 'Manali, Himachal Pradesh',
    duration: '5 Days / 4 Nights',
    price: 21000,
    originalPrice: 25000,
    maxSeats: 12,
    seatsLeft: 2,
    dates: ['Jun 7–11, 2025', 'Jun 28–Jul 2, 2025'],
    category: 'group',
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    description: 'High altitude, low ego. Trekking, campfires, and conversations you\'ll remember longer than the summit selfies.',
    highlights: ['Solang Valley snowfield', 'Hadimba temple sunrise trek', 'Riverside campfire night', 'Local mountain cuisine evening', 'Rohtang day excursion'],
    includes: ['Mountain lodge stay', 'All meals (veg + non-veg)', 'Trek guide + safety gear', 'Volvo AC transport from Delhi', 'RnB host'],
    rating: 4.9,
    reviews: 54,
  },
  {
    id: 'coorg-workcation-01',
    name: 'Coorg Cloud Workcation',
    tagline: 'Work better. Think clearer. Live fully.',
    location: 'Coorg, Karnataka',
    duration: '5 Days / 4 Nights',
    price: 28000,
    maxSeats: 8,
    seatsLeft: 3,
    dates: ['Jun 1–5, 2025', 'Jul 6–10, 2025', 'Aug 3–7, 2025'],
    category: 'workcation',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    ],
    description: 'High-altitude estate, blazing-fast WiFi, private workspaces, and coffee plantation walks between calls.',
    highlights: ['Dedicated co-working lounge', 'Coffee estate morning tour', 'Waterfall hike (post-work)', 'Evening bonfire networking', 'Yoga & meditation session'],
    includes: ['Estate accommodation', 'All meals (chef-prepared)', 'High-speed fibre WiFi', 'Airport/station transfer', 'RnB community manager on site'],
    rating: 4.9,
    reviews: 22,
  },
  {
    id: 'kerala-villa-01',
    name: 'Kerala Backwaters Villa',
    tagline: 'Your private slice of Kerala',
    location: 'Alleppey, Kerala',
    duration: 'Flexible (3–7 days)',
    price: 22000,
    maxSeats: 16,
    seatsLeft: 12,
    dates: ['Flexible — book any date'],
    category: 'villa',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80',
    ],
    description: 'Private houseboat + lakeside villa package for groups, families, or corporate teams.',
    highlights: ['Private houseboat on backwaters', 'Backwater kayaking at dawn', 'Kathakali cultural performance', 'Ayurvedic spa access', 'Village walk with local guide'],
    includes: ['Villa + houseboat accommodation', 'All meals (Kerala cuisine)', 'All transfers', 'Curated activity package', 'RnB personal concierge'],
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 'corporate-01',
    name: 'Corporate Team Offsite',
    tagline: 'Build your team. Not just a strategy deck.',
    location: 'Customisable — 15+ destinations',
    duration: '2–4 Days (custom)',
    price: 0,
    maxSeats: 200,
    seatsLeft: 200,
    dates: ['Flexible — we plan around you'],
    category: 'corporate',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80',
    ],
    description: 'End-to-end corporate retreat planning for teams of 10–200. We handle venue, logistics, activities, and F&B.',
    highlights: ['Custom team-building programmes', 'Keynote & workshop venues', 'Adventure + bonding activities', 'Fully managed F&B', 'Post-trip engagement report'],
    includes: ['Venue sourcing + booking', 'Full logistics management', 'Activity design + facilitation', 'F&B (all meals)', 'Dedicated RnB coordinator'],
    rating: 4.8,
    reviews: 12,
  },
];

type CreateBookingPayload = Omit<Booking, 'id' | 'createdAt' | 'status'>;

@Injectable({ providedIn: 'root' })
export class BookingService {

  async getTrips(): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .in('status', ['upcoming', 'ongoing', 'full'])
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return TRIPS;
    return data.map(this.mapTripRow);
  }

  async getTripById(id: string): Promise<Trip | undefined> {
    // Check DB first
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) return this.mapTripRow(data);
    // Fall back to hardcoded
    return TRIPS.find(t => t.id === id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('trip_bookings')
      .select(`
        id, trip_id, user_id, booking_date, seats, total_amount,
        status, contact_name, contact_phone, special_requests, created_at,
        trips:trip_id ( name, image_url, location )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) { console.error(error); return []; }
    return (data ?? []).map(this.mapBookingRow);
  }

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data, error } = await supabase
      .from('trip_bookings')
      .insert({
        trip_id:          payload.tripId,
        user_id:          payload.userId,
        booking_date:     payload.selectedDate,
        seats:            payload.seats,
        total_amount:     payload.totalPrice,
        contact_name:     payload.contactName,
        contact_phone:    payload.contactPhone,
        special_requests: payload.specialRequests,
        status:           'confirmed',
      })
      .select(`
        id, trip_id, user_id, booking_date, seats, total_amount,
        status, contact_name, contact_phone, special_requests, created_at,
        trips:trip_id ( name, image_url, location )
      `)
      .single();

    if (error) throw error;
    return this.mapBookingRow(data);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('trip_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) throw error;
  }

  mapTripRow(row: Record<string, unknown>): Trip {
    const start = row['start_date'] as string | null;
    const end = row['end_date'] as string | null;
    const nights = start && end
      ? Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000)
      : 0;
    const duration = nights > 0 ? `${nights + 1} Days / ${nights} Nights` : '';
    const dateLabel = start && end
      ? `${new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : '';
    return {
      id:            row['id'] as string,
      name:          (row['title'] as string) ?? '',
      tagline:       (row['tagline'] as string) ?? '',
      location:      (row['destination'] as string) ?? '',
      duration,
      price:         (row['price'] as number) ?? 0,
      originalPrice: row['original_price'] as number | undefined,
      maxSeats:      (row['capacity'] as number) ?? 12,
      seatsLeft:     (row['seats_left'] as number) ?? 0,
      dates:         dateLabel ? [dateLabel] : [],
      category:      (row['trip_type'] as Trip['category']) ?? 'group',
      images:        Array.isArray(row['images']) && (row['images'] as string[]).length ? row['images'] as string[] : [],
      description:   (row['description'] as string) ?? '',
      highlights:    Array.isArray(row['highlights']) ? row['highlights'] as string[] : [],
      includes:      Array.isArray(row['includes']) ? row['includes'] as string[] : [],
      rating:        0,
      reviews:       0,
      status:        (row['status'] as string) ?? 'published',
    };
  }

  private mapBookingRow(row: Record<string, unknown>): Booking {
    const trip = row['trips'] as Record<string, unknown> | null;
    return {
      id:              row['id'] as string,
      tripId:          row['trip_id'] as string,
      tripName:        (trip?.['name'] as string) ?? '',
      tripImage:       (trip?.['image_url'] as string) ?? '',
      tripLocation:    (trip?.['location'] as string) ?? '',
      userId:          row['user_id'] as string,
      selectedDate:    (row['booking_date'] as string) ?? '',
      seats:           (row['seats'] as number) ?? 1,
      totalPrice:      (row['total_amount'] as number) ?? 0,
      status:          (row['status'] as Booking['status']) ?? 'confirmed',
      createdAt:       (row['created_at'] as string) ?? '',
      contactName:     (row['contact_name'] as string) ?? '',
      contactPhone:    (row['contact_phone'] as string) ?? '',
      specialRequests: (row['special_requests'] as string) ?? '',
    };
  }
}
