import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Dog,
    Eye,
    EyeOff,
    GraduationCap,
    Home,
    LoaderCircle,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    Star,
    Stethoscope,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
interface RegisterForm {
    name: string;
    email: string;
    mobile_number: string;
    password: string;
    password_confirmation: string;
    roles: number[];
    terms_accepted: boolean;
    [key: string]: any;
}
interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
}
export default function Register({ roles }: { roles: Role[] }) {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm<RegisterForm>({
        name: '',
        email: '',
        mobile_number: '',
        password: '',
        password_confirmation: '',
        roles: [],
        terms_accepted: false,
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (step === 1) {
            nextStep();
            return;
        }
        if (!data.terms_accepted) {
            setError('terms_accepted', 'You must agree to the terms and conditions');
            return;
        }
        if (data.roles.length === 0) {
            setError('roles', 'Please select at least one role');
            return;
        }
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };
    const toggleRole = (roleId: number) => {
        const currentRoles = [...data.roles];
        const index = currentRoles.indexOf(roleId);
        if (index === -1) {
            currentRoles.push(roleId);
        } else {
            currentRoles.splice(index, 1);
        }
        setData('roles', currentRoles);
    };
    const nextStep = () => {
        clearErrors();
        let hasErrors = false;
        if (!data.name.trim()) {
            setError('name', 'Please enter your full name');
            hasErrors = true;
        }
        if (!data.email.trim()) {
            setError('email', 'Email address is required');
            hasErrors = true;
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            setError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        if (!data.mobile_number.trim()) {
            setError('mobile_number', 'Mobile number is required');
            hasErrors = true;
        } else if (data.mobile_number.length !== 10) {
            setError('mobile_number', 'Please enter a valid 10-digit mobile number');
            hasErrors = true;
        }
        if (!data.password) {
            setError('password', 'Password is required');
            hasErrors = true;
        } else if (data.password.length < 8) {
            setError('password', 'Password must be at least 8 characters');
            hasErrors = true;
        }
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Passwords do not match');
            hasErrors = true;
        }
        if (!hasErrors) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const prevStep = () => {
        setStep(1);
        clearErrors();
    };
    const getRoleIcon = (slug: string) => {
        switch (slug) {
            case 'user':
                return <Users className="size-4" />;
            case 'breeder':
                return <Dog className="size-4" />;
            case 'vet':
                return <Stethoscope className="size-4" />;
            case 'trainer':
                return <GraduationCap className="size-4" />;
            case 'boarding':
                return <Home className="size-4" />;
            case 'welfare':
                return <ShieldCheck className="size-4" />;
            case 'stud-service-provider':
                return <Star className="size-4" />;
            default:
                return <User className="size-4" />;
        }
    };
    const stepTitle = step === 1 ? 'Create an account' : 'Complete your profile';
    const stepDescription = step === 1 ? 'Enter your basic details to get started' : 'Tell us more about your role in the WoofCircle community';
    return (
        <AuthLayout title={stepTitle} description={stepDescription} maxWidth="max-w-xl">
            <Head title="Register" />            {/* Progress Indicator */}
            <div className="mb-8 flex flex-col gap-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-woof-gold' : 'bg-[#e8ded1]'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === 2 ? 'bg-woof-gold' : 'bg-[#e8ded1]'}`} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-woof-gold text-[10px] font-bold tracking-wider uppercase">
                        Step 0{step} <span className="text-woof-charcoal/30 mx-1">/</span> 02
                    </span>

                    <span className="text-woof-charcoal/50 text-[10px] font-semibold tracking-wider uppercase">
                        {step === 1 ? 'Basic Information' : 'Select Roles'}
                    </span>
                </div>
            </div>
            <form className="flex w-full flex-col gap-6" onSubmit={submit}>
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-right-4 grid gap-5 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                Full Name
                            </Label>

                            <div className="group relative">
                                <User className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g. John Doe"
                                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                Email Address
                            </Label>

                            <div className="group relative">
                                <Mail className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="john@example.com"
                                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-11 text-sm font-medium lowercase transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="mobile_number" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                Mobile Number
                            </Label>

                            <div className="group relative">
                                <div className="absolute top-0 bottom-0 left-0 flex w-12 items-center justify-center border-r border-[#e8ded1] bg-woof-cream/60 rounded-l-2xl text-xs font-bold text-woof-charcoal/60">+91</div>

                                <Input
                                    id="mobile_number"
                                    type="tel"
                                    required
                                    value={data.mobile_number}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        val = val.substring(0, 10);
                                        setData('mobile_number', val);
                                    }}
                                    disabled={processing}
                                    placeholder="9876543210"
                                    className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pl-15 text-sm font-medium transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.mobile_number} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase">
                                    Password
                                </Label>

                                <div className="group relative">
                                    <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pr-10 pl-11 text-sm font-medium transition-all shadow-2xs"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-woof-charcoal/40 hover:text-woof-gold absolute top-1/2 right-3 -translate-y-1/2 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-woof-charcoal/70 ml-1 text-xs font-bold tracking-wider uppercase"
                                >
                                    Confirm
                                </Label>

                                <div className="group relative">
                                    <Lock className="text-woof-charcoal/30 group-focus-within:text-woof-gold absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />

                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="border-[#e8ded1] focus:border-woof-gold focus:ring-woof-gold/20 placeholder:text-woof-charcoal/30 h-12 rounded-2xl bg-white pr-10 pl-11 text-sm font-medium transition-all shadow-2xs"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-woof-charcoal/40 hover:text-woof-gold absolute top-1/2 right-3 -translate-y-1/2 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={nextStep}
                            className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-12 rounded-full text-xs font-bold tracking-wider text-white uppercase transition-all shadow-md cursor-pointer"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Continue to Role Selection <ArrowRight className="size-4" />
                            </span>
                        </Button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 grid gap-6 duration-500">
                        <div className="grid gap-3">
                            <Label className="ml-1 flex items-center justify-between text-xs font-bold tracking-wider uppercase text-woof-charcoal/70">
                                Select Your Role(s) <span className="text-woof-gold text-[10px] font-bold">At least 1 required</span>
                            </Label>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => toggleRole(role.id)}
                                        className={`group relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-300 shadow-2xs cursor-pointer ${data.roles.includes(role.id) ? 'border-woof-gold bg-woof-gold/10 shadow-xs' : 'border-[#e8ded1] bg-white hover:border-woof-gold/40'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${data.roles.includes(role.id) ? 'bg-woof-gold text-white' : 'bg-woof-cream text-woof-charcoal/60'}`}
                                            >
                                                {getRoleIcon(role.slug)}
                                            </div>
                                            {data.roles.includes(role.id) && <div className="bg-woof-gold size-2 rounded-full animate-pulse" />}
                                        </div>

                                        <div className="flex flex-col">
                                            <span
                                                className={`text-xs font-bold tracking-wide uppercase ${data.roles.includes(role.id) ? 'text-woof-gold' : 'text-woof-charcoal'}`}
                                            >
                                                {role.name}
                                            </span>

                                            <span className="mt-1 text-[10px] leading-tight font-medium text-woof-charcoal/60">
                                                {role.description}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.roles} />
                        </div>

                        <div className="grid gap-3">
                            <div className="border-[#e8ded1] bg-white group hover:border-woof-gold/40 flex items-start space-x-3 rounded-2xl border p-4 transition-all shadow-2xs">
                                <Checkbox
                                    id="terms_accepted"
                                    checked={data.terms_accepted}
                                    onCheckedChange={(checked) => setData('terms_accepted', !!checked)}
                                    className="border-[#e8ded1] data-[state=checked]:bg-woof-gold data-[state=checked]:border-woof-gold mt-0.5 h-4 w-4 rounded-md"
                                />

                                <div className="grid gap-1 leading-none">
                                    <Label
                                        htmlFor="terms_accepted"
                                        className="group-hover:text-woof-gold cursor-pointer text-xs font-bold tracking-wider uppercase transition-colors"
                                    >
                                        Authorize Terms & Guidelines
                                    </Label>

                                    <p className="text-woof-charcoal/60 text-xs leading-relaxed font-normal">
                                        I certify alignment with the{' '}
                                        <TextLink href={route('terms-and-ethics')} className="text-woof-gold font-semibold underline underline-offset-2">
                                            Terms of Service
                                        </TextLink>{' '}
                                        and{' '}
                                        <TextLink href={route('privacy-policy')} className="text-woof-gold font-semibold underline underline-offset-2">
                                            Privacy Policy
                                        </TextLink>
                                        .
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.terms_accepted} />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="border-[#e8ded1] hover:bg-woof-cream h-12 flex-1 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-2xs cursor-pointer"
                            >
                                <ArrowLeft className="mr-2 size-4" /> Back
                            </Button>

                            <Button
                                type="submit"
                                className="bg-woof-charcoal hover:bg-woof-gold hover:text-woof-charcoal h-12 flex-[2] rounded-full text-xs font-bold tracking-wider text-white uppercase transition-all shadow-md cursor-pointer"
                                disabled={processing}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {processing ? (
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" /> Complete Registration
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>
                )}

                <div className="border-[#e8ded1] border-t pt-6 text-center">
                    <p className="text-woof-charcoal/60 text-xs font-medium">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="text-woof-gold hover:text-woof-charcoal font-bold underline underline-offset-4 transition-colors"
                        >
                            Sign in here.
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
