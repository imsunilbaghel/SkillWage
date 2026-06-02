import { useState, useEffect } from "react";
import { useAdminRequests, useUpdateAdminRequestStatus, useAdminGenerateRequestOTP } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Key, Edit } from "lucide-react";
import { toast } from "sonner";

export default function AdminRequests() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchPhone, setSearchPhone] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [editServiceType, setEditServiceType] = useState("");

    const handleSearch = () => {
        setActiveSearch(searchPhone);
        setPage(1);
    };

    const handleClear = () => {
        setSearchPhone("");
        setActiveSearch("");
        setPage(1);
    };

    const { data, isLoading } = useAdminRequests({
        page,
        limit: 10,
        status: statusFilter,
        search: activeSearch
    });

    const updateStatusMutation = useUpdateAdminRequestStatus();
    const generateOtpMutation = useAdminGenerateRequestOTP();

    const requests = data?.requests || [];
    const pagination = data?.pagination;

    const openEditModal = (req) => {
        setSelectedRequest(req);
        setEditStatus(req.status);
        setEditServiceType(req.serviceType || "");
    };

    const handleSaveChanges = () => {
        if (!selectedRequest) return;
        updateStatusMutation.mutate({
            id: selectedRequest._id,
            status: editStatus
        }, {
            onSuccess: () => {
                setSelectedRequest(null);
            }
        });
    };

    const handleGenerateOtp = (reqId) => {
        generateOtpMutation.mutate(reqId);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Service Requests</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative max-w-3xl flex gap-2">
                    <Input
                        placeholder="Search by worker/customer phone..."
                        value={searchPhone}
                        className="w-md"
                        onChange={(e) => setSearchPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
                        Search
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="w-fit">
                        Clear
                    </Button>
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Worker</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-500">
                                        No service requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{req.customer?.fullName || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{req.customer?.phoneNumber || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{req.worker?.fullName || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{req.worker?.phoneNumber || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize font-medium text-slate-700">
                                            {req.serviceType || '—'}
                                        </td>
                                        <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider">
                                            <span className={`px-2 py-1 rounded-md ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    req.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(req)}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                {req.status === "accepted" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        onClick={() => handleGenerateOtp(req._id)}
                                                        disabled={generateOtpMutation.isPending}
                                                    >
                                                        <Key className="w-4 h-4" />
                                                        Generate OTP
                                                    </Button>
                                                )}
                                            </div>
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

            {/* Edit Modal */}
            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Service Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Service Type</label>
                            <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 capitalize">
                                {editServiceType || "—"}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="w-fit" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                        <Button
                            onClick={handleSaveChanges}
                            disabled={updateStatusMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
