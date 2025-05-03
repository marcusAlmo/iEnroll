import React, { useState, useEffect } from "react";

type LogEntry = {
  timestamp: string;
  action: string;
  user: string;
};

// Create sample logs with more diverse data
const sampleLogs: LogEntry[] = Array.from({ length: 298 }, (_, i) => ({
  timestamp: "2024-08-29 10:45:00",
  action: i === 0 ? "Admin1 Logged in" : `Enrolled Student ${i + 12000}`,
  user: i === 0 ? "Admin1" : (i % 5 === 0 ? "Admin1" : "Admin2"),
}));

// Props interface to receive filters from parent component
interface HistoryLogsPanelProps {
  userFilter?: string;
  actionFilter?: string;
}

const HistoryLogsPanel: React.FC<HistoryLogsPanelProps> = ({ userFilter = "", actionFilter = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(sampleLogs);
  const itemsPerPage = 10;

  // Apply filters when filter props change
  useEffect(() => {
    let result = [...sampleLogs];
    
    // Filter by user if a user filter is selected
    if (userFilter) {
      result = result.filter(log => log.user === userFilter);
    }
    
    // Filter by action if an action filter is selected
    if (actionFilter) {
      result = result.filter(log => {
        // Check if the action includes the filter text
        return log.action.toLowerCase().includes(actionFilter.toLowerCase());
      });
    }
    
    setFilteredLogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [userFilter, actionFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow w-full overflow-hidden">
        <table className="w-full text-sm text-left table-auto border-collapse">
          <thead className="bg-white border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Date & Time</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Action</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">User</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-blue-200 transition duration-300">
                  <td className="px-4 py-3">{log.timestamp}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.user}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                  No records found matching the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Pagination & Footer */}
      <div className="flex flex-wrap items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <b>{filteredLogs.length > 0 ? startIndex + 1 : 0}</b> - <b>{Math.min(startIndex + itemsPerPage, filteredLogs.length)}</b> of {filteredLogs.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 text-sm border bg-white hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === 1 || filteredLogs.length === 0}
            aria-label="Previous Page"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm border-1 bg-accent text-black">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 text-sm border bg-white hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === totalPages || filteredLogs.length === 0}
            aria-label="Next Page"
          >
            Next
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background" 
        >
          Print List
        </button>
      </div>
    </div>
  );
};

export default HistoryLogsPanel;