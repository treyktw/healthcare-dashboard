import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  Table2, 
  Settings, 
  RefreshCcw,
  Filter,
  Download,
  Plus,
} from 'lucide-react';

interface DatabaseViewerProps {
  initialTables: string[];
}

const DatabaseViewer: React.FC<DatabaseViewerProps> = ({ initialTables }) => {
  const [selectedSchema, setSelectedSchema] = useState('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Filter tables based on search query
  const filteredTables = initialTables.filter(table => 
    table.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch table data when a table is selected
  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedTable) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/database/${selectedTable}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setTableData(data.data || []);
        }
      } catch (error) {
        console.log('Failed to fetch table data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [selectedTable]);

  return (
    <div className="flex h-screen text-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-sm text-gray-400">TABLES</div>
          <div className="space-y-1">
            {filteredTables.map((table) => (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center ${
                  selectedTable === table ? 'bg-gray-800 text-blue-500' : ''
                }`}
              >
                <Table2 className="h-4 w-4 mr-2" />
                {table}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select 
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1"
              value={selectedSchema}
              onChange={(e) => setSelectedSchema(e.target.value)}
            >
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
            <RefreshCcw 
              className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-500"
              onClick={() => {
                if (selectedTable) {
                  setSelectedTable(selectedTable); // This will trigger a re-fetch
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="px-3 py-1 bg-blue-600 rounded-md flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : selectedTable ? (
            tableData.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    {Object.keys(tableData[0]).map((column) => (
                      <th key={column} className="pb-3 pr-4 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex}
                      className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                    >
                      {Object.values(row).map((value: any, colIndex) => (
                        <td key={colIndex} className="py-3 pr-4">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No records found in this table
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Database className="h-12 w-12 mb-4" />
              <p>Select a table to view its data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseViewer;