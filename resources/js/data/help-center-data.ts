import { Award, BookOpen, CreditCard, FileText, Heart, Layers, Shield, ShieldAlert, ShieldCheck, Star, UserCircle, Users } from 'lucide-react';
import React from 'react';
import {
    Category,
    DiagnosticsData,
    FaqItem,
    GlossaryItem,
    OnboardingTask,
    Pathway,
    PlatformStatus,
    Protocol,
    ResourceItem,
    TrendingTopic,
} from '../components/help-center/types';

export const categories: Category[] = [
    {
        icon: React.createElement(UserCircle, { className: 'size-6' }),
        title: 'The Basics',
        desc: 'Everything you need to master the platform from day one.',
        articles: ['Creating an Account', 'Identity Verification', 'Profile Setup', 'Privacy Settings'],
    },
    {
        icon: React.createElement(BookOpen, { className: 'size-6' }),
        title: 'Finding Excellence',
        desc: "A buyer's guide to identifying premium breeders and making secure reservations.",
        articles: ['Advanced Search Tips', 'Understanding Health Scores', 'The Reservation Flow', 'Visiting Kennels'],
    },
    {
        icon: React.createElement(ShieldCheck, { className: 'size-6' }),
        title: 'Professional Hub',
        desc: 'Specialized tools for Breeders, Vets, and Trainers to grow their presence.',
        articles: ['Listing Management', 'Verified Professional Status', 'Review Moderation', 'Booking System'],
    },
    {
        icon: React.createElement(CreditCard, { className: 'size-6' }),
        title: 'Financial Transparency',
        desc: 'Understand our Verified Settlement Protocol and secure milestone transfer systems.',
        articles: ['Verified Settlement Protocol', 'Transfer Milestones', 'Direct Payment Security', 'Fee Transparency'],
    },
    {
        icon: React.createElement(Heart, { className: 'size-6' }),
        title: 'Puppy Wellness',
        desc: 'Expert resources on post-adoption care, vaccinations, and training foundations.',
        articles: ['Vaccination Records', 'Dietary Guidelines', 'Early Socialization', 'Vet Connect'],
    },
    {
        icon: React.createElement(ShieldAlert, { className: 'size-6' }),
        title: 'Trust & Safety',
        desc: 'Reporting issues, understanding our Ethics Code, and staying safe.',
        articles: ['Reporting Fraud', 'The Breeder Audit', 'Dispute Resolution', 'Terms of Ethics'],
    },
];

export const diagnostics: DiagnosticsData = {
    buyer: [
        {
            id: 'pay',
            label: 'Payment & Settlement',
            issue: 'Transaction not appearing in VSP records',
            fix: "The Verified Settlement Protocol (VSP) logs transactions once milestone confirmations are cryptographically signed. Verification typically takes 30-60 minutes. Check your 'Settlement Pulse' in the Financials tab.",
            action: 'View Settlement Pulse',
            link: '/reservations',
        },
        {
            id: 'breed',
            label: 'Breeder Communication',
            issue: 'Breeder not responding after reservation',
            fix: 'Our automated pulse monitors all active threads. If a breeder is inactive for >24h, our Trust & Safety board triggers a mandatory check-in. Inactivity beyond 48h results in immediate digital signing authority revocation.',
            action: 'Alert Concierge',
            link: '/messages',
        },
        {
            id: 'health',
            label: 'Health Records',
            issue: 'Missing vaccination certifications',
            fix: "Handover is legally blocked until all certificates are cryptographically verified. Check the 'Genetic Audit' status for real-time verification of health markers against the national registry.",
            action: 'View Audit Progress',
            link: '/directory',
        },
    ],
    breeder: [
        {
            id: 'kyc',
            label: 'KYC & Verification',
            issue: 'Identity verification rejected',
            fix: '90% of rejections are due to metadata mismatch. Ensure your document is high-resolution with no cropped edges or glare. Biometric scans must match the government-issued ID exactly.',
            action: 'Resubmit Identity',
            link: '/settings/profile',
        },
        {
            id: 'listing',
            label: 'Listing Visibility',
            issue: 'Puppy not appearing in search',
            fix: 'Champion status is dynamic. Verify your Genetic Integrity score meets the 90%+ threshold and your kennel registration is current. Any pending audit flags will temporarily hide listings.',
            action: 'Audit Listing',
            link: '/marketplace',
        },
        {
            id: 'settlement',
            label: 'Settlement Milestones',
            issue: 'When will funds be transferred?',
            fix: 'Settlements are triggered immediately upon the digital execution of the Handover Certificate by both parties. VSP ensures direct, compliant peer-to-peer transfers within 24-48 hours of milestone completion.',
            action: 'View Transfer Timeline',
            link: '/reservations',
        },
    ],
    professional: [
        {
            id: 'vet',
            label: 'Vet Verifications',
            issue: 'Unable to sign health records',
            fix: 'Verify your national practitioner license is active and synchronized with our professional registry. Suspended licenses lose digital signing authority instantly within the sanctuary.',
            action: 'Verify License',
            link: '/settings/profile',
        },
    ],
};

