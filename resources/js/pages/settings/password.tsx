import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Password settings', href: '/settings/password' }];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs} title="Settings" subtitle="Manage your account preferences and credentials">
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                    <HeadingSmall title="Update Password" description="Ensure your account is using a secure, strong password" />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Current Password</Label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    type="password"
                                    className="block w-full pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                    autoComplete="current-password"
                                    placeholder="Enter your current password"
                                />
                            </div>
                            <InputError message={errors.current_password} className="mt-1" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">New Password</Label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    className="block w-full pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                    autoComplete="new-password"
                                    placeholder="Create a secure new password"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Confirm Password</Label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    className="block w-full pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                    autoComplete="new-password"
                                    placeholder="Re-type your new password"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                disabled={processing}
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 px-8 transition-all shadow-xs cursor-pointer"
                            >
                                Update Password
                            </Button>

                            {recentlySuccessful && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Password Updated
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
