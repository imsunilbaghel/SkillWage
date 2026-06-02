import { useState, useEffect } from "react";
import { useAdminSupports, useUpdateAdminSupport } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search, Image as ImageIcon, CheckCircle2, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSupport() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchPhone, setSearchPhone] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const handleSearch = () => {
        setActiveSearch(searchPhone);
        setPage(1);
    };

    const handleClear = () => {
        setSearchPhone("");
        setActiveSearch("");
        setPage(1);
    };

    const { data, isLoading } = useAdminSupports({
        page,
        limit: 10,
        status: statusFilter,
        search: activeSearch
    });

    const supports = data?.supports || [];
    const pagination = data?.pagination;

    // View Details Modal
    const [selectedSupport, setSelectedSupport] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Support Queries</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative max-w-3xl flex gap-2">
                    <Input
                        placeholder="Search by phone number..."
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
                            <SelectItem value="resolved">Resolved</SelectItem>
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                                    </td>
                                </tr>
                            ) : supports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-500">
                                        No support queries found.
                                    </td>
                                </tr>
                            ) : (
                                supports.map((support) => (
                                    <tr key={support._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(support.updatedAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            <br />
                                            <span className="text-xs text-slate-400">
                                                {new Date(support.updatedAt).toLocaleTimeString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{support.userName}</div>
                                            <div className="text-slate-500 text-xs">{support.userNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{support.userRole}</td>
                                        <td className="px-6 py-4">
                                            {support.status === "pending" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Resolved
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedSupport(support)}
                                            >
                                                View Details
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
            <SupportDetailsModal
                support={selectedSupport}
                onClose={() => setSelectedSupport(null)}
            />
        </div>
    );
}

function SupportDetailsModal({ support, onClose }) {
    const updateMutation = useUpdateAdminSupport();
    const [status, setStatus] = useState("pending");
    const [statusMessage, setStatusMessage] = useState("");

    // Reset local state when support changes
    useEffect(() => {
        if (support) {
            setStatus(support.status);
            setStatusMessage(support.statusMessage || "");
        }
    }, [support]);

    if (!support) return null;

    const handleUpdate = () => {
        updateMutation.mutate(
            { id: support._id, status, statusMessage },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    };

    return (
        <Dialog open={!!support} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Support Query Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                        <div>
                            <p className="text-slate-500 font-medium">User</p>
                            <p className="font-semibold text-slate-800">{support.userName}</p>
                            <p className="text-slate-600">{support.userNumber}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Role</p>
                            <p className="font-semibold text-slate-800 capitalize">{support.userRole}</p>
                            <p className="text-slate-600 text-xs">ID: {support.user}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Query</h4>
                        <div className="bg-indigo-50 p-4 rounded-lg text-sm text-slate-800 whitespace-pre-wrap">
                            {support.query}
                        </div>
                    </div>

                    {support.screenshot && (
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Screenshot attached</h4>
                            <a href={support.screenshot} target="_blank" rel="noreferrer" className="block w-full max-w-sm border rounded-lg overflow-hidden relative group">
                                <img src={support.screenshot} alt="screenshot" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon className="text-white w-8 h-8" />
                                </div>
                            </a>
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-4 mt-6">
                        <h4 className="text-md font-semibold text-slate-800 mb-4">Update Status</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Status Message / Resolution (Optional)</label>
                                <Textarea
                                    placeholder="Add a message for the user..."
                                    className="resize-y min-h-[80px]"
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
