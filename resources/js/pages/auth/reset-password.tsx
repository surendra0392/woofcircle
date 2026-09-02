import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';
interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: any;
}
export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };
    return (
        <AuthLayout title="Reset Security Key" description="Establish a new security key for your sanctuary account">
            <Head title="Reset Password | WoofCircle" />

            <form
                onSubmit={submit}
                className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-md flex-col gap-6 duration-700 lg:mx-0"
            >
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                            Registry Email
                        </Label>

                        <div className="group relative">
                            <Mail className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium transition-all shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                            New Password
                        </Label>

                        <div className="group relative">
                            <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium transition-all shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label
                            htmlFor="password_confirmation"
                            className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase"
                        >
                            Confirm Password
                        </Label>

                        <div className="group relative">
                            <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium transition-all shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>
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
                                Update Password <ArrowRight className="size-4" />
                            </>
                        )}
                    </span>
                </Button>
            </form>
        </AuthLayout>
    );
}
