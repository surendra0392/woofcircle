import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AdminAuthLayout from '@/layouts/admin/admin-auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface AdminLoginForm {
    email: string;
    password: string;
    remember?: boolean;
    [key: string]: any;
}

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<AdminLoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AdminAuthLayout 
            title="Authority Sign In" 
            description="Enter authenticated credentials to access platform controls."
            heading={<>Woof Circle <br /> Master Console</>}
            subheading="Restricted administrative environment. Authenticate to manage platform registries, audit trails, and core telemetry."
        >
            <Head title="Admin Sign In" />
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-4 text-xs">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal">
                            Administrative Email
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
                                placeholder="admin@woofcircle.com"
                                className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pl-10 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 placeholder:text-woof-charcoal/30 shadow-2xs"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-woof-charcoal">
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
                                className="h-11 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] pr-10 pl-10 text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20 placeholder:text-woof-charcoal/30 shadow-2xs"
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
                            Keep session authenticated
                        </Label>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={processing}
                    className="h-11 w-full rounded-full bg-woof-charcoal hover:bg-woof-forest text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Authenticate Authority <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>
        </AdminAuthLayout>
    );
}
