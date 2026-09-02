import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProviderAvailability {
  id: number;
  provider_type: string;
  provider_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}

interface ProviderProfile {
  id: number;
  name: string;
  type: string;
}

interface AvailabilityProps {
  availabilities: ProviderAvailability[];
  profiles: ProviderProfile[];
}

export default function Availability({ availabilities, profiles }: AvailabilityProps) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Availability', href: '#' }
  ];

  const { data, setData, post, processing, reset, errors } = useForm({
    provider_type: profiles.length > 0 ? profiles[0].type : '',
    provider_id: profiles.length > 0 ? profiles[0].id : '',
    day_of_week: 1, // Default Monday
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('dashboard.business.availability.store'), {
      onSuccess: () => {
        toast.success('Availability slot added successfully!');
        reset('day_of_week', 'start_time', 'end_time');
      }
    });
  };

  const handleDelete = (id: number) => {
    router.delete(route('dashboard.business.availability.destroy', id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Availability slot removed.')
    });
  };

  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m), 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProfileName = (providerId: number) => {
    const profile = profiles.find(p => p.id === providerId);
    return profile ? profile.name : 'Unknown';
  };

  return (
    <DashboardLayout
      title="My Availability"
      subtitle="Configure the days and time windows you are open to accept online bookings"
      breadcrumbs={breadcrumbs}
    >
      <Head title="My Availability" />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {profiles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
              <Clock className="h-8 w-8 text-woof-gold/40" />
            </div>
            <h3 className="text-woof-charcoal text-base font-bold">No Professional Profiles Found</h3>
            <p className="text-woof-charcoal/60 mt-1 text-xs max-w-sm">
              You must have an active business profile (Veterinarian, Trainer, Grooming, Boarding) to set appointment availability.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Add Slot Form */}
            <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-[#e8ded1] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-woof-charcoal">Add Working Hours</h3>
                  <p className="text-xs text-woof-charcoal/60">Define a recurring day and time window</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Business Profile</Label>
                  <Select
                    value={data.provider_id.toString()}
                    onValueChange={(val) => {
                      const selected = profiles.find(p => p.id === parseInt(val));
                      if (selected) {
                        setData(prev => ({
                          ...prev,
                          provider_id: selected.id,
                          provider_type: selected.type
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                      <SelectValue placeholder="Select Profile" />
                    </SelectTrigger>
                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                      {profiles.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name} ({p.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Day of Week</Label>
                  <Select
                    value={data.day_of_week.toString()}
                    onValueChange={(val) => setData('day_of_week', parseInt(val))}
                  >
                    <SelectTrigger className="bg-[#fcfbf9] border-[#e8ded1] focus:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent className="border-[#e8ded1] rounded-2xl bg-white shadow-md">
                      {daysOfWeek.map((day, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start_time" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={data.start_time}
                      onChange={e => setData('start_time', e.target.value)}
                      className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={data.end_time}
                      onChange={e => setData('end_time', e.target.value)}
                      className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot_duration_minutes" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Slot Length (Minutes)</Label>
                  <Input
                    id="slot_duration_minutes"
                    type="number"
                    min="15"
                    step="15"
                    value={data.slot_duration_minutes}
                    onChange={e => setData('slot_duration_minutes', parseInt(e.target.value))}
                    className="bg-[#fcfbf9] border-[#e8ded1] focus-visible:ring-woof-gold h-11 rounded-2xl font-medium text-xs text-woof-charcoal"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 transition-all shadow-xs cursor-pointer mt-4"
                >
                  {processing ? 'Saving...' : 'Add Slot'}
                </Button>
              </form>
            </div>

            {/* Right: Active Slots List */}
            <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-woof-charcoal">Configured Availability</h3>
                    <p className="text-xs text-woof-charcoal/60">Active slots shown on your booking schedule</p>
                  </div>
                </div>
                <span className="text-xs text-woof-charcoal/50">{availabilities.length} active windows</span>
              </div>

              {availabilities.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#e8ded1] bg-[#fcfbf9] p-12 text-center">
                  <Clock className="mx-auto mb-3 h-8 w-8 text-woof-gold/40" />
                  <h4 className="text-base font-bold text-woof-charcoal mb-1">No Schedule Configured</h4>
                  <p className="text-xs text-woof-charcoal/60 max-w-sm mx-auto">
                    You haven't defined any working hours yet. Use the form to configure your available slots.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availabilities.map(slot => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 shadow-2xs hover:bg-white hover:border-woof-gold transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-woof-charcoal">
                            {daysOfWeek[slot.day_of_week]}
                          </span>
                          <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {slot.slot_duration_minutes}m slots
                          </span>
                        </div>
                        <p className="text-xs text-woof-charcoal/60 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-woof-gold" />
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </p>
                        <p className="text-[10px] text-woof-charcoal/40 font-medium">
                          {getProfileName(slot.provider_id)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(slot.id)}
                        className="h-8 w-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