export const protocols: Record<string, Protocol> = {
    settlement: {
        title: 'Verified Settlement',
        subtitle: 'Financial Transparency',
        image: '/images/cinematic/escrow.png',
        steps: [
            { title: 'Direct Intent', desc: "Transactions are initiated directly between members, logged on the sanctuary's immutable ledger." },
            { title: 'Milestone Lock', desc: 'Payment milestones are defined and verified against the Breeder Audit integrity threshold.' },
            { title: 'Handover Certificate', desc: 'Digital execution of the handover by both parties triggers the settlement finality.' },
            { title: 'Compliant Transfer', desc: 'Direct peer-to-peer settlement is completed within 48 hours of verified handover.' },
        ],
    },
    audit: {
        title: 'Breeder Audit',
        subtitle: 'Quality Assurance',
        image: '/images/cinematic/audit.png',
        steps: [
            {
                title: 'Genetic Scan',
                desc: 'We verify lineage and genetic health certificates against global DNA registries like the AKC and Kennel Club.',
            },
            {
                title: 'Video Walkthrough',
                desc: 'Mandatory live-video audits of kennel facilities to verify biosecurity, sanitation, and socialization standards.',
            },
            {
                title: 'Vet Board Sign-off',
                desc: "Our third-party veterinary board reviews and cryptographically signs off on every listing's medical history.",
            },
            {
                title: 'On-Site Verification',
                desc: 'Randomized physical audits conducted by regional field agents to ensure absolute ethical compliance.',
            },
        ],
    },
    transport: {
        title: 'Sanctuary Logistics',
        subtitle: 'Checkpoint Excellence',
        image: '/images/cinematic/transport.png',
        steps: [
            { title: 'Route Planning', desc: 'Transit routes are audited for animal safety and efficiency, avoiding high-stress environments.' },
            { title: 'Node Verification', desc: 'Mandatory human-verified check-ins at every sanctuary node, departure, and arrival point.' },
            { title: 'Live Node Reporting', desc: 'Status updates are logged at each checkpoint by certified handlers and veterinary escorts.' },
            {
                title: 'Handover Integrity',
                desc: 'Final verification at the destination node ensures the animal meets all health sanctuary standards.',
            },
        ],
    },
};

export const resources: ResourceItem[] = [
    { title: 'Standard Operating Procedures', type: 'Technical Spec', size: '2.4 MB', icon: React.createElement(FileText) },
    { title: 'Breeder Ethics Handbook', type: 'Ethical Code', size: '1.8 MB', icon: React.createElement(Award) },
    { title: 'Logistics Safety Protocol', type: 'SOP', size: '1.2 MB', icon: React.createElement(Shield) },
    { title: 'Genetic Screening Guide', type: 'Scientific', size: '3.1 MB', icon: React.createElement(Layers) },
];

