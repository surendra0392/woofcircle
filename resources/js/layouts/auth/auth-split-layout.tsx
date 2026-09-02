import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}
export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { quote, settings } = usePage<SharedData>().props;
    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center bg-[#fcfbf9] px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="border-[#e8ded1] relative hidden h-full flex-col overflow-hidden border-r p-10 text-white lg:flex">
                <div className="bg-woof-charcoal absolute inset-0">
                    <img src="/images/auth-bg.png" alt="Cinematic Dog" className="h-full w-full object-cover opacity-60 grayscale-[0.2]" />
                    <div className="from-woof-charcoal/90 via-woof-charcoal/50 absolute inset-0 bg-gradient-to-br to-transparent" />
                    <div className="from-woof-charcoal absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80" />
                </div>

                <Link href="/" className="group relative z-20 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="bg-woof-charcoal text-woof-gold border border-woof-gold/30 shadow-md flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-105">
                        {settings.site_logo ? (
                            <img src={settings.site_logo} alt={settings.site_name} className="h-8 w-auto object-contain invert" />
                        ) : (
                            <div className="h-7 w-7 fill-current transition-transform duration-500 group-hover:rotate-12" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xl leading-none font-extrabold tracking-wide uppercase">{settings.site_name}</span>
                        <span className="text-woof-pearl text-[10px] font-bold tracking-widest uppercase mt-1">Premium Puppy Care</span>
                    </div>
                </Link>

                <div className="relative z-20 mt-auto">
                    <div className="bg-woof-gold mb-6 h-px w-12" />

                    <blockquote className="space-y-2">
                        <p className="text-lg leading-relaxed font-medium tracking-tight text-balance opacity-90 text-white">
                            "{quote?.message || 'Finding your perfect companion is a journey of the heart, guided by excellence.'}"
                        </p>

                        <footer className="text-woof-gold text-xs font-bold tracking-wider uppercase">
                            — {quote?.author || 'WoofCircle Team'}
                        </footer>
                    </blockquote>
                </div>
            </div>

            <div className="flex h-full w-full flex-col items-center justify-center p-6 lg:p-12">
                <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full flex-col justify-center space-y-8 rounded-3xl border border-[#e8ded1] bg-white p-8 sm:p-10 shadow-xl duration-700 sm:w-[480px]">
                    <Link href={route('home')} className="relative z-20 mb-2 flex flex-col items-center gap-3 lg:hidden">
                        <img src={settings.site_logo_url || '/logo.svg'} alt={settings.site_name} className="h-10 w-auto object-contain" />
                        <div className="bg-woof-gold h-px w-8" />
                    </Link>

                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <h1 className="text-woof-charcoal text-2xl sm:text-3xl leading-tight font-extrabold tracking-tight uppercase"> {title} </h1>

                        <div className="flex items-center gap-3">
                            <div className="bg-[#e8ded1] hidden h-px flex-1 sm:block" />
                            <p className="text-woof-charcoal/60 text-xs font-medium tracking-wide text-balance"> {description} </p>
                        </div>
                    </div>
                    <div className="w-full"> {children} </div>

                    <p className="text-woof-charcoal/40 text-center text-[10px] leading-relaxed font-medium tracking-wider uppercase">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-woof-gold hover:underline transition-colors font-bold">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-woof-gold hover:underline transition-colors font-bold">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
