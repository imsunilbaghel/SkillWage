import { useState, useEffect } from "react";
import { useAdminCustomers, useUpdateAdminCustomer } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { fetchPostalCodeData } from "@/api/location";
import { toast } from "sonner";

export default function AdminCustomers() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const handleSearch = () => {
        setActiveSearch(searchQuery);
        setPage(1);
    };

    const handleClear = () => {
        setSearchQuery("");
        setActiveSearch("");
        setPage(1);
    };

    const filters = {
        page,
        limit: 10,
        search: activeSearch,
    };

    const { data, isLoading } = useAdminCustomers(filters);

    const customers = data?.customers || [];
    const pagination = data?.pagination;

    // View Details Modal
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative max-w-md flex gap-2">
                    <Input
                        placeholder="Search by name, phone or email..."
                        value={searchQuery}
                        className="w-md"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
                        Search
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="w-fit">
                        Clear
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                    {customer.profileImage ? (
                                                        <img src={customer.profileImage} alt={customer.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                            {customer.fullName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-medium text-slate-800">{customer.fullName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800">{customer.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">{customer.email}</td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedCustomer(customer)}
                                            >
                                                Edit / View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <CustomerDetailsModal
                customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />
        </div>
    );
}

function CustomerDetailsModal({ customer, onClose }) {
    const updateMutation = useUpdateAdminCustomer();

    // Form state
    const [formData, setFormData] = useState({});
    const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
    const [subdivisions, setSubdivisions] = useState([]);

    // Initialize local state when customer changes
    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.fullName || "",
                phoneNumber: customer.phoneNumber || "",
                email: customer.email || "",
                address: customer.address || "",
                pincode: customer.pincode || "",
                subdivision: customer.subdivision || "",
                city: customer.city || "",
                state: customer.state || "",
            });
            setSubdivisions(customer.subdivision ? [customer.subdivision] : []);
        }
    }, [customer]);

    const lookupPincode = async () => {
        if (!formData.pincode || formData.pincode.length !== 6) {
            toast.error("Please enter a valid 6-digit pincode");
            return;
        }

        setIsLookingUpPincode(true);
        try {
            const postOffices = await fetchPostalCodeData(formData.pincode);
            if (postOffices && postOffices.length > 0) {
                const names = postOffices.map((po) => po.Name);
                setSubdivisions(names);

                setFormData(prev => ({
                    ...prev,
                    city: postOffices[0].District,
                    state: postOffices[0].State,
                    subdivision: names.includes(prev.subdivision) ? prev.subdivision : names[0],
                }));
                toast.success("Location fetched successfully");
            } else {
                toast.error("No data found for this pincode");
                setSubdivisions([]);
            }
        } catch (error) {
            toast.error("Failed to fetch pincode data");
            setSubdivisions([]);
        } finally {
            setIsLookingUpPincode(false);
        }
    };

    if (!customer) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        const payload = {
            id: customer._id,
            ...formData,
        };
        updateMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Customer Details & Editing</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 my-4">
                    {/* Images Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Profile Image</h4>
                        {customer.profileImage ? (
                            <a href={customer.profileImage} target="_blank" rel="noreferrer" className="block w-48 border rounded-lg overflow-hidden relative group">
                                <img src={customer.profileImage} alt="profile" className="w-full h-48 object-contain bg-slate-50" />
                            </a>
                        ) : (
                            <div className="w-48 h-48 border rounded-lg flex items-center justify-center bg-slate-50 text-slate-400">No Image</div>
                        )}
                    </div>

                    <hr className="border-slate-200" />

                    {/* Editable Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
                            <Input name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Phone Number</label>
                            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                            <Input name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Pincode</label>
                            <div className="flex gap-2">
                                <Input name="pincode" value={formData.pincode} onChange={handleChange} />
                                <Button
                                    type="button"
                                    onClick={lookupPincode}
                                    disabled={isLookingUpPincode || formData.pincode?.length !== 6}
                                >
                                    {isLookingUpPincode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">City</label>
                            <Input name="city" value={formData.city} readOnly className="bg-slate-50" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">State</label>
                            <Input name="state" value={formData.state} readOnly className="bg-slate-50" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Subdivision</label>
                            {subdivisions.length > 0 ? (
                                <Select value={formData.subdivision} onValueChange={(val) => setFormData(p => ({ ...p, subdivision: val }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {subdivisions.map(sub => (
                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input name="subdivision" value={formData.subdivision} onChange={handleChange} />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
                        <Textarea name="address" value={formData.address} onChange={handleChange} />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