export const articleContents: Record<string, string> = {
    'Creating an Account':
        "To create a WoofCircle account, initiate the registration protocol via the 'Secure Portal'. You can join as a Pet Owner or a Verified Professional. Professional accounts are subject to our 7-step audit process to maintain sanctuary integrity.",
    'Identity Verification':
        'We employ enterprise-grade biometric and document verification to ensure all members are authenticated. This process takes 5-10 minutes and requires government-issued credentials. Your data is encrypted and vaulted in compliance with global privacy standards.',
    'Profile Setup':
        'Your profile is your digital identity within the sanctuary. For Pet Owners, this tracks pet interests and health history. For Professionals, it serves as a verified portfolio, showcasing certifications, kennel standards, and genetic integrity scores.',
    'Privacy Settings':
        "You maintain total control over your digital footprint. Toggle visibility for location data, medical records, and active vault status from the 'Security & Privacy' module in your dashboard.",
    'Advanced Search Tips':
        'Filter the archives by Genetic Integrity scores, champion status, or specific health markers. Save your search telemetry to receive real-time alerts when puppies matching your rigorous criteria are listed.',
    'Understanding Health Scores':
        "The Genetic Integrity Score (0-100) is a quantitative metric derived from DNA testing, vaccination schedules, and board-certified veterinary sign-offs. A score of 90+ is mandatory for any listing designated as a 'Champion'.",
    'The Reservation Flow':
        "Reservations begin with a formal 'Handover Agreement'. Once the reservation fee is vaulted in the Escrow Shield, the breeder is legally and platform-bound to the transaction milestones.",
    'Visiting Kennels':
        "To ensure absolute biosecurity, WoofCircle mandates a 'Video-First' policy. High-definition video walkthroughs must be completed before physical site visits are authorized. This protocol protects the litter from external contaminants and ensures the breeder's focus remains on animal welfare.",
    'Listing Management':
        "Manage your litters with technical precision. Upload 4K visual assets, genetic certificates, and individual health passports. Monitor your 'Sanctuary Pulse' to track engagement and verification status.",
    'Verified Professional Status':
        'Professionals must pass our rigorous 7-step audit: Identity verification, Kennel registry check, Vet board reference, Site video audit, Peer review, Ethics commitment, and Genetic screening verification.',
    'Review Moderation':
        'Every review on the platform is a verified testimony. Reviews are only enabled after a successful Digital Handover, ensuring all feedback is based on real, platform-tracked transactions. Anonymous or unverified claims are filtered out by our integrity engine.',
    'Booking System':
        'Our intelligent booking engine manages schedules for Vets and Trainers. It synchronizes with your primary calendars and utilizes automated reminders to ensure high engagement and minimal missed milestones.',
    'Verified Settlement Protocol':
        'The Verified Settlement Protocol (VSP) ensures transparent, milestone-based direct transfers between members. Unlike traditional escrow, VSP facilitates direct settlements that are cryptographically triggered upon the execution of the Digital Handover Certificate, ensuring compliance and speed.',
    'Transfer Milestones':
        "Settlements are divided into clear milestones: Intent, Verification, and Handover. Each stage must be digitally acknowledged by both parties to maintain the sanctuary's integrity ledger.",
    'Direct Payment Security':
        'We utilize enterprise-grade encryption to secure the digital handshake between parties. All transaction metadata is vaulted to ensure a compliant and transparent audit trail for every transfer.',
    'Fee Transparency':
        'WoofCircle charges a flat platform fee to sustain sanctuary protocols. This funding covers the VSP infrastructure, Genetic Integrity audits, and our Checkpoint Logistics network.',
    'Vaccination Records':
        'All puppies must have verified vaccination records uploaded. Our veterinary board reviews these documents against the national registry to ensure every pet enters their new home in peak health.',
    'Dietary Guidelines':
        "Precision nutrition is key. Access our curated database of breed-specific dietary requirements to ensure a seamless transition for your puppy's metabolic needs.",
    'Early Socialization':
        "The critical 12-week window is managed via our 'Socialization Milestone' checklist. Breeders log interaction sessions which are audited by our behavioral specialists.",
    'Vet Connect':
        "Instantly transmit your pet's medical history to any verified vet in our directory. Our secure cloud architecture eliminates the need for paper records, providing a lifelong digital health passport.",
    'Reporting Fraud':
        'Suspected violations of our Ethics Code or fraudulent activity should be reported via the Trust & Safety Hotline or a Priority Ticket. We maintain a zero-tolerance policy, with immediate revocation of platform access for confirmed offenders.',
    'The Breeder Audit':
        'Our 7-Step Integrity Protocol is the gold standard for biosecurity and genetic transparency. It includes DNA lineage verification, mandatory site video audits, vet board sign-off, and randomized physical inspections. Only breeders with a 90%+ compliance score maintain Champion status.',
    'Dispute Resolution':
        'In the rare event of a conflict, our mediation board intervenes within 72 hours. We review the immutable digital trail of communication and milestones to reach a binding, evidence-based resolution.',
    'Terms of Ethics':
        "The Ethics Code is the foundation of the sanctuary. It mandates humane treatment, genetic transparency, and honest communication. Violations trigger immediate suspension and a permanent mark on the professional's audit record.",
    'Genetic Integrity Appeals':
        "If a listing's health score is contested, we initiate a Triple-Blind Audit. Three independent specialists review the DNA sequence and medical records to provide a binding verdict on the pet's genetic integrity.",
    'Checkpoint Logistics Excellence':
        "Our logistics framework focuses on human-verified safety at specific transit nodes. Instead of GPS, we rely on 'Live Node Reporting' where certified handlers and vets verify animal health and environment at every checkpoint.",
    'Live Node Reporting':
        "Transparency is maintained via human-verified check-ins. Status updates are logged at each transit node, providing a verified audit trail of the animal's journey without invasive tracking technology.",
    'Milestone-Triggered Settlement':
        'Transparency is automated. VSP settlements are triggered by pre-defined milestones: Audit Clearance, Booking Confirmation, and the final Digital Handover Certificate.',
    '3D-Secure Identity Shield':
        'We employ enterprise-level biometric verification. Your digital identity is encrypted and stored in a decentralized vault, ensuring total privacy while maintaining platform integrity.',
    'Dispute Mediation Protocol':
        'Our mediation board consists of legal experts and senior breeders. Decisions are based on the immutable audit trail logged during the transaction, ensuring a fair and transparent process.',
    'Vet Board Digital Signing':
        'All medical certifications are cryptographically signed by board-certified practitioners. This direct link to the national registry prevents any unauthorized health record manipulation.',
    'Kennel Biosecurity Standards':
        'Champion-tier kennels must adhere to ISO-grade sanitization protocols. Our video audits verify everything from high-efficiency ventilation systems to specialized socialization zones.',
    'Litter Socialization Metrics':
        'We track early development milestones quantitatively. Breeders log socialization sessions which are reviewed by our canine behavior specialists during the mandatory site audit.',
    'Platform Resilience Fund':
        'A portion of every platform fee contributes to our Resilience Fund. This fund provides emergency relocation and medical support for kennels in crisis zones or natural disaster situations.',
    'Champion Tier Privileges':
        'Champion breeders receive priority search ranking, reduced platform fees, and exclusive access to our Air Sanctuary logistics network, including priority booking for specialized transit crates.',
    'Biometric Handover Verification':
        "Handover events can be secured via biometric verification. Both parties scan their identity at the point of exchange, providing an irrefutable log of the pet's transition.",
    'National Registry Synchronization':
        "We sync daily with national registries. If a breeder's registration expires or is suspended externally, their WoofCircle listings are automatically hidden within 4ms of the update.",
};

