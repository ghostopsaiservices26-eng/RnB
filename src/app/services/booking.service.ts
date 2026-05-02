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
    description: 'Curated group trip for solo travellers and friend groups. Private villa, curated co-travellers, guided experiences — not a party package. Every RnB trip is designed so that the group itself becomes the highlight.',
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
    description: 'Trek through ruins, watch sunrises on boulder tops, and connect with a curated group of curious travellers. Hampi is one of India\'s most underrated destinations — and we do it right.',
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
    description: 'High altitude, low ego. Trekking, campfires, and conversations you\'ll remember longer than the summit selfies. This trip sells out every season.',
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
    description: 'High-altitude estate, blazing-fast WiFi, private workspaces, and coffee plantation walks between calls. Designed for remote workers and freelancers who want productivity without sacrificing experience.',
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
    description: 'Private houseboat + lakeside villa package for groups, families, or corporate teams. Every photo is exactly what you get. No surprises, no stock images.',
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
    description: 'End-to-end corporate retreat planning for teams of 10–200. We handle venue, logistics, activities, and F&B so you can focus on what matters: your people.',
    highlights: ['Custom team-building programmes', 'Keynote & workshop venues', 'Adventure + bonding activities', 'Fully managed F&B', 'Post-trip engagement report'],
    includes: ['Venue sourcing + booking', 'Full logistics management', 'Activity design + facilitation', 'F&B (all meals)', 'Dedicated RnB coordinator'],
    rating: 4.8,
    reviews: 12,
  },
];

type CreateBookingPayload = Omit<Booking, 'id' | 'createdAt' | 'status'>;

@Injectable({ providedIn: 'root' })
export class BookingService {
  getTrips(): Trip[] {
    return TRIPS;
  }

  getTripById(id: string): Trip | undefined {
    return TRIPS.find(t => t.id === id);
  }

  getTripsByCategory(category: Trip['category']): Trip[] {
    return TRIPS.filter(t => t.category === category);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) { console.error(error); return []; }
    return (data ?? []).map(this.mapRow);
  }

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        trip_id:          payload.tripId,
        trip_name:        payload.tripName,
        trip_image:       payload.tripImage,
        trip_location:    payload.tripLocation,
        user_id:          payload.userId,
        selected_date:    payload.selectedDate,
        seats:            payload.seats,
        total_price:      payload.totalPrice,
        contact_name:     payload.contactName,
        contact_phone:    payload.contactPhone,
        special_requests: payload.specialRequests,
        status:           'confirmed',
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) throw error;
  }

  private mapRow(row: Record<string, unknown>): Booking {
    return {
      id:              row['id'] as string,
      tripId:          row['trip_id'] as string,
      tripName:        row['trip_name'] as string,
      tripImage:       row['trip_image'] as string,
      tripLocation:    row['trip_location'] as string,
      userId:          row['user_id'] as string,
      selectedDate:    row['selected_date'] as string,
      seats:           row['seats'] as number,
      totalPrice:      row['total_price'] as number,
      status:          row['status'] as Booking['status'],
      createdAt:       row['created_at'] as string,
      contactName:     row['contact_name'] as string,
      contactPhone:    row['contact_phone'] as string,
      specialRequests: row['special_requests'] as string,
    };
  }
}
