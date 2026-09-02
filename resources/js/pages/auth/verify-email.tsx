import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, LogOut, Send } from 'lucide-react';
import { FormEventHandler } from 'react';
export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };
    return (
        <AuthLayout title="Verify Identity" description="Authorize your registry email to access the sanctuary">
            <Head title="Email Verification | WoofCircle" />

            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
                <div className="text-woof-charcoal/70 bg-woof-cream border border-[#e8ded1] rounded-2xl p-5 text-xs leading-relaxed font-normal shadow-2xs">
                    Verification is the standard of excellence. Please check your inbox for the authorization link we just sent.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="bg-woof-cream border border-woof-gold/30 text-woof-charcoal animate-in fade-in slide-in-from-top-2 rounded-2xl p-4 text-xs font-medium duration-500 shadow-2xs">
                        A new authorization link has been transmitted to your email address.
                    </div>
                )}

                <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-6 lg:mx-0">
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
                                    Resend Verification Email <Send className="size-4" />
                                </>
                            )}
                        </span>
                    </Button>

                    <div className="border-[#e8ded1] flex items-center justify-between border-t pt-6">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-woof-charcoal/60 hover:text-woof-charcoal flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                        >
                            <LogOut className="size-4 text-woof-gold" /> Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
