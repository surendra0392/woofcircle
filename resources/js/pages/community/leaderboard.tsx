import { AppHeader } from '@/components/app-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitials } from '@/hooks/use-initials';
import { Head } from '@inertiajs/react';
import { Trophy, Award } from 'lucide-react';

interface LeaderboardUser {
    id: number;
    name: string;
    avatar: string | null;
    karma_points: number;
}

export default function Leaderboard({ users }: { users: LeaderboardUser[] }) {
    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            <Head title="Community Leaderboard" />
            <AppHeader
                breadcrumbs={[
                    { title: 'Community', href: '#' },
                    { title: 'Leaderboard', href: '/community/leaderboard' },
                ]}
            />
            
            <main className="container-wide max-w-4xl py-16 px-6 lg:px-12">
                <div className="mb-10 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-woof-gold text-xs font-bold uppercase tracking-wider">
                        <Trophy className="h-4 w-4" />
                        <span>Hall of Fame</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-woof-charcoal tracking-tight">Community Leaders</h1>
                    <p className="text-woof-charcoal/70 text-sm max-w-xl mx-auto leading-relaxed">
                        Recognizing the top contributors to our community. Earn karma by participating in forums, adding your pets, and helping others!
                    </p>
                </div>

                <Card className="rounded-3xl border border-[#e8ded1] shadow-xs overflow-hidden bg-white">
                    <CardHeader className="bg-woof-charcoal text-white p-6 sm:p-8">
                        <CardTitle className="text-base sm:text-lg font-bold uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-woof-gold" />
                                Top Members
                            </span>
                            <span className="text-woof-gold text-sm font-bold">Karma Points</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-[#e8ded1]">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-woof-cream/30 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-8 text-center font-bold text-sm sm:text-base ${index === 0 ? 'text-woof-gold font-black text-lg' : index === 1 ? 'text-amber-700 font-bold' : index === 2 ? 'text-stone-500 font-bold' : 'text-woof-charcoal/40'}`}>
                                                #{index + 1}
                                            </div>
                                            <Avatar className="size-11 border border-[#e8ded1] rounded-2xl">
                                                <AvatarImage src={user.avatar || undefined} alt={user.name} className="rounded-2xl" />
                                                <AvatarFallback className="bg-woof-cream text-woof-charcoal font-bold uppercase rounded-2xl text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-bold text-sm sm:text-base text-woof-charcoal">
                                                {user.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="text-base sm:text-lg font-bold text-woof-gold">{user.karma_points}</span>
                                            <span className="text-[11px] uppercase font-bold text-woof-charcoal/50">pts</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-woof-charcoal/60 text-sm">
                                    No users found on the leaderboard yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
