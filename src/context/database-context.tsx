// context/DatabaseContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DatabaseContextType {
  isConnected: boolean;
  connectionType: string | null;
  tables: string[];
  currentSchema: string;
  connect: (config: any) => Promise<void>;
  disconnect: () => void;
  refreshTables: () => Promise<void>;
  setCurrentSchema: (schema: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [currentSchema, setCurrentSchema] = useState('public');

  // Check for existing connection on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dbConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setConnectionType(config.type);
      setIsConnected(true);
      refreshTables();
    }
  }, []);

  const connect = async (config: any) => {
    try {
      // Here you would implement the actual database connection logic
      localStorage.setItem('dbConfig', JSON.stringify(config));
      setConnectionType(config.type);
      setIsConnected(true);
      await refreshTables();
    } catch (error) {
      throw new Error('Failed to connect to database');
    }
  };

  const disconnect = () => {
    localStorage.removeItem('dbConfig');
    setIsConnected(false);
    setConnectionType(null);
    setTables([]);
  };

  const refreshTables = async () => {
    try {
      // Here you would fetch the actual tables from the database
      // For now, we'll use mock data
      const mockTables = ['patients', 'appointments', 'treatments', 'payments'];
      setTables(mockTables);
    } catch (error) {
      console.log('Failed to refresh tables:', error);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        isConnected,
        connectionType,
        tables,
        currentSchema,
        connect,
        disconnect,
        refreshTables,
        setCurrentSchema,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}