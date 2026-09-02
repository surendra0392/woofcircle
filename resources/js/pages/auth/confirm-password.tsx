import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, LoaderCircle, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';
export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };
    return (
        <AuthLayout title="Verify Security Key" description="Entering a high-security sector. Please re-authorize your presence.">
            <Head title="Security Verification | WoofCircle" />

            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
                <div className="text-woof-charcoal/70 bg-woof-cream border border-[#e8ded1] rounded-2xl p-5 text-xs leading-relaxed font-normal shadow-2xs">
                    Privacy is the ultimate luxury. Confirm your credentials to proceed into the secure sector.
                </div>

                <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-6 lg:mx-0">
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                Password
                            </Label>

                            <div className="group relative">
                                <div className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center">
                                    <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold size-4 transition-colors" />
                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium transition-all shadow-2xs"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} />
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
                                    Confirm Password <ArrowRight className="size-4" />
                                </>
                            )}
                        </span>
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
