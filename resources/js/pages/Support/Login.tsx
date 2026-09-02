import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PortalAuthLayout from '@/layouts/portal-auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface SupportLoginForm {
    email: string;
    password: string;
    remember?: boolean;
    [key: string]: any;
}

export default function SupportLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<SupportLoginForm>({ 
        email: '', 
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/support/login', { onFinish: () => reset('password') });
    };

    return (
        <PortalAuthLayout
            title="Support Desk Portal"
            description="Enter your credentials to access the support desk."
            portalName="Support Desk Portal"
            heading={<>Woof Circle <br /> Support Operations</>}
            subheading="Restricted access. Authenticate to manage customer tickets, grievance escalations, and technical resolutions."
        >
            <Head title="Support Sign In" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4 text-xs">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                            Support Email Address
                        </Label>
                        <div className="group relative">
                            <Mail className="text-woof-charcoal/40 group-focus-within:text-woof-gold absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="support@woofcircle.com"
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-2 focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-11 rounded-2xl bg-[#fcfbf9] pl-10 text-xs text-woof-charcoal transition-all font-medium shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-woof-charcoal text-xs font-bold uppercase tracking-wider">
                            Security Passcode
                        </Label>
                        <div className="group relative">
                            <Lock className="text-woof-charcoal/40 group-focus-within:text-woof-gold absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••••••"
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-2 focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-11 rounded-2xl bg-[#fcfbf9] pr-10 pl-10 text-xs text-woof-charcoal transition-all font-medium shadow-2xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-woof-charcoal/40 hover:text-woof-gold absolute top-1/2 right-3.5 -translate-y-1/2 p-1 transition-colors cursor-pointer"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Checkbox */}
                    <div className="flex items-center space-x-2 pt-1">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold rounded-md"
                        />
                        <Label htmlFor="remember" className="text-xs font-medium text-woof-charcoal/70 cursor-pointer select-none">
                            Remember support session
                        </Label>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-woof-charcoal hover:bg-woof-forest text-white h-11 w-full rounded-full font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                    {processing ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <>
                            Authenticate Support Session <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>
        </PortalAuthLayout>
    );
}
