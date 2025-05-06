import { requestData } from "@/lib/dataRequester";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

type LogEntry = {
  initiator: string;
  role: string;
  systemAction: string;
  details: string;
  logDatetime: string;
};

// Props interface to receive filters from parent component
interface HistoryLogsPanelProps {
  userFilter: string;
  startDate: string;
  endDate: string;
}

const HistoryLogsPanel: React.FC<HistoryLogsPanelProps> = ({
  userFilter,
  startDate,
  endDate
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const itemsPerPage = 10;

  const retrieveHistoryLogs = async () => {
    try {
      const response = await requestData<LogEntry[]>({
        url: "http://localhost:3000/api/history-and-logs/retrieve-history-logs",
        method: "GET",
      });

      if (response) {
        setLogs(response);
        setFilteredLogs(response); // Initialize filtered logs with all logs
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
      console.error(err);
    }
  };

  useEffect(() => {
    retrieveHistoryLogs();
  }, []);

    // Apply filters when filter props change
    useEffect(() => {
      let result = [...logs];
      
      // Filter by role
      if (userFilter) {
        result = result.filter(log => 
          log.role.toLowerCase() === userFilter.toLowerCase()
        );
      }
      
      // Filter by date range
      if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime() + 86400000; // Add 1 day to include end date
        
        result = result.filter(log => {
          const logDate = new Date(log.logDatetime).getTime();
          return logDate >= start && logDate <= end;
        });
      }
  
      setFilteredLogs(result);
      setCurrentPage(1); // Reset to first page when filters change
    }, [userFilter, startDate, endDate, logs]);
  
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  
    const formatDateTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow w-full overflow-hidden">
        <table className="w-full text-sm text-left table-auto border-collapse">
          <thead className="bg-white border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Date & Time</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Initiator</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Role</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Action</th>
              <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-blue-200 transition duration-300">
                  <td className="px-4 py-3">{formatDateTime(log.logDatetime)}</td>
                  <td className="px-4 py-3">{log.initiator}</td>
                  <td className="px-4 py-3">{`${log.role.charAt(0).toUpperCase()}${log.role.slice(1)}`}</td>
                  <td className="px-4 py-3">{log.systemAction}</td>
                  <td className="px-4 py-3">{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
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