'use client'

import React, {  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Bell, CreditCard, Calendar as CalendarIcon  } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientPortal = () => {
  // Sample data - in real app, this would come from your backend
  const appointmentHistory = [
    { date: '2024-01', visits: 1 },
    { date: '2024-02', visits: 2 },
    { date: '2024-03', visits: 1 },
    { date: '2024-04', visits: 3 },
  ];

  const upcomingAppointments = [
    { date: 'Mar 15, 2024', time: '10:00 AM', type: 'Regular Checkup', doctor: 'Dr. Smith' },
    { date: 'Apr 02, 2024', time: '2:30 PM', type: 'Cleaning', doctor: 'Dr. Johnson' },
  ];

  const recentDocuments = [
    { name: 'Dental X-Ray Results', date: 'Mar 1, 2024' },
    { name: 'Treatment Plan', date: 'Feb 15, 2024' },
    { name: 'Insurance Claim', date: 'Feb 10, 2024' },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
        <p className="text-gray-600">Welcome back, John Doe</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">Schedule</p>
              <p className="text-sm text-gray-600">Book Appointment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <CreditCard className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium">Payments</p>
              <p className="text-sm text-gray-600">View & Pay Bills</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <FileText className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium">Records</p>
              <p className="text-sm text-gray-600">View Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <Bell className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-600">View Updates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visit History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appointmentHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="visits" stroke="#2563eb" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{apt.type}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {apt.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {apt.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card className=''>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage your appointments here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Access your medical records and documents.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage your profile and preferences.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPortal;