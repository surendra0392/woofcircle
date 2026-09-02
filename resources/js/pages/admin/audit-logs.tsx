import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Eye, Filter, Globe, Monitor, Search, Terminal, X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface AuditLog {
    id: number;
    admin_id: number;
    admin: Admin;
    action: string;
    method: string;
    url: string;
    payload: Record<string, unknown> | null;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

interface PageProps {
    logs: { data: AuditLog[]; links: { url: string | null; label: string; active: boolean }[] };
    admins: Admin[];
    filters: { search?: string; admin_id?: string; method?: string; start_date?: string; end_date?: string };
}

export default function AdminAuditLogs({ logs, admins, filters }: PageProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [filterData, setFilterData] = useState({
        admin_id: filters.admin_id || 'all',
        method: filters.method || 'all',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(route('admin.audit-logs.index'), { search, ...filterData }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setFilterData({ admin_id: 'all', method: 'all', start_date: '', end_date: '' });
        router.get(route('admin.audit-logs.index'));
    };

    return (
        <AdminLayout title="Activity Audit Logs">
            <Head title="Activity Audit Logs" />
            <div className="mx-auto max-w-full space-y-6">
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
                            <Terminal className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">System Audit Logs</h2>
                            <p className="text-xs text-woof-charcoal/60">View comprehensive system event logs, administrator actions, and audit trails</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative hidden sm:block">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-woof-charcoal/40" />
                            <Input
                                placeholder="Search logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-[240px] rounded-2xl border-[#e8ded1] bg-white pl-10 text-xs text-woof-charcoal placeholder:text-woof-charcoal/40 shadow-2xs focus-visible:ring-woof-gold/20"
                            />
                        </form>
                        <Button
                            variant="outline"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-10 rounded-full border-[#e8ded1] px-5 text-xs font-bold transition-colors ${
                                isFilterOpen ? 'bg-woof-charcoal text-white' : 'bg-white text-woof-charcoal hover:bg-[#fcfbf9]'
                            }`}
                        >
                            <Filter className="mr-2 h-3.5 w-3.5" /> Filters
                        </Button>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="grid grid-cols-1 gap-4 rounded-3xl border border-[#e8ded1] bg-white p-6 shadow-xs sm:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Admin</Label>
                            <Select value={filterData.admin_id} onValueChange={(v) => setFilterData({ ...filterData, admin_id: v })}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Admins" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All Admins</SelectItem>
                                    {admins.map((a) => (
                                        <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Method</Label>
                            <Select value={filterData.method} onValueChange={(v) => setFilterData({ ...filterData, method: v })}>
                                <SelectTrigger className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs text-woof-charcoal">
                                    <SelectValue placeholder="All Methods" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[#e8ded1]">
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="POST">POST (Create)</SelectItem>
                                    <SelectItem value="PUT">PUT (Update)</SelectItem>
                                    <SelectItem value="PATCH">PATCH (Update)</SelectItem>
                                    <SelectItem value="DELETE">DELETE (Remove)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">Start Date</Label>
                            <Input
                                type="date"
                                value={filterData.start_date}
                                onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs text-woof-charcoal"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-woof-charcoal">End Date</Label>
                            <Input
                                type="date"
                                value={filterData.end_date}
                                onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                                className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] px-3 text-xs text-woof-charcoal"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={applyFilters}
                                className="h-10 flex-1 rounded-full bg-woof-charcoal text-xs font-bold text-white hover:bg-woof-forest transition-colors shadow-xs"
                            >
                                Apply Filters
                            </Button>
                            <Button onClick={resetFilters} variant="outline" className="h-10 w-10 rounded-full border-[#e8ded1] p-0 text-woof-charcoal hover:bg-[#fcfbf9]">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-[#e8ded1] bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#fcfbf9] border-b border-[#e8ded1] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Administrator</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">IP Address</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e8dc]">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-woof-charcoal/50">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-[#fcfbf9] transition-colors">
                                            <td className="px-6 py-4 font-bold text-woof-charcoal whitespace-nowrap">
                                                {log.admin?.name || 'System'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    log.method === 'DELETE' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    log.method === 'POST' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    log.method === 'PUT' || log.method === 'PATCH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    'bg-[#fcfbf9] text-woof-charcoal border border-[#e8ded1]'
                                                }`}>
                                                    {log.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal truncate max-w-[250px] font-medium">
                                                {log.action}
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe className="h-3 w-3 text-woof-gold" /> {log.ip_address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-woof-charcoal/60 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setSelectedLog(log)} className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs ml-auto">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {logs.links && (
                        <div className="border-t border-[#e8ded1] bg-[#fcfbf9] px-6 py-3">
                            <Pagination links={logs.links} />
                        </div>
                    )}
                </div>

                <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                    <DialogContent className="rounded-3xl border border-[#e8ded1] sm:max-w-2xl bg-white p-6 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-woof-charcoal">Log Details</DialogTitle>
                            <DialogDescription className="text-xs text-woof-charcoal/60">
                                Detailed information about the selected audit log entry.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Administrator</Label>
                                    <p className="mt-1 font-bold text-xs text-woof-charcoal">{selectedLog?.admin?.name || 'System'}</p>
                                    <p className="text-[11px] text-woof-charcoal/60">{selectedLog?.admin?.email}</p>
                                </div>
                                <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Timestamp</Label>
                                    <p className="mt-1 font-bold text-xs text-woof-charcoal">
                                        {selectedLog ? new Date(selectedLog.created_at).toLocaleString() : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Action & Method</Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white border border-[#e8ded1] text-woof-charcoal">
                                            {selectedLog?.method}
                                        </span>
                                        <span className="font-bold text-xs text-woof-charcoal truncate">{selectedLog?.action}</span>
                                    </div>
                                </div>
                                <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Network IP</Label>
                                    <p className="mt-1 flex items-center gap-1.5 font-bold text-xs text-woof-charcoal">
                                        <Globe className="h-3.5 w-3.5 text-woof-gold" /> {selectedLog?.ip_address}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Endpoint URL</Label>
                                <p className="mt-1 font-mono text-[11px] text-woof-charcoal break-all">
                                    {selectedLog?.url}
                                </p>
                            </div>
                            
                            <div className="p-3.5 bg-[#fcfbf9] rounded-2xl border border-[#e8ded1]">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">User Agent</Label>
                                <p className="mt-1 text-[11px] text-woof-charcoal/70 flex items-start gap-1.5 break-all">
                                    <Monitor className="h-3.5 w-3.5 shrink-0 text-woof-gold mt-0.5" /> {selectedLog?.user_agent}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-woof-charcoal/50">Payload Data</Label>
                                <pre className="mt-1 max-h-[220px] overflow-auto rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] p-4 font-mono text-xs text-woof-charcoal shadow-inner">
                                    {selectedLog?.payload ? JSON.stringify(selectedLog.payload, null, 4) : '// No Payload Provided'}
                                </pre>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
