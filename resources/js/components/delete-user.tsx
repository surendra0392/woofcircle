import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Lock } from 'lucide-react'; // Components...
export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });
    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };
    const closeModal = () => {
        clearErrors();
        reset();
    };
    return (
        <div className="space-y-6">
            <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />

            <div className="space-y-4 rounded-none border border-red-100 bg-red-50 p-4">
                <div className="relative space-y-0.5 text-red-600">
                    <p className="font-medium">Warning</p> <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete account</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>

                        <DialogDescription>
                            Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password
                            to confirm you would like to permanently delete your account.
                        </DialogDescription>

                        <form className="space-y-6" onSubmit={deleteUser}>
                             <div className="grid gap-2">
                                 <Label htmlFor="password" className="sr-only">
                                     Password
                                 </Label>

                                 <div className="relative flex items-center">
                                     <Lock className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
                                     <Input
                                         id="password"
                                         type="password"
                                         name="password"
                                         ref={passwordInput}
                                         value={data.password}
                                         onChange={(e) => setData('password', e.target.value)}
                                         placeholder="Confirm password"
                                         autoComplete="current-password"
                                         className="block w-full pl-9 rounded-none border border-slate-200 focus-visible:ring-woof-gold focus-visible:border-woof-gold font-semibold text-sm"
                                     />
                                 </div>
                                 <InputError message={errors.password} />
                             </div>

                             <DialogFooter className="gap-2 sm:gap-0">
                                 <DialogClose asChild>
                                     <Button
                                         variant="secondary"
                                         onClick={closeModal}
                                         className="border border-slate-200 bg-transparent hover:bg-slate-50 text-woof-charcoal rounded-none font-black text-xs tracking-[0.2em] uppercase h-11 px-6 transition-colors"
                                     >
                                         Cancel
                                     </Button>
                                 </DialogClose>

                                 <Button
                                     variant="destructive"
                                     disabled={processing}
                                     asChild
                                     className="bg-red-600 hover:bg-red-700 text-white rounded-none font-black text-xs tracking-[0.2em] uppercase h-11 px-6 transition-all hover:scale-105 active:scale-95"
                                 >
                                     <button type="submit">Delete account</button>
                                 </Button>
                             </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
