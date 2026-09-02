import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
} & Record<string, any>;
interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}
export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({ email: '', password: '', remember: false });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };
    return (
        <AuthLayout title="Sanctuary Login" description="Enter your credentials to access your sanctuary">
            <Head title="Login | WoofCircle" />

            {status && (
                <div className="bg-woof-cream border border-woof-gold/30 text-woof-charcoal animate-in fade-in slide-in-from-top-2 mb-6 rounded-2xl p-4 text-xs font-medium duration-500 shadow-2xs">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex w-full flex-col gap-6">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                            Registered Email
                        </Label>

                        <div className="group relative">
                            <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center">
                                <Mail className="text-woof-charcoal/30 group-focus-within:text-woof-gold size-4 transition-colors" />
                            </div>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium lowercase transition-all shadow-2xs"
                                autoComplete="username"
                                placeholder="name@example.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="ml-1 flex items-center justify-between">
                            <Label htmlFor="password" className="text-woof-charcoal/70 text-xs font-bold tracking-wider uppercase">
                                Password
                            </Label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-woof-gold hover:text-woof-charcoal text-xs font-bold transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        <div className="group relative">
                            <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center">
                                <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold size-4 transition-colors" />
                            </div>

                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pr-11 pl-11 text-sm font-medium transition-all shadow-2xs"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-woof-charcoal/40 hover:text-woof-gold absolute top-1/2 right-4 -translate-y-1/2 p-1 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>
                </div>

                <div className="ml-1 flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                        className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold h-4 w-4 rounded-md transition-all shadow-2xs"
                    />

                    <Label
                        htmlFor="remember"
                        className="text-woof-charcoal/70 cursor-pointer text-xs font-medium select-none"
                    >
                        Keep me authenticated
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-12 w-full rounded-full text-xs font-bold tracking-wider text-white uppercase transition-all shadow-md cursor-pointer"
                    disabled={processing}
                >
                    <span className="flex items-center justify-center gap-2">
                        {processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight className="size-4" />
                            </>
                        )}
                    </span>
                </Button>

                <div className="border-[#e8ded1] border-t pt-6 text-center">
                    <p className="text-woof-charcoal/60 text-xs font-medium">
                        New to the sanctuary?{' '}
                        <Link
                            href={route('register')}
                            className="text-woof-gold hover:text-woof-charcoal font-bold underline underline-offset-4 transition-colors"
                        >
                            Register a new account
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
const ArrowRight = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
    </svg>
);
