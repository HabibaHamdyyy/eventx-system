import axios from "./axiosInstance";

// Admin: get all tickets (matches backend route GET /tickets/admin/all)
export const getAllTickets = () => axios.get("/tickets/admin/all");
export const getTicketsByEvent = (eventId) => axios.get(`/tickets/event/${eventId}`);
export const getBookedSeatsForEvent = (eventId) => axios.get(`/tickets/event/${eventId}/booked-seats`);
export const createTicket = (data) => axios.post("/tickets", data);
export const cancelTicket = (id) => axios.delete(`/tickets/${id}`);
export const getMyTickets = () => axios.get(`/tickets/my-tickets`);
export const getMostBookedEvents = () => axios.get(`/tickets/analytics/most-booked`);
export const bookTicket = (eventId, seatNumber) => axios.post(`/tickets/book`, { eventId, seatNumber });


