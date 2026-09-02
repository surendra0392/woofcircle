"use client";

import { Toaster as Sonner } from "sonner";
import * as React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-woof-charcoal group-[.toaster]:border-woof-charcoal/5 group-[.toaster]:shadow-2xl group-[.toaster]:p-6 font-sans group-[.toaster]:rounded-none',
                    description: 'group-[.toast]:text-woof-charcoal/50 font-medium ',
                    actionButton: 'group-[.toast]:bg-woof-charcoal group-[.toast]:text-white font-black uppercase text-[10px] tracking-widest',
                    cancelButton: 'group-[.toast]:bg-woof-cream group-[.toast]:text-woof-charcoal/50 font-black uppercase text-[10px] tracking-widest',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
