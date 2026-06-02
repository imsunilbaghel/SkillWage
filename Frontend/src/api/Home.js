import { api } from "./axios";

//Fetch All Workers Profile
export const AllWorkersProfile = async (params) => {
    const response = await api.get("/workers", params);
    return response.data;
};