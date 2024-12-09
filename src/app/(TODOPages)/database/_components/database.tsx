'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Server, HardDrive } from 'lucide-react';
import DatabaseViewer from './db-viewer';

const DatabasePage = () => {
  // Define all state hooks at the top level
  const [isConnected, setIsConnected] = useState(false);
  const [dbType, setDbType] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [dbConfig, setDbConfig] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    database: ''
  });
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effect to fetch tables when connected
  useEffect(() => {
    const fetchTables = async () => {
      if (!isConnected) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/database');
        const data = await response.json();
        
        if (data.status === 'success') {
          setTables(data.tables);
        }
      } catch (error) {
        console.log('Failed to fetch tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      setConnectionStatus('connecting');
      
      if (dbType === 'sqlite') {
        // Initialize SQLite database
        const response = await fetch('/api/database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'sqlite',
            database: 'database/dental.db'
          })
        });

        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message);
        }
        
        // Store connection details
        localStorage.setItem('dbConfig', JSON.stringify({
          type: dbType,
          database: 'database/dental.db'
        }));
        
        setConnectionStatus('connected');
        setIsConnected(true);
      } else {
        // Handle PostgreSQL connection (to be implemented)
        throw new Error('PostgreSQL connection not implemented yet');
      }
    } catch (error) {
      console.log('Connection error:', error);
      setConnectionStatus('error');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setTables([]);
    localStorage.removeItem('dbConfig');
  };

  if (isConnected) {
    return (
      <div className="h-screen ">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-semibold text-white">Database Management</h1>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-600"
          >
            Disconnect
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <DatabaseViewer initialTables={tables} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Database className="w-6 h-6" />
            Database Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your dental practice database connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Database Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Database Type</label>
            <Select value={dbType} onValueChange={setDbType}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="sqlite">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    SQLite (Local)
                  </div>
                </SelectItem>
                <SelectItem value="postgresql">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    PostgreSQL (Neon)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Connection Details */}
          {dbType === 'sqlite' && (
            <div className="space-y-4">
              <Input
                className="bg-gray-700 border-gray-600"
                placeholder="Database File Path (e.g., database/dental.db)"
                value={dbConfig.database}
                onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                defaultValue="database/dental.db"
              />
            </div>
          )}

          {dbType === 'postgresql' && (
            <div className="space-y-4">
              <Input
                className="bg-gray-700 border-gray-600"
                placeholder="Host"
                value={dbConfig.host}
                onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
              />
              <Input
                className="bg-gray-700 border-gray-600"
                placeholder="Port"
                value={dbConfig.port}
                onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
              />
              <Input
                className="bg-gray-700 border-gray-600"
                placeholder="Username"
                value={dbConfig.username}
                onChange={(e) => setDbConfig({...dbConfig, username: e.target.value})}
              />
              <Input
                className="bg-gray-700 border-gray-600"
                type="password"
                placeholder="Password"
                value={dbConfig.password}
                onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
              />
              <Input
                className="bg-gray-700 border-gray-600"
                placeholder="Database Name"
                value={dbConfig.database}
                onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
              />
            </div>
          )}

          {/* Connection Status */}
          {connectionStatus === 'connected' && (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/50">
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Successfully connected to the database
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert className="bg-red-500/10 text-red-500 border-red-500/50">
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                Failed to connect to the database. Please check your credentials.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleConnect}
              disabled={!dbType || connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabasePage;