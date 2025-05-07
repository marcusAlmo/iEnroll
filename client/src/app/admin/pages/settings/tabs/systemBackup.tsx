/* eslint-disable prefer-const */
import { Pagination } from "@/components/DynamicTable";
import data from "@/test/data/system-backup.json";
import { useState } from "react";

type SystemBackup = {
  dateTime: string;
  fileName: string;
  filePath: string;
  user: string;
  remarks: string;
};

const SystemBackup = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (offset: number) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + offset;
      return Math.max(1, Math.min(newPage, totalPages)); // Ensure the page stays within bounds
    });
  };

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  return data.length === 0 ? (
    <>No items found.</>
  ) : (
    <div>
      <table className="min-w-full bg-background rounded-t-[10px]">
        <thead className="bg-accent">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b rounded-tl-[10px]">
              Date & Time
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              File Name
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              File Path
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">User</th>
            <th className="py-3 px-4 text-left font-semibold border-b rounded-tr-[10px]">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((backup: SystemBackup, index) => (
            <tr key={index} className="hover:bg-gray-200">
              <td className="py-3 px-4 border-b">
                {new Date(backup.dateTime).toLocaleString()}
              </td>
              <td className="py-3 px-4 border-b">{backup.fileName}</td>
              <td className="py-3 px-4 border-b">{backup.filePath}</td>
              <td className="py-3 px-4 border-b">{backup.user}</td>
              <td className="py-3 px-4 border-b">{backup.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SystemBackup
