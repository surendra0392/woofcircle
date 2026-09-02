import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, User, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: number;
  provider_type: string;
  provider_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  user: {
    id: number;
    name: string;
    email: string;
    mobile_number: string | null;
  };
}

interface ProviderProfile {
  id: number;
  name: string;
  type: string;
}

interface BookingsProps {
  bookings: {
    data: Booking[];
    links: any[];
  };
  profiles: ProviderProfile[];
}

export default function Bookings({ bookings, profiles }: BookingsProps) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Bookings', href: '#' }
  ];

  const handleStatusUpdate = (bookingId: number, status: string) => {
    router.patch(route('dashboard.business.bookings.update', bookingId), { status }, {
      preserveScroll: true,
      onSuccess: () => toast.success(`Booking marked as ${status}`),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-[#fcfbf9] text-woof-charcoal border-[#e8ded1]';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProfileName = (providerId: number) => {
    const profile = profiles.find(p => p.id === providerId);
    return profile ? profile.name : 'Unknown Profile';
  };

  return (
    <DashboardLayout
      title="My Bookings"
      subtitle="Manage incoming client appointments, scheduled services, and consultations"
      breadcrumbs={breadcrumbs}
    >
      <Head title="My Bookings" />

      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {profiles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
              <CalendarDays className="h-8 w-8 text-woof-gold/40" />
            </div>
            <h3 className="text-woof-charcoal text-base font-bold">No Business Profiles</h3>
            <p className="text-woof-charcoal/60 mt-1 text-xs max-w-sm">
              You need to create a professional service profile to receive appointments and client bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-woof-charcoal uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="text-woof-gold h-4 w-4" /> Client Appointments
              </h3>
              <span className="text-xs text-woof-charcoal/50">{bookings.data.length} records</span>
            </div>

            {bookings.data.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#e8ded1] p-16 text-center shadow-xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
                  <CalendarDays className="h-8 w-8 text-woof-gold/40" />
                </div>
                <h4 className="text-base font-bold text-woof-charcoal mb-1">No Bookings Yet</h4>
                <p className="text-xs text-woof-charcoal/60 max-w-sm mx-auto">
                  When pet owners book appointments with your business profiles, they will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.data.map(booking => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold shrink-0">
                        <User className="h-6 w-6" />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                          <h4 className="text-base font-bold text-woof-charcoal">
                            {booking.user.name}
                          </h4>
                          <span className="text-xs text-woof-charcoal/40 font-medium">
                            • for {getProfileName(booking.provider_id)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-woof-charcoal/60 flex-wrap">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-woof-gold" />
                            {formatDate(booking.start_time)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-woof-gold" />
                            {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-woof-charcoal/50 flex-wrap pt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-woof-gold" />
                            {booking.user.email}
                          </span>
                          {booking.user.mobile_number && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-woof-gold" />
                              {booking.user.mobile_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {booking.status === 'scheduled' && (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold px-4 py-2 h-9 transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="rounded-full border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold px-4 py-2 h-9 transition-colors shadow-2xs"
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
