"use client";

import React from "react";
import {
  BarChart3,
  Search,
  Globe,
  AlertTriangle,
  Link,
  Settings,
  FileText,
  Gauge,
  Map,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SEODashboard = () => {
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-400">SEO Dashboard</h1>
        <p className="text-gray-600">Google Search Console Analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5K</div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">520K</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
            <Gauge className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3</div>
            <p className="text-xs text-gray-500">-2.1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <Search className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7%</div>
            <p className="text-xs text-gray-500">+0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Graph */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Search Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="w-full h-full rounded flex items-center justify-center text-gray-400">
                Performance Graph Placeholder
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 hover:bg-gray-600 rounded"
                  >
                    <div>
                      <p className="font-medium">/example-page-{i}</p>
                      <p className="text-sm text-gray-500">
                        142 clicks • 3.2K impressions
                      </p>
                    </div>
                    <div className="text-green-500 font-medium">+12%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Issues Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Critical Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-2 bg-red-50 text-red-700 rounded">
                  <p className="font-medium">404 Errors</p>
                  <p className="text-sm">3 pages returning 404 errors</p>
                </div>
                <div className="p-2 bg-yellow-50 text-yellow-700 rounded">
                  <p className="font-medium">Mobile Usability</p>
                  <p className="text-sm">2 pages with mobile issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 text-center  border rounded hover:bg-gray-600">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Submit URL</span>
                </button>
                <button className="p-4 text-center  border rounded hover:bg-gray-600">
                  <Link className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">View Links</span>
                </button>
                <button className="p-4 text-center  border rounded hover:bg-gray-600">
                  <Map className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Sitemaps</span>
                </button>
                <button className="p-4 text-center border rounded hover:bg-gray-600">
                  <Settings className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <Bell className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">
                        New Search Appearance
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEODashboard;
