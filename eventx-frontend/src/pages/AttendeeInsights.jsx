import React, { useEffect, useState } from "react";
import { getAllTickets } from "../api/ticketApi";
import { getEvents } from "../api/eventApi";
import { ArrowLeft, Users, MapPin, TrendingUp, Calendar, BarChart3, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AttendeeInsights = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsRes, eventsRes] = await Promise.all([
        getAllTickets(),
        getEvents()
      ]);
      setTickets(ticketsRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate demographics data
  const getDemographicsData = () => {
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46+': 0
    };

    // Simulate age distribution based on ticket count
    const totalTickets = tickets.length;
    ageGroups['18-25'] = Math.floor(totalTickets * 0.35);
    ageGroups['26-35'] = Math.floor(totalTickets * 0.40);
    ageGroups['36-45'] = Math.floor(totalTickets * 0.20);
    ageGroups['46+'] = totalTickets - ageGroups['18-25'] - ageGroups['26-35'] - ageGroups['36-45'];

    return ageGroups;
  };

  // Calculate location data
  const getLocationData = () => {
    return [
      { city: 'Colombo', count: Math.floor(tickets.length * 0.45), percentage: 45 },
      { city: 'Kandy', count: Math.floor(tickets.length * 0.25), percentage: 25 },
      { city: 'Galle', count: Math.floor(tickets.length * 0.15), percentage: 15 },
      { city: 'Jaffna', count: Math.floor(tickets.length * 0.10), percentage: 10 },
      { city: 'Others', count: Math.floor(tickets.length * 0.05), percentage: 5 }
    ];
  };

  // Calculate engagement metrics
  const getEngagementData = () => {
    const totalEvents = events.length;
    const totalTickets = tickets.length;
    const avgTicketsPerEvent = totalEvents > 0 ? (totalTickets / totalEvents).toFixed(1) : 0;
    
    return {
      totalAttendees: totalTickets,
      avgTicketsPerEvent,
      engagementRate: 78, // Simulated
      repeatAttendees: Math.floor(totalTickets * 0.35)
    };
  };

  const demographics = getDemographicsData();
  const locations = getLocationData();
  const engagement = getEngagementData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">All Events Attendee Insights</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{engagement.totalAttendees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Event</p>
                <p className="text-3xl font-bold text-gray-900">{engagement.avgTicketsPerEvent}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-3xl font-bold text-gray-900">{engagement.engagementRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Repeat Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{engagement.repeatAttendees}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demographics Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Age Demographics</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(demographics).map(([ageGroup, count], index) => {
                const percentage = tickets.length > 0 ? ((count / tickets.length) * 100).toFixed(1) : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'];
                
                return (
                  <div key={ageGroup} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${colors[index]}`}></div>
                      <span className="text-sm font-medium text-gray-700">{ageGroup} years</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie Chart Visualization */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {Object.entries(demographics).map(([ageGroup, count], index) => {
                    const percentage = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = Object.entries(demographics)
                      .slice(0, index)
                      .reduce((acc, [_, c]) => acc + (tickets.length > 0 ? (c / tickets.length) * 100 : 0), 0);
                    
                    return (
                      <circle
                        key={ageGroup}
                        cx="50"
                        cy="50"
                        r="15.915"
                        fill="transparent"
                        stroke={colors[index]}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={-strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Location Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {locations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{location.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Interactive Map View</p>
                <p className="text-gray-400 text-xs">Geographic distribution visualization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Trends</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
              <div className="text-sm text-gray-600">Overall Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">65%</div>
              <div className="text-sm text-gray-600">Return Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.2</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="mt-8">
            <div className="flex items-end justify-between h-32 space-x-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={month} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInsights;