export const glossary: GlossaryItem[] = [
    { term: 'Champion Status', definition: 'A designation for listings that meet 90%+ genetic integrity and pass a board-certified vet audit.' },
    {
        term: 'Verified Settlement Protocol',
        definition: 'Our transparent, milestone-based direct transfer system facilitate secure peer-to-peer settlements.',
    },
    { term: 'Checkpoint Logistics', definition: 'Human-verified safety network focusing on node-based health and status reporting during transit.' },
    { term: 'Genetic Integrity', definition: 'A quantitative score based on DNA testing and lineage verification from multiple registries.' },
    {
        term: 'Handover Certificate',
        definition: 'The critical digital document signed by both parties at the point of exchange to finalize a settlement.',
    },
];

export const platformStatus: PlatformStatus[] = [
    { label: 'Marketplace', status: 'Operational', color: 'text-green-500' },
    { label: 'Settlement Protocol', status: 'Operational', color: 'text-green-500' },
    { label: 'Identity Verification', status: '2h Delay', color: 'text-amber-500' },
    { label: 'Checkpoint Logistics', status: 'Operational', color: 'text-green-500' },
];

export const faqs: FaqItem[] = [
    {
        q: 'How does WoofCircle ensure breeder quality?',
        a: 'Every breeder undergoes our 7-Step Audit, including identity verification, kennel registration checks, and a mandatory commitment to our Code of Ethics.',
    },
    {
        q: 'What is the Verified Settlement Protocol (VSP)?',
        a: 'VSP is our transparent, milestone-based system that facilitates direct, secure transfers between members without the need for platform-held escrow.',
    },
    {
        q: 'Can I cancel a reservation?',
        a: 'Yes, reservations can be cancelled. Refund eligibility depends on the timing and the specific terms set by the breeder, which must align with our platform standards.',
    },
];

