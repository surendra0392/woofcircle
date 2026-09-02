import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public/public-layout';
import { Trophy, Flame, User, Award } from 'lucide-react';
import { getInitials } from '@/hooks/use-initials';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function Leaderboard({ topKarma, topStreaks }: any) {
    return (
        <PublicLayout>
            <Head title="Community Leaderboard - Woof Circle" />

            <section className="border-b border-[#e8ded1] bg-[#fcfbf9] pt-32 pb-12">
                <div className="container-wide px-6 lg:px-12">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Home', href: '/' },
                            { title: 'Community', href: '#' },
                            { title: 'Leaderboard', href: route('community.leaderboard.index') },
                        ]}
                        className="mb-6"
                    />

                    <div className="max-w-3xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-woof-gold h-px w-8" />
                            <span className="text-woof-gold text-xs font-bold tracking-wider uppercase">Hall of Fame</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-woof-charcoal">
                            Community Leaderboard
                        </h1>
                        <p className="text-sm text-woof-charcoal/70 leading-relaxed font-normal">
                            Celebrating the most active, helpful, and dedicated members of the Woof Circle community.
                        </p>
                    </div>
                </div>
            </section>

            <div className="bg-white py-16">
                <div className="container-wide px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Top Karma */}
                        <div className="bg-[#fcfbf9] rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8ded1]">
                                <div className="bg-woof-cream text-woof-gold p-3 rounded-2xl border border-[#e8ded1] shadow-2xs">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-woof-charcoal">Top Karma Points</h2>
                                    <p className="text-xs text-woof-charcoal/60">Members with highest community engagement</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {topKarma.map((user: any, index: number) => (
                                    <div key={user.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-7 text-center font-bold text-sm ${index === 0 ? 'text-woof-gold font-black text-base' : index === 1 ? 'text-amber-700' : index === 2 ? 'text-stone-500' : 'text-woof-charcoal/40'}`}>
                                                #{index + 1}
                                            </div>
                                            {user.avatar ? (
                                                <img src={`/storage/${user.avatar}`} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-xl object-cover border border-[#e8ded1]" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-charcoal text-xs font-bold">
                                                    {getInitials(`${user.first_name} ${user.last_name}`)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-sm text-woof-charcoal">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm text-woof-gold flex items-center gap-1">
                                            {user.karma_points}
                                            <span className="text-[10px] font-medium text-woof-charcoal/50 uppercase">pts</span>
                                        </div>
                                    </div>
                                ))}
                                {topKarma.length === 0 && (
                                    <div className="text-center py-10 text-woof-charcoal/60 text-xs">No data available yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Top Streaks */}
                        <div className="bg-[#fcfbf9] rounded-3xl p-6 sm:p-8 border border-[#e8ded1] shadow-xs">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8ded1]">
                                <div className="bg-woof-cream text-woof-gold p-3 rounded-2xl border border-[#e8ded1] shadow-2xs">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-woof-charcoal">Longest Streaks</h2>
                                    <p className="text-xs text-woof-charcoal/60">Members with highest daily login streaks</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {topStreaks.map((user: any, index: number) => (
                                    <div key={user.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#e8ded1] hover:border-woof-gold/40 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-7 text-center font-bold text-sm ${index === 0 ? 'text-woof-gold font-black text-base' : index === 1 ? 'text-amber-700' : index === 2 ? 'text-stone-500' : 'text-woof-charcoal/40'}`}>
                                                #{index + 1}
                                            </div>
                                            {user.avatar ? (
                                                <img src={`/storage/${user.avatar}`} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-xl object-cover border border-[#e8ded1]" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-woof-cream border border-[#e8ded1] flex items-center justify-center text-woof-charcoal text-xs font-bold">
                                                    {getInitials(`${user.first_name} ${user.last_name}`)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-sm text-woof-charcoal">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm text-woof-gold flex items-center gap-1">
                                            {user.highest_login_streak}
                                            <span className="text-[10px] font-medium text-woof-charcoal/50 uppercase">days</span>
                                        </div>
                                    </div>
                                ))}
                                {topStreaks.length === 0 && (
                                    <div className="text-center py-10 text-woof-charcoal/60 text-xs">No data available yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
