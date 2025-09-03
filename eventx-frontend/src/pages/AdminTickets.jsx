import React, { useEffect, useState } from "react";
import { getAllTickets } from "../api/ticketApi";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  User, 
  Ticket,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTickets();
      const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = Array.isArray(tickets) ? tickets : [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.seatNumber?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(ticket => {
        if (filterStatus === "checked-in") return ticket.checkedIn;
        if (filterStatus === "pending") return !ticket.checkedIn;
        return true;
      });
    }

    setFilteredTickets(filtered);
  };

  const getStatusIcon = (checkedIn) => {
    return checkedIn ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-500" />
    );
  };

  const getStatusText = (checkedIn) => {
    return checkedIn ? "Checked In" : "Pending";
  };

  const getStatusBadge = (checkedIn) => {
    return checkedIn ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        Checked In
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 font-medium">
        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking & Tickets</h1>
          <p className="text-gray-400 mt-1">Manage all event bookings and ticket sales</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Tickets</p>
              <p className="text-xl font-bold text-white">{tickets.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Checked In</p>
              <p className="text-xl font-bold text-white">
                {tickets.filter(t => t.checkedIn).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-xl font-bold text-white">
                {tickets.filter(t => !t.checkedIn).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Events</p>
              <p className="text-xl font-bold text-white">
                {new Set(tickets.map(t => t.eventId?._id)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {!searchTerm && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                type="text"
                placeholder={searchTerm ? "Search..." : "       Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-80 ${searchTerm ? 'pl-3' : 'pl-10'} bg-gray-700 border-gray-600 text-white`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              style={{ backgroundColor: '#1f2937', color: 'white' }}
            >
              <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Tickets</option>
              <option value="checked-in" style={{ backgroundColor: '#1f2937', color: 'white' }}>Checked In</option>
              <option value="pending" style={{ backgroundColor: '#1f2937', color: 'white' }}>Pending</option>
            </select>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            All Bookings ({filteredTickets.length})
          </h3>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
              <p className="text-gray-400">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No tickets have been booked yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div key={ticket._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* User Info */}
                      <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-500" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-white">
                            {ticket.userId?.name || "Unknown User"}
                          </h4>
                          {getStatusBadge(ticket.checkedIn)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                            <span>{ticket.eventId?.title || "Unknown Event"}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2 text-green-400" />
                            <span>Seat {ticket.seatNumber}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-300">
                            <span className="mr-2">📅</span>
                            <span>
                              {ticket.eventId?.date 
                                ? new Date(ticket.eventId.date).toLocaleDateString()
                                : "No date"
                              }
                            </span>
                          </div>
                        </div>
                        
                        {ticket.eventId?.venue && (
                          <div className="flex items-center text-gray-400 text-sm mt-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{ticket.eventId.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* QR Code */}
                      {ticket.qrCode && (
                        <div className="text-center">
                          <img
                            src={ticket.qrCode}
                            alt="QR Code"
                            className="w-16 h-16 border border-gray-600 rounded-lg bg-white p-1"
                          />
                          <p className="text-xs text-gray-400 mt-1">QR Code</p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        
                        {!ticket.checkedIn && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-600 text-green-400 hover:bg-green-500/10"
                          >
                            Check In
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminTickets;
