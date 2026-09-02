import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Image as ImageIcon, ShieldCheck, ShieldOff, Upload } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface Setting {
    id: number;
    key: string;
    label: string;
    value: string;
    type: 'text' | 'textarea' | 'image' | 'email' | 'boolean';
    group: string;
}

interface PageProps {
    groupedSettings: Record<string, Setting[]>;
}

export default function SettingsPage({ groupedSettings }: PageProps) {
    // Flatten settings to build initial form data
    const initialData: Record<string, any> = {
        _method: 'put'
    };
    Object.values(groupedSettings || {}).forEach(group => {
        group.forEach(setting => {
            initialData[`settings[${setting.key}]`] = setting.type === 'image' ? null : (setting.value || (setting.type === 'boolean' ? '0' : ''));
        });
    });

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm(initialData);
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const [draggingKey, setDraggingKey] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        clearErrors();

        // Validate phone number
        if (data['settings[contact_phone]']) {
            const phoneStr = data['settings[contact_phone]'];
            const digits = phoneStr.replace(/\D/g, '');
            if (digits.length > 0 && digits.length < 10) {
                setError('settings[contact_phone]', 'Phone number must be at least 10 digits.');
                toast.error('Failed to save settings. Phone number must be at least 10 digits.');
                return;
            }
        }

        post(route('admin.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Settings saved successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to save settings. Please check the form for errors.');
            }
        });
    };

    const handleImageChange = (key: string, file: File | null) => {
        setData(`settings[${key}]`, file as never);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => ({ ...prev, [key]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        } else {
            const newPreviews = { ...imagePreviews };
            delete newPreviews[key];
            setImagePreviews(newPreviews);
        }
    };

    const handleDragOver = (e: React.DragEvent, key: string) => {
        e.preventDefault();
        setDraggingKey(key);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingKey(null);
    };

    const handleDrop = (e: React.DragEvent, key: string) => {
        e.preventDefault();
        setDraggingKey(null);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange(key, file);
        }
    };

    const triggerFileInput = (key: string) => {
        const inputEl = document.getElementById(`file-input-${key}`) as HTMLInputElement | null;
        if (inputEl) {
            inputEl.click();
        }
    };

    return (
        <AdminLayout title="Platform Settings">
            <Head title="Settings" />
            <div className="mx-auto max-w-full space-y-6">
                
                {/* Header Identity */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Platform Settings</h2>
                        <p className="text-xs text-woof-charcoal/60">Configure global site parameters, system branding, logos, and contact details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(groupedSettings || {}).length > 0 && (
                        <Tabs defaultValue={Object.keys(groupedSettings)[0]} className="w-full">
                            <div className="overflow-x-auto pb-3">
                                <TabsList>
                                    {Object.keys(groupedSettings).map((groupName) => (
                                        <TabsTrigger
                                            key={groupName}
                                            value={groupName}
                                        >
                                            {groupName}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {Object.entries(groupedSettings || {}).map(([groupName, groupSettings]) => (
                                <TabsContent key={groupName} value={groupName} className="mt-6 outline-none focus:outline-none">
                                    <div className="rounded-3xl border border-[#e8ded1] bg-white p-6 sm:p-8 shadow-xs">
                                        <h3 className="mb-6 border-b border-[#f0e8dc] pb-4 text-sm font-bold text-woof-charcoal">
                                            {groupName} Settings
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {groupSettings.map((setting) => (
                                                <div key={setting.id} className={`space-y-1.5 ${setting.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                                                    <Label htmlFor={setting.key} className="text-xs font-bold text-woof-charcoal">
                                                        {setting.label}
                                                    </Label>
                                                    
                                                    {setting.type === 'text' || setting.type === 'email' ? (
                                                        <Input
                                                            id={setting.key}
                                                            type={setting.type}
                                                            value={data[`settings[${setting.key}]`] || ''}
                                                            onChange={(e) => {
                                                                if (setting.key === 'contact_phone') {
                                                                    const val = e.target.value;
                                                                    if (!val) {
                                                                        setData(`settings[${setting.key}]`, '');
                                                                        return;
                                                                    }
                                                                    let digits = val.replace(/\D/g, '');
                                                                    digits = digits.substring(0, 15);
                                                                    setData(`settings[${setting.key}]`, digits);
                                                                } else {
                                                                    setData(`settings[${setting.key}]`, e.target.value);
                                                                }
                                                            }}
                                                            className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20 font-medium"
                                                        />
                                                    ) : setting.type === 'textarea' ? (
                                                        <Textarea
                                                            id={setting.key}
                                                            value={data[`settings[${setting.key}]`] || ''}
                                                            onChange={(e) => setData(`settings[${setting.key}]`, e.target.value)}
                                                            rows={4}
                                                            className="rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal focus-visible:ring-woof-gold/20 resize-none p-3.5"
                                                        />
                                                    ) : setting.type === 'boolean' ? (
                                                        <div className="flex items-center gap-4 pt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setData(`settings[${setting.key}]`, data[`settings[${setting.key}]`] === '1' ? '0' : '1')}
                                                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-300 focus:outline-none ${
                                                                    data[`settings[${setting.key}]`] === '1'
                                                                        ? 'border-emerald-600 bg-emerald-600'
                                                                        : 'border-[#e8ded1] bg-[#f0e8dc]'
                                                                }`}
                                                                role="switch"
                                                                aria-checked={data[`settings[${setting.key}]`] === '1'}
                                                            >
                                                                <span
                                                                    className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 bg-white shadow-xs ${
                                                                        data[`settings[${setting.key}]`] === '1'
                                                                            ? 'translate-x-[22px]'
                                                                            : 'translate-x-[3px]'
                                                                    }`}
                                                                />
                                                            </button>
                                                            <span className={`text-xs font-bold ${
                                                                data[`settings[${setting.key}]`] === '1' ? 'text-emerald-700' : 'text-woof-charcoal/50'
                                                            }`}>
                                                                {data[`settings[${setting.key}]`] === '1' ? (
                                                                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Enabled</span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1.5"><ShieldOff className="h-4 w-4" /> Disabled</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : setting.type === 'image' ? (
                                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                                            <div 
                                                                className="h-24 w-24 shrink-0 border border-[#e8ded1] flex items-center justify-center overflow-hidden rounded-2xl bg-[#fcfbf9] shadow-2xs"
                                                            >
                                                                {imagePreviews[setting.key] ? (
                                                                    <img src={imagePreviews[setting.key]} alt={setting.label} className="h-full w-full object-contain p-2" />
                                                                ) : setting.value ? (
                                                                    <img src={setting.value} alt={setting.label} className="h-full w-full object-contain p-2" />
                                                                ) : (
                                                                    <ImageIcon className="h-8 w-8 text-woof-charcoal/30" />
                                                                )}
                                                            </div>

                                                            {/* Drag & Drop Upload Zone */}
                                                            <div
                                                                onDragOver={(e) => handleDragOver(e, setting.key)}
                                                                onDragLeave={handleDragLeave}
                                                                onDrop={(e) => handleDrop(e, setting.key)}
                                                                onClick={() => triggerFileInput(setting.key)}
                                                                className={`flex-1 w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center ${
                                                                    draggingKey === setting.key
                                                                        ? 'border-woof-gold bg-woof-gold/10'
                                                                        : 'border-[#e8ded1] bg-[#fcfbf9] hover:border-woof-gold hover:bg-[#fcfbf9]'
                                                                }`}
                                                            >
                                                                <Upload className={`h-5 w-5 mb-1.5 transition-colors ${draggingKey === setting.key ? 'text-woof-gold' : 'text-woof-charcoal/50'}`} />
                                                                <p className="text-xs font-bold text-woof-charcoal">
                                                                    Drag & drop image, or <span className="text-woof-gold underline">browse</span>
                                                                </p>
                                                                <p className="text-[10px] text-woof-charcoal/50 mt-0.5">Supports PNG, JPG, GIF (Max 2MB)</p>
                                                                <input
                                                                    id={`file-input-${setting.key}`}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(setting.key, e.target.files?.[0] || null)}
                                                                    className="hidden"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    
                                                    {errors[`settings[${setting.key}]`] && (
                                                        <p className="text-xs text-rose-500">{errors[`settings[${setting.key}]`]}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    )}

                    <div className="flex justify-end">
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="bg-woof-charcoal text-white hover:bg-woof-forest h-11 rounded-full px-8 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save All Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