export const trendingTopics: TrendingTopic[] = [
    { title: 'VSP Settlement Timeline', category: 'Financial' },
    { title: 'Genetic Health Verification', category: 'Audit' },
    { title: 'Member Identity Security', category: 'Verification' },
    { title: 'Checkpoint Verification Hub', category: 'Logistics' },
];

export const pathways: Record<string, Pathway> = {
    buyer: {
        title: "The Buyer's Voyage",
        icon: React.createElement(Users, { className: 'size-6' }),
        steps: [
            { title: 'Identity Shield', desc: 'Complete 3D-secure verification to unlock premium listings.', status: 'Verified' },
            { title: 'Settlement Lock', desc: 'Secure your transaction milestones with VSP transparency.', status: 'Ready' },
            { title: 'Health Audit', desc: 'Review DNA and vaccine records signed by our vet board.', status: 'Pending' },
            { title: 'Sanctuary Handover', desc: 'Verified digital certificate triggers direct settlement.', status: 'Final' },
        ],
    },
    breeder: {
        title: 'Breeder Excellence',
        icon: React.createElement(Award, { className: 'size-6' }),
        steps: [
            { title: 'Kennel Audit', desc: 'Upload physical registry and site verification documents.', status: 'Active' },
            { title: 'Genetic Scan', desc: 'Register DNA markers for your Champion listings.', status: 'Mandatory' },
            { title: 'Milestone Sync', desc: 'Track handover progress and automated payout windows.', status: 'System' },
            { title: 'Reputation Hub', desc: 'Accumulate verified-only feedback and trust scores.', status: 'Growth' },
        ],
    },
    professional: {
        title: 'Professional Tier',
        icon: React.createElement(Star, { className: 'size-6' }),
        steps: [
            { title: 'License Lock', desc: 'Verify national professional board certifications.', status: 'Secure' },
            { title: 'Smart Bookings', desc: 'Configure your digital calendar for sanctuary members.', status: 'Ready' },
            { title: 'Clinical Audit', desc: 'Digital signature protocols for health certifications.', status: 'Verified' },
            { title: 'Service Pulse', desc: 'Monitor engagement and verified review analytics.', status: 'Dashboard' },
        ],
    },
};
export const onboardingChecklist: OnboardingTask[] = [
    {
        task: 'Complete Identity Verification',
        link: '/settings/profile',
        completed: false,
    },
    {
        task: 'Activate Settlement Protocol',
        link: '/financials',
        completed: false,
    },
    {
        task: 'Review Sanctuary Ethics Code',
        link: '/terms-and-ethics',
        completed: false,
    },
    {
        task: 'Configure Notification Pulse',
        link: '/settings/notifications',
        completed: false,
    },
];
