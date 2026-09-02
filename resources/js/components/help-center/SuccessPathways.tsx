import { pathways } from '@/data/help-center-data';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { DiagnosticsRole, OnboardingTask } from './types';

interface SuccessPathwaysProps {
    activePathway: DiagnosticsRole;
    setActivePathway: (role: DiagnosticsRole) => void;
    onboardingChecklist: OnboardingTask[];
    showTransparency: boolean;
    setShowTransparency: (show: boolean) => void;
}

export const SuccessPathways: React.FC<SuccessPathwaysProps> = ({
    activePathway,
    setActivePathway,
    onboardingChecklist,
    showTransparency,
    setShowTransparency,
}) => {
    return (
        <section className="bg-woof-charcoal relative overflow-hidden py-32">
            <div className="from-woof-gold/5 absolute inset-0 bg-gradient-to-br to-transparent" />
            <div className="container-wide relative z-10 px-6 lg:px-12">
                <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-2">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="text-woof-gold flex items-center gap-3">
                                <TrendingUp className="size-5" />
                                <span className="text-xs font-black tracking-[0.5em] uppercase">Success Roadmaps</span>
                            </div>
                            <h2 className="text-5xl leading-[1] font-black tracking-[0.01em] text-white uppercase">
                                Member <br />
                                <span className="text-woof-gold uppercase">Success Pathways.</span>
                            </h2>
                            <p className="text-md text-woof-on-dark-muted max-w-xl leading-[2] font-medium">
                                Select your role to view the verified sequence of actions required to master the sanctuary.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {(['buyer', 'breeder', 'professional'] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setActivePathway(role)}
                                    className={`group relative overflow-hidden border px-8 py-4 text-[10px] font-black tracking-widest uppercase transition-all ${activePathway === role ? 'bg-woof-gold border-woof-gold text-woof-charcoal shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                                >
                                    <span className="relative z-10">{role} —</span>
                                    {activePathway === role && (
                                        <div
                                            className="absolute inset-0 bg-white/20"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Onboarding Checklist Sidebar */}
                        <div className="space-y-6 border border-white/5 bg-white/5 p-8 backdrop-blur-md">
                            <div className="text-woof-gold flex items-center gap-3">
                                <CheckCircle2 className="size-4" />
                                <span className="text-xs font-black tracking-widest uppercase">Onboarding Checklist</span>
                            </div>
                            <div className="space-y-4">
                                {onboardingChecklist.map((item, i) => (
                                    <div key={i} className="group flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`size-4 border ${item.completed ? 'bg-woof-gold border-woof-gold' : 'border-white/20'} flex items-center justify-center`}
                                            >
                                                {item.completed && <CheckCircle2 className="text-woof-charcoal size-3" />}
                                            </div>
                                            <span
                                                className={`text-xs font-medium tracking-tight uppercase ${item.completed ? 'text-white/40 line-through' : 'text-white'}`}
                                            >
                                                {item.task}
                                            </span>
                                        </div>
                                        {!item.completed && (
                                            <Link
                                                href={item.link}
                                                className="text-woof-gold text-[10px] font-black tracking-widest uppercase opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                Complete →
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                                key={activePathway}
                                className="space-y-4"
                            >
                                {pathways[activePathway].steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="group relative overflow-hidden border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white hover:bg-white"
                                    >
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-woof-gold group-hover:text-woof-charcoal/40 text-xs font-black tracking-[0.3em] uppercase transition-colors">
                                                        Step 0{i + 1}
                                                    </span>
                                                    <div className="bg-woof-gold/20 group-hover:bg-woof-charcoal/10 h-px w-12 transition-colors" />
                                                    <span className="text-woof-gold text-xs font-black tracking-[0.3em] uppercase">
                                                        {step.status}
                                                    </span>
                                                </div>
                                                <h4 className="group-hover:text-woof-charcoal text-2xl font-black tracking-[0.03em] text-white uppercase transition-colors">
                                                    {step.title}
                                                </h4>
                                                <p className="text-woof-on-dark-muted group-hover:text-woof-charcoal/60 max-w-sm text-sm leading-relaxed font-medium transition-colors">
                                                    {step.desc}
                                                </p>
                                            </div>
                                            <div className="text-woof-gold group-hover:bg-woof-charcoal flex size-12 items-center justify-center bg-white/5 transition-all">
                                                {i === 3 ? <Zap className="size-5" /> : <ChevronRight className="size-5" />}
                                            </div>
                                        </div>
                                        {/* Micro-animation background element */}
                                        <div className="bg-woof-gold/10 group-hover:bg-woof-charcoal/5 absolute -right-4 -bottom-4 size-24 rounded-none blur-3xl transition-all" />
                                    </div>
                                ))}
                            </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border border-white/5 bg-white/5 p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`size-2 animate-pulse rounded-none ${showTransparency ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">
                                Live Transparency Engine {showTransparency ? 'Active' : 'Standby'}
                            </span>
                        </div>
                        <div className="hidden h-4 w-px bg-white/10 sm:block" />
                        <span className="hidden text-[10px] font-bold tracking-widest text-white/50 uppercase sm:block">
                            "Actionable roadmaps replacing static documentation."
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setShowTransparency(!showTransparency)}
                            className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase transition-colors hover:text-white"
                        >
                            {showTransparency ? 'Disable Live Feed' : 'Enable Live Feed'}
                        </button>
                        <button className="text-woof-gold border-woof-gold border-b pb-1 text-[10px] font-black tracking-[0.3em] uppercase transition-colors hover:border-white hover:text-white">
                            View Full Transparency Report —
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
