import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';
export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };
    return (
        <AuthLayout title="Recovery Portal" description="Enter your registry email to authorize a security key reset">
            <Head title="Forgot Password | WoofCircle" />

            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
                {status && (
                    <div className="bg-woof-cream border border-woof-gold/30 text-woof-charcoal animate-in fade-in slide-in-from-top-2 rounded-2xl p-4 text-xs font-medium duration-500 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-4 shrink-0 text-woof-gold" /> <span>{status}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-6 lg:mx-0">
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                Registry Email
                            </Label>

                            <div className="group relative">
                                <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center">
                                    <Mail className="text-woof-charcoal/30 group-focus-within:text-woof-gold size-4 transition-colors" />
                                </div>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium lowercase transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.email} />
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
                                    Send Password Reset Link <ArrowRight className="size-4" />
                                </>
                            )}
                        </span>
                    </Button>

                    <div className="border-[#e8ded1] border-t pt-6 text-center">
                        <p className="text-woof-charcoal/60 text-xs font-medium">
                            Return to sanctuary?{' '}
                            <TextLink
                                href={route('login')}
                                className="text-woof-gold hover:text-woof-charcoal font-bold underline underline-offset-4 transition-all"
                            >
                                Sign In here
                            </TextLink>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
