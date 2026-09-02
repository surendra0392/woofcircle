import DeleteUser from '@/components/delete-user';
import { PushNotificationToggle } from '@/components/ui/push-notification-toggle';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/dashboard/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Upload, X, User as UserIcon, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        mobile_number: (auth.user.mobile_number as string) || '',
        avatar: null as File | null,
        remove_avatar: false as boolean,
        _method: 'PATCH',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                avatar: file,
                remove_avatar: false,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setData((prev) => ({
            ...prev,
            avatar: null,
            remove_avatar: true,
        }));
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs} title="Settings" subtitle="Manage your account preferences and credentials">
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs space-y-6">
                        <HeadingSmall title="Profile Information" description="Update your personal details, avatar, and contact info" />

                        <form onSubmit={submit} className="space-y-6">
                            {/* Profile Avatar Upload */}
                            <div className="space-y-2 border-b border-[#e8ded1] pb-6">
                                <Label className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Profile Picture</Label>
                                <div className="flex items-center gap-6 mt-2">
                                    <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#e8ded1] bg-[#fcfbf9] flex items-center justify-center shrink-0 shadow-2xs">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                                        ) : auth.user.avatar_url ? (
                                            <img src={auth.user.avatar_url} alt={auth.user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-9 w-9 text-woof-gold/40" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-9 px-4 text-xs font-bold gap-1.5 rounded-full border-[#e8ded1] bg-[#fcfbf9] text-woof-charcoal hover:bg-white transition-colors"
                                            >
                                                <Upload className="h-3.5 w-3.5 text-woof-gold" /> Upload Image
                                            </Button>
                                            {(auth.user.avatar_url || data.avatar) && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleRemoveAvatar}
                                                    className="h-9 px-3 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold gap-1.5 rounded-full"
                                                >
                                                    <X className="h-3.5 w-3.5" /> Remove
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-woof-charcoal/50">JPG, PNG or WEBP. Max 2MB.</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <InputError className="mt-1" message={errors.avatar} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Full Name</Label>
                                <div className="relative flex items-center">
                                    <UserIcon className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                    <Input
                                        id="name"
                                        className="block w-full pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="e.g. Jane Doe"
                                    />
                                </div>
                                <InputError className="mt-1" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Email Address</Label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="block w-full pl-10 rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="e.g. jane@example.com"
                                    />
                                </div>
                                <InputError className="mt-1" message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mobile_number" className="text-xs font-bold text-woof-charcoal uppercase tracking-wider">Mobile Number</Label>
                                <div className="flex">
                                    <div className="flex items-center justify-center border border-r-0 border-[#e8ded1] bg-[#fcfbf9] px-3.5 text-xs text-woof-charcoal/60 rounded-l-2xl font-bold">
                                        +91
                                    </div>
                                    <div className="relative flex items-center flex-1">
                                        <Phone className="absolute left-3.5 size-4 text-woof-gold pointer-events-none" />
                                        <Input
                                            id="mobile_number"
                                            type="tel"
                                            className="block w-full pl-10 rounded-r-2xl rounded-l-none border border-[#e8ded1] bg-[#fcfbf9] focus-visible:ring-woof-gold font-medium text-xs text-woof-charcoal h-11"
                                            value={data.mobile_number}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, '');
                                                val = val.substring(0, 10);
                                                setData('mobile_number', val);
                                            }}
                                            required
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>
                                <InputError className="mt-1" message={errors.mobile_number} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-xs text-amber-900 font-medium">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-xs text-amber-800 underline font-bold hover:text-amber-950"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-xs font-bold text-emerald-700">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal text-white rounded-full font-bold text-xs h-11 px-8 transition-all shadow-xs cursor-pointer"
                                >
                                    Save Details
                                </Button>

                                {recentlySuccessful && (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Saved
                                    </div>
                                )}
                            </div>
                        </form>
                        
                        <div className="pt-6 border-t border-[#e8ded1]">
                            <PushNotificationToggle />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#e8ded1] p-6 sm:p-8 shadow-xs">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
