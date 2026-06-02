import { api } from "./axios";

export const getMyRequests = async (params) => {
    const res = await api.get("/requests", params);
    return res.data;
};

export const sendServiceRequest = async (workerId) => {
    const res = await api.post("/requests", { workerId });
    return res.data;
};

export const acceptServiceRequest = async (id) => {
    const res = await api.patch(`/requests/${id}/accept`);
    return res.data;
};

export const generateOtp = async (id) => {
    const res = await api.post(`/requests/${id}/generate-otp`);
    return res.data;
};

export const verifyOtp = async (id, otp) => {
    const res = await api.post(`/requests/${id}/verify-otp`, { otp });
    return res.data;
};

export const rejectServiceRequest = async (id) => {
    const res = await api.patch(`/requests/${id}/reject`);
    return res.data;
};

export const rateServiceRequest = async (id, rating) => {
    const res = await api.post(`/requests/${id}/rate`, { rating });
    return res.data;
};
