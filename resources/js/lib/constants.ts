import { Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';

// ─── Leads CRM Pipeline Status Constants ────────────────────────────────

export const LEAD_STATUS_LABELS: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    interested: 'Interested',
    follow_up: 'Follow Up',
    converted: 'Converted',
    rejected: 'Rejected',
};

/** Styling config used in the Leads Index pipeline tabs and status badges */
export const LEAD_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' },
    contacted: { label: 'Contacted', color: 'text-indigo-700', bg: 'bg-indigo-100', dot: 'bg-indigo-500' },
    interested: { label: 'Interested', color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500' },
    follow_up: { label: 'Follow Up', color: 'text-purple-700', bg: 'bg-purple-100', dot: 'bg-purple-500' },
    converted: { label: 'Converted', color: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', color: 'text-gray-500', bg: 'bg-gray-100', dot: 'bg-gray-400' },
};

/** Full Tailwind ring-based styling used in the Leads Show sidebar */
export const LEAD_STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    contacted: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
    interested: 'bg-amber-100 text-amber-700 ring-amber-600/20',
    follow_up: 'bg-purple-100 text-purple-700 ring-purple-600/20',
    converted: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-gray-100 text-gray-500 ring-gray-400/20',
};

/** Dropdown options for the Leads Create form */
export const LEAD_STATUS_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'converted', label: 'Converted' },
    { value: 'rejected', label: 'Rejected' },
];

// ─── Leave Management Type & Status Constants ───────────────────────────

export const LEAVE_TYPE_LABELS: Record<string, string> = {
    sick: 'Sick Leave',
    vacation: 'Vacation',
    unpaid: 'Unpaid Leave',
};

export const LEAVE_TYPE_DOTS: Record<string, string> = {
    sick: 'bg-rose-400',
    vacation: 'bg-blue-400',
    unpaid: 'bg-gray-400',
};

export const LEAVE_STATUS_BADGES: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
    approved: { label: 'Approved', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 },
    rejected: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-100', icon: XCircle },
    cancelled: { label: 'Cancelled', color: 'text-gray-500', bg: 'bg-gray-100', icon: Ban },
};
