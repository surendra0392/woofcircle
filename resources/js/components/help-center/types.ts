import React from 'react';

export interface Article {
    title: string;
    content: string;
}

export interface Category {
    title: string;
    desc: string;
    icon: React.ReactNode;
    articles: string[];
}

export interface PlatformStatus {
    label: string;
    status: string;
    color: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface OnboardingTask {
    icon?: React.ReactNode;
    task: string;
    desc?: string;
    completed: boolean;
    link: string;
}

export interface ResourceItem {
    title: string;
    type: string;
    desc?: string;
    size?: string;
    icon?: React.ReactNode;
}

export interface TrendingTopic {
    title: string;
    category: string;
}

export interface FaqItem {
    q: string;
    a: string;
}

export interface GlossaryItem {
    term: string;
    definition: string;
}

export interface ProtocolStep {
    title: string;
    desc: string;
    status?: string;
}

export interface Protocol {
    title: string;
    subtitle: string;
    image: string;
    steps: ProtocolStep[];
}

export interface Pathway {
    title: string;
    icon: React.ReactNode;
    steps: ProtocolStep[];
}

export type ProtocolType = 'settlement' | 'audit' | 'transport';

export type DiagnosticsRole = 'buyer' | 'breeder' | 'professional';

export interface DiagnosticsItem {
    id: string;
    label: string;
    issue: string;
    fix: string;
    action: string;
    link: string;
}

export type DiagnosticsData = Record<DiagnosticsRole, DiagnosticsItem[]>;

export interface InfrastructureFeature {
    title: string;
    icon: React.ReactNode;
    desc: string;
    specs: string[];
}

export interface TicketData {
    subject: string;
    category: string;
    priority: string;
    message: string;
    attachment: File | null;
}
