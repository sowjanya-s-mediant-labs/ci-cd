import axios from "axios";

// Prefer env var; fall back to relative to enable Vite proxy in dev
const baseURL = import.meta.env.VITE_API_BASE_URL || "";
const API = axios.create({ baseURL });

export const getPeople = () => API.get("/people");
export const createPerson = (person) => API.post("/people", person);
export const updatePerson = (id, person) => API.put(`/people/${id}`, person);
export const deletePerson = (id) => API.delete(`/people/${id}`);
