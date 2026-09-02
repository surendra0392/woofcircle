import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full border border-woof-charcoal/10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-woof-gold rounded-full text-[10px] font-black text-white uppercase">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-[10px] leading-tight font-black tracking-[0.2em] uppercase">
                <span className="truncate">{user.name}</span>
                {showEmail && <span className="text-woof-charcoal/40 truncate">{user.email}</span>}
            </div>
        </>
    );
}
