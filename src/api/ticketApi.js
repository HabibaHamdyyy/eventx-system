import axiosInstance from "./axiosInstance";

// Admin: get all tickets (matches backend route GET /tickets/admin/all)
export const getAllTickets = () => axiosInstance.get("/tickets/admin/all");
export const getTicketsByEvent = (eventId) => axiosInstance.get(`/tickets/event/${eventId}`);
export const getBookedSeatsForEvent = (eventId) => axiosInstance.get(`/tickets/event/${eventId}/booked-seats`);
export const createTicket = (data) => axiosInstance.post("/tickets", data);
export const cancelTicket = (id) => axiosInstance.delete(`/tickets/${id}`);
export const getMyTickets = () => axiosInstance.get(`/tickets/my-tickets`);
export const getMostBookedEvents = () => axiosInstance.get(`/tickets/analytics/most-booked`);
export const bookTicket = (eventId, seatNumber) => axiosInstance.post(`/tickets/book`, { eventId, seatNumber });


