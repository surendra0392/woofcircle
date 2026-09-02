import { diagnostics } from '@/data/help-center-data';
import { Link } from '@inertiajs/react';
import { Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import React from 'react';
import { DiagnosticsRole } from './types';

interface DiagnosticsHubProps {
    diagRole: DiagnosticsRole | null;
    diagIssue: string | null;
    setDiagRole: (role: DiagnosticsRole | null) => void;
    setDiagIssue: (issue: string | null) => void;
    setIsChatOpen: (isOpen: boolean) => void;
}

export const DiagnosticsHub: React.FC<DiagnosticsHubProps> = ({ diagRole, diagIssue, setDiagRole, setDiagIssue, setIsChatOpen }) => {
    const currentDiag = diagRole && diagIssue ? diagnostics[diagRole].find((d) => d.id === diagIssue) : null;

    return (
        <section className="bg-woof-charcoal overflow-hidden border-b border-white/5 py-24">
            <div className="container-wide px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
                    <div className="space-y-12">
                        <div
                            className="space-y-6"
                        >
                            <div className="text-woof-gold flex items-center gap-3">
                                <AlertTriangle className="size-5" />
                                <span className="text-xs font-black tracking-[0.5em] uppercase">Diagnostics Hub</span>
                            </div>
                            <h2 className="text-5xl leading-[1] font-black tracking-[0.01em] text-white uppercase">
                                Smart <br />
                                <span className="text-woof-gold uppercase">Troubleshooter.</span>
                            </h2>
                            <p className="text-md text-woof-on-dark-muted max-w-xl leading-[2] font-medium">
                                Skip the search. Select your role and symptoms to receive immediate platform-level solutions and direct intervention
                                paths.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-1 border border-white/10 bg-white/5 p-1">
                                {(['buyer', 'breeder', 'professional'] as const).map((role) => (
                                    <button
                                        key={role}
                                        className={`py-6 text-[10px] font-black tracking-widest uppercase transition-all ${
                                            diagRole === role ? 'bg-woof-gold text-woof-charcoal' : 'text-white/40 hover:text-white'
                                        }`}
                                        onClick={() => {
                                            setDiagRole(role);
                                            setDiagIssue(null);
                                        }}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>

                            {diagRole && (
                                    <div
                                        key={diagRole}
                                        className="grid grid-cols-1 gap-3"
                                    >
                                        {diagnostics[diagRole].map((diag) => (
                                            <button
                                                key={diag.id}
                                                className={`group border p-6 text-left transition-all ${
                                                    diagIssue === diag.id
                                                        ? 'bg-woof-gold border-woof-gold'
                                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                                }`}
                                                onClick={() => setDiagIssue(diag.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`text-[11px] font-black tracking-widest uppercase ${
                                                            diagIssue === diag.id ? 'text-woof-charcoal' : 'text-white/80'
                                                        }`}
                                                    >
                                                        {diag.label}
                                                    </span>
                                                    <ChevronRight
                                                        className={`size-4 ${
                                                            diagIssue === diag.id
                                                                ? 'text-woof-charcoal'
                                                                : 'text-woof-gold transition-transform group-hover:translate-x-1'
                                                        }`}
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="border-woof-gold/10 absolute -inset-4 -z-10 border"></div>
                        <div className="relative flex min-h-[450px] flex-col justify-center overflow-hidden border border-white/10 bg-white/5 p-10 lg:p-12">
                            {diagIssue && diagRole && currentDiag ? (
                                    <div
                                        key={diagIssue}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-woof-gold size-2"></div>
                                                <span className="text-woof-gold text-[10px] font-black tracking-[0.4em] uppercase">
                                                    Recommended Solution
                                                </span>
                                            </div>
                                            <h3 className="text-4xl leading-[1.2] font-black tracking-[0.01em] text-white uppercase">
                                                {currentDiag.issue}
                                            </h3>
                                        </div>
                                        <p className="text-woof-on-dark-muted text-md leading-[2] font-medium">{currentDiag.fix}</p>
                                        <div className="flex flex-wrap gap-6 border-t border-white/10 pt-8">
                                            <Link
                                                href={currentDiag.link}
                                                className="bg-woof-gold text-woof-charcoal shadow-woof-gold/20 px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg transition-all hover:bg-white"
                                            >
                                                {currentDiag.action} —
                                            </Link>
                                            <button
                                                onClick={() => setIsChatOpen(true)}
                                                className="border border-white/20 px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase backdrop-blur-sm transition-all hover:bg-white/10"
                                            >
                                                Still Stuck? Speak to Human
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key="placeholder"
                                        className="group absolute inset-0 overflow-hidden"
                                    >
                                        <img
                                            src="/images/cinematic/diagnostics_placeholder.png"
                                            className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                                            alt="Diagnostics Engine"
                                        />
                                        <div className="from-woof-charcoal via-woof-charcoal/40 absolute inset-0 bg-gradient-to-t to-transparent"></div>
                                        <div className="relative flex h-full flex-col items-center justify-center space-y-6 p-12 text-center">
                                            <div className="border-woof-gold/20 bg-woof-charcoal/40 flex size-24 items-center justify-center border backdrop-blur-sm">
                                                <Activity className="text-woof-gold size-10 animate-pulse" />
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-3xl font-black tracking-tighter text-white uppercase">Diagnostics Ready</p>
                                                <p className="text-woof-on-dark-subtle mx-auto max-w-[280px] text-[10px] leading-relaxed font-black tracking-[0.3em] uppercase">
                                                    Select a problem area on the left to initiate <br />
                                                    <span className="text-woof-gold">real-time intervention protocols</span>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
