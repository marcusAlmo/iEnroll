import { ReactNode, useEffect, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (offset: number) => void;
  children?: ReactNode;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  totalPages,
  onPageChange,
  children,
}) => {
  const [inputValue, setInputValue] = useState<number | string>(currentPage);

  useEffect(() => {
    setInputValue(currentPage); // Sync input value with the current page
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value); // Allow only numeric input
    }
  };

  const handleInputBlur = () => {
    if (typeof inputValue === "string") {
      const page = Math.max(1, Math.min(Number(inputValue), totalPages));
      if (page !== currentPage) {
        onPageChange(page - currentPage); // Adjust offset based on the difference
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && typeof inputValue === "string") {
      const page = Math.max(1, Math.min(Number(inputValue), totalPages));
      if (page !== currentPage) {
        onPageChange(page - currentPage);
      }
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        Showing{" "}
        <span className="font-semibold">
          {totalItems > 0 ? `${startItem}-${endItem}` : "0"}
        </span>{" "}
        of {totalItems} results
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-2 bg-container-2 text-text font-semibold  ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-background transition-all ease-in-out"
          }`}
          onClick={() => onPageChange(-1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <input
          type="text"
          className="border-container w-12 bg-secondary px-3 py-2 text-center font-semibold hover:bg-background transition-all ease-in-out"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className={`px-3 py-2 bg-container-2 text-text font-semibold hover:bg-background transition-all ease-in-out ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {children}
    </div>
  );
};