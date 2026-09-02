import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, MousePointerClick, Eye, Globe, CalendarDays, TrendingUp } from 'lucide-react';

interface ProviderProfile {
  id: number;
  name: string;
  type: string;
}

interface ChartData {
  date: string;
  views: number;
  phone_clicks: number;
  website_clicks: number;
  booking_clicks: number;
}

interface AnalyticsStats {
  totalViews: number;
  totalPhoneClicks: number;
  totalWebsiteClicks: number;
  totalBookingClicks: number;
  phoneCtr: number;
  websiteCtr: number;
  bookingCtr: number;
}

interface AdStats {
  totalSpend: number;
  totalAdViews: number;
  activeAds: number;
}

interface AnalyticsProps {
  chartData: ChartData[];
  stats: AnalyticsStats;
  adStats: AdStats;
  profiles: ProviderProfile[];
}

export default function Analytics({ chartData, stats, adStats, profiles }: AnalyticsProps) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Business Analytics', href: '#' }
  ];

  return (
    <DashboardLayout
      title="Business Analytics"
      subtitle="Track views, clicks, and interactions across your professional provider profiles"
      breadcrumbs={breadcrumbs}
    >
      <Head title="Business Analytics" />

      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {profiles.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Total Views</span>
                  <div className="w-8 h-8 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-woof-charcoal">{stats.totalViews}</div>
                <p className="text-xs text-woof-charcoal/50 mt-0.5">Directory impressions</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Phone Inquiries</span>
                  <div className="w-8 h-8 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <MousePointerClick className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-woof-charcoal">{stats.totalPhoneClicks}</div>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  {stats.phoneCtr}% CTR
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Website Visits</span>
                  <div className="w-8 h-8 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <Globe className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-woof-charcoal">{stats.totalWebsiteClicks}</div>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  {stats.websiteCtr}% CTR
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Direct Bookings</span>
                  <div className="w-8 h-8 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-woof-charcoal">{stats.totalBookingClicks}</div>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  {stats.bookingCtr}% conversion
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Active Listings</span>
                  <div className="w-8 h-8 rounded-2xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center text-woof-gold">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-woof-charcoal">{profiles.length}</div>
                <p className="text-xs text-woof-charcoal/50 mt-0.5">Published profiles</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
                <div>
                  <h3 className="text-base font-bold text-woof-charcoal">Profile Engagement Over Time</h3>
                  <p className="text-xs text-woof-charcoal/60">Views, calls, and clicks over the past 30 days</p>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> 30-Day Trend
                </span>
              </div>

              <div className="h-[380px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ded1" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#61584a" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dy={8}
                    />
                    <YAxis 
                      stroke="#61584a" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-4}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e8ded1', 
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        fontSize: '12px',
                        color: '#24221c'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      name="Profile Views"
                      dataKey="views" 
                      stroke="#24221c" 
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#24221c' }}
                    />
                    <Line 
                      type="monotone" 
                      name="Phone Clicks"
                      dataKey="phone_clicks" 
                      stroke="#bb8b62" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#bb8b62' }}
                    />
                    <Line 
                      type="monotone" 
                      name="Website Clicks"
                      dataKey="website_clicks" 
                      stroke="#a89f91" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#a89f91' }}
                    />
                    <Line 
                      type="monotone" 
                      name="Booking Clicks"
                      dataKey="booking_clicks" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e8ded1] shadow-xs flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#fcfbf9] border border-[#e8ded1] flex items-center justify-center mb-4 text-woof-gold">
              <BarChart3 className="h-8 w-8 text-woof-gold/40" />
            </div>
            <h3 className="text-woof-charcoal text-base font-bold">No Analytics Data Yet</h3>
            <p className="text-woof-charcoal/60 mt-1 text-xs max-w-sm">
              You don't have any active professional provider listings. Create a provider profile (Vet, Grooming, Trainer, Boarding) to start tracking engagement.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
