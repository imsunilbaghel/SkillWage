import { useState } from "react";
import { useAdminContacts, useAdminDeleteContact } from "@/hooks/useAdmin";
import { Loader2, Trash2, Mail, User, Clock, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminContacts = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError } = useAdminContacts({ page, limit });
    const deleteMutation = useAdminDeleteContact();

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this contact message?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
                Failed to load contact messages.
            </div>
        );
    }

    const contacts = data?.contacts || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Contact Messages</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage public inquiries and messages</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {contacts.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <Inbox className="w-12 h-12 mb-3 text-slate-300" />
                        <p>No contact messages found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Sender Details</th>
                                    <th className="px-6 py-4 font-semibold">Message</th>
                                    <th className="px-6 py-4 font-semibold w-56">Date</th>
                                    <th className="px-6 py-4 font-semibold text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-2 font-medium text-slate-900 mb-1">
                                                <User className="w-4 h-4 text-slate-400" />
                                                {contact.fullname}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 hover:underline">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 whitespace-pre-wrap">
                                            {contact.message}
                                        </td>
                                        <td className="px-6 py-4 align-top text-slate-500">
                                            <div className="flex flex-col gap-1.5">
                                                {new Date(contact.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                <br />
                                                <span className="text-xs text-slate-400">
                                                    {new Date(contact.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                {deleteMutation.isPending && deleteMutation.variables === contact._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContacts;
