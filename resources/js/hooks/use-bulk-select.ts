import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useBulkSelect(items: any[], resource: string) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const isAllSelected = useMemo(() => {
        if (!items || items.length === 0) return false;
        return items.every((item) => selectedIds.includes(item.id));
    }, [items, selectedIds]);

    const isSomeSelected = useMemo(() => {
        return selectedIds.length > 0 && !isAllSelected;
    }, [selectedIds, isAllSelected]);

    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedIds((prev) => prev.filter((id) => !items.find((item) => item.id === id)));
        } else {
            const newIds = [...selectedIds];
            items.forEach((item) => {
                if (!newIds.includes(item.id)) {
                    newIds.push(item.id);
                }
            });
            setSelectedIds(newIds);
        }
    };

    const toggleItem = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const bulkDelete = (onSuccess?: () => void) => {
        if (selectedIds.length === 0) return;
        
        if (confirm(`Are you sure you want to delete the ${selectedIds.length} selected items?`)) {
            setIsProcessing(true);
            router.post(route('admin.bulk.destroy'), {
                _method: 'delete',
                ids: selectedIds,
                resource: resource,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    toast.success(`${selectedIds.length} items deleted successfully.`);
                    if (onSuccess) onSuccess();
                    setIsProcessing(false);
                },
                onError: () => {
                    toast.error('An error occurred while deleting items.');
                    setIsProcessing(false);
                }
            });
        }
    };

    return {
        selectedIds,
        setSelectedIds,
        isAllSelected,
        isSomeSelected,
        toggleAll,
        toggleItem,
        bulkDelete,
        isProcessing,
    };
}
