import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import HrLayout from '@/layouts/HrLayout';
import SupportLayout from '@/layouts/SupportLayout';
import AgentLayout from '@/layouts/AgentLayout';
import { Head, useForm } from '@inertiajs/react';
import { User, Lock, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import InputError from '@/components/input-error';

export default function ProfilePage({ admin, portal = 'admin', states = [], cities = [] }: any) {
    const Layout = portal === 'hr' ? HrLayout : 
                   portal === 'support' ? SupportLayout : 
                   portal === 'agent' ? AgentLayout : 
                   AdminLayout;
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(admin?.avatar || null);

    const profileForm = useForm({
        name: admin?.name || '',
        email: admin?.email || '',
        avatar: null as File | null,
        state_id: admin?.state_id || '',
        city_id: admin?.city_id || '',
        _method: 'PUT' as const,
    });

    const filteredCities = cities.filter((city: any) => city.state_id === parseInt(profileForm.data.state_id) || !profileForm.data.state_id);

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updateRoute = portal === 'admin' ? route('admin.profile.update') : route(`${portal}.profile.update`);
        profileForm.post(updateRoute, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile details updated successfully');
            },
            onError: () => {
                toast.error('Failed to update profile details');
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const passwordRoute = portal === 'admin' ? route('admin.profile.password.update') : route(`${portal}.profile.password.update`);
        passwordForm.put(passwordRoute, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Security password updated successfully');
                passwordForm.reset();
            },
            onError: () => {
                toast.error('Failed to update password');
            }
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Layout title="Profile & Security">
            <Head title="Profile & Security" />
            <div className="mx-auto max-w-full space-y-6">
                {/* Header Identity */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Console Identity</h2>
                        <p className="text-xs text-woof-charcoal/60">Manage your identity profiles and security credentials</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT CARD: Profile Info */}
                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#f0e8dc] pb-4">
                            <User className="h-4 w-4 text-woof-gold" />
                            <h3 className="text-sm font-bold text-woof-charcoal">Profile Details</h3>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            {/* Avatar Upload */}
                            <div className="flex items-center gap-5">
                                <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full ring-4 ring-[#fcfbf9] bg-[#fcfbf9] flex items-center justify-center border border-[#e8ded1] shadow-2xs">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-woof-gold">
                                            {profileForm.data.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal block">Avatar Photo</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="h-9 rounded-full border-[#e8ded1] bg-[#fcfbf9] hover:bg-white text-woof-charcoal text-xs font-bold transition-all flex items-center gap-2"
                                    >
                                        <Upload className="h-3.5 w-3.5" /> Upload File
                                    </Button>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    {profileForm.errors.avatar && <InputError message={profileForm.errors.avatar} />}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Console Name</Label>
                                <Input
                                    value={profileForm.data.name}
                                    onChange={e => profileForm.setData('name', e.target.value)}
                                    placeholder="Enter name"
                                    className="border-[#e8ded1] bg-[#fcfbf9] h-10 rounded-2xl text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {profileForm.errors.name && <InputError message={profileForm.errors.name} />}
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Administrative Email</Label>
                                <Input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={e => profileForm.setData('email', e.target.value)}
                                    placeholder="Enter email"
                                    className="border-[#e8ded1] bg-[#fcfbf9] h-10 rounded-2xl text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {profileForm.errors.email && <InputError message={profileForm.errors.email} />}
                            </div>

                            {/* Location Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">State</Label>
                                    <select
                                        value={profileForm.data.state_id}
                                        disabled={true}
                                        className="w-full h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal/50 shadow-2xs opacity-70 cursor-not-allowed px-3"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state: any) => (
                                            <option key={state.id} value={state.id}>{state.name}</option>
                                        ))}
                                    </select>
                                    {profileForm.errors.state_id && <InputError message={profileForm.errors.state_id} />}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-woof-charcoal">City</Label>
                                    <select
                                        value={profileForm.data.city_id}
                                        disabled={true}
                                        className="w-full h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal/50 shadow-2xs opacity-70 cursor-not-allowed px-3"
                                    >
                                        <option value="">Select City</option>
                                        {filteredCities.map((city: any) => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                    {profileForm.errors.city_id && <InputError message={profileForm.errors.city_id} />}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="bg-woof-charcoal hover:bg-woof-forest text-white rounded-full text-xs font-bold h-10 px-6 shadow-xs transition-all flex items-center justify-center"
                                >
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT CARD: Update Password */}
                    <div id="password" className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#f0e8dc] pb-4">
                            <Lock className="h-4 w-4 text-woof-gold" />
                            <h3 className="text-sm font-bold text-woof-charcoal">Security Credentials</h3>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            {/* Current Password */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Current Password</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={e => passwordForm.setData('current_password', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-[#e8ded1] bg-[#fcfbf9] h-10 rounded-2xl text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {passwordForm.errors.current_password && <InputError message={passwordForm.errors.current_password} />}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">New Password</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={e => passwordForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-[#e8ded1] bg-[#fcfbf9] h-10 rounded-2xl text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {passwordForm.errors.password && <InputError message={passwordForm.errors.password} />}
                            </div>

                            {/* Password Confirmation */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-woof-charcoal">Confirm New Password</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-[#e8ded1] bg-[#fcfbf9] h-10 rounded-2xl text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                                />
                                {passwordForm.errors.password_confirmation && <InputError message={passwordForm.errors.password_confirmation} />}
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="bg-woof-charcoal hover:bg-woof-forest text-white rounded-full text-xs font-bold h-10 px-6 shadow-xs transition-all flex items-center justify-center"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
