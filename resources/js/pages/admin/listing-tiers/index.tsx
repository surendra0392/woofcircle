import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit2, Plus, Trash2, Layers, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface Tier {
  id: number;
  name: string;
  max_listings: number;
  price: string | number;
}

interface Props {
  tiers: Tier[];
}

export default function ListingTiersIndex({ tiers }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);

  const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    max_listings: '',
    price: '',
  });

  const openModal = (tier: Tier | null = null) => {
    if (tier) {
      setEditingTier(tier);
      setData({
        name: tier.name,
        max_listings: tier.max_listings.toString(),
        price: tier.price.toString(),
      });
    } else {
      setEditingTier(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTier) {
      put(route('admin.listing-tiers.update', editingTier.id), {
        onSuccess: () => {
          toast.success('Listing tier updated successfully.');
          closeModal();
        },
      });
    } else {
      post(route('admin.listing-tiers.store'), {
        onSuccess: () => {
          toast.success('Listing tier created successfully.');
          closeModal();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this tier?')) {
      destroy(route('admin.listing-tiers.destroy', id), {
        onSuccess: () => toast.success('Listing tier deleted successfully.'),
      });
    }
  };

  return (
    <AdminLayout title="Listing Tiers">
      <Head title="Listing Tiers - Admin" />

      <div className="mx-auto max-w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ded1] bg-[#fcfbf9] text-woof-gold shadow-2xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-woof-charcoal">Listing Tiers</h2>
              <p className="text-xs text-woof-charcoal/60">
                Manage quota plans and pricing tiers for marketplace directory listings (-1 means unlimited)
              </p>
            </div>
          </div>
          <Button 
            onClick={() => openModal()} 
            className="inline-flex items-center justify-center bg-woof-charcoal hover:bg-woof-forest h-10 rounded-full px-5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Tier
          </Button>
        </div>

        {/* Content Table */}
        <div className="overflow-hidden border border-[#e8ded1] bg-white shadow-xs rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e8ded1] bg-[#fcfbf9] text-[11px] font-bold text-woof-charcoal/60 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tier Name</th>
                  <th className="px-6 py-4">Max Listings Quota</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8dc]">
                {tiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-[#fcfbf9] transition-colors">
                    <td className="px-6 py-4 font-bold text-woof-charcoal">{tier.name}</td>
                    <td className="px-6 py-4">
                      {tier.max_listings === -1 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Unlimited
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                          {tier.max_listings} Listings
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-woof-charcoal">
                      ₹{Number(tier.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal(tier)}
                          className="h-8 w-8 rounded-full bg-[#fcfbf9] border border-[#e8ded1] text-woof-charcoal hover:bg-white hover:border-woof-gold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                          title="Edit Tier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {tier.id !== 1 && (
                          <button
                            onClick={() => handleDelete(tier.id)}
                            className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                            title="Delete Tier"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {tiers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-woof-charcoal/50">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Layers className="h-8 w-8 text-woof-charcoal/30" />
                        <p className="text-xs font-bold uppercase tracking-wider">No listing tiers found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="rounded-3xl border border-[#e8ded1] bg-white sm:max-w-[420px] p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-woof-charcoal">{editingTier ? 'Edit Listing Tier' : 'Add Listing Tier'}</DialogTitle>
              <DialogDescription className="text-xs text-woof-charcoal/60">
                {editingTier ? 'Update quota limits and price details for this tier.' : 'Create a new subscription tier for marketplace listings.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-woof-charcoal">Tier Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g. Standard Breeder Plan"
                  className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                  required
                />
                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max_listings" className="text-xs font-bold text-woof-charcoal">Max Listings Quota (-1 for Unlimited) *</Label>
                <Input
                  id="max_listings"
                  type="number"
                  value={data.max_listings}
                  onChange={(e) => setData('max_listings', e.target.value)}
                  placeholder="e.g. 5 or -1"
                  className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                  required
                />
                {errors.max_listings && (
                  <p className="text-xs text-rose-500">{errors.max_listings}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold text-woof-charcoal">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  placeholder="e.g. 499"
                  className="h-10 rounded-2xl border-[#e8ded1] bg-[#fcfbf9] text-xs font-medium text-woof-charcoal focus-visible:ring-woof-gold/20"
                />
                {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
              </div>

              <DialogFooter className="pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeModal}
                  className="rounded-full border-[#e8ded1] text-xs font-bold text-woof-charcoal hover:bg-[#fcfbf9]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="rounded-full bg-woof-charcoal hover:bg-woof-forest text-xs font-bold text-white shadow-xs"
                >
                  {processing ? 'Saving...' : 'Save Tier'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
