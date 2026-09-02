import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PortalAuthLayout from '@/layouts/portal-auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface AgentLoginForm {
    email: string;
    password: string;
    remember?: boolean;
    [key: string]: any;
}

export default function AgentLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<AgentLoginForm>({ 
        email: '', 
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/agent/login', { onFinish: () => reset('password') });
    };

    return (
        <PortalAuthLayout
            title="Field Agent Sign In"
            description="Authenticate with your registered field credentials."
            portalName="Field Agent"
            heading={<>Woof Circle <br /> Field Operations</>}
            subheading="Restricted operations terminal. Authenticate to access onboarding utilities, field CRM, and earnings records."
        >
            <Head title="Agent Sign In" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4 text-xs">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-woof-charcoal text-xs font-bold">
                            Agent Email Address
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
                                placeholder="agent@woofcircle.com"
                                className="border-[#e8ded1] focus:border-woof-gold focus:ring-2 focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-11 rounded-2xl bg-[#fcfbf9] pl-10 text-xs text-woof-charcoal transition-all font-medium shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-woof-charcoal text-xs font-bold">
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
                            Remember field terminal
                        </Label>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-woof-charcoal hover:bg-woof-forest text-white h-11 w-full rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 mt-1 shadow-xs cursor-pointer"
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Authenticate Field Terminal <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>
        </PortalAuthLayout>
    );
}
