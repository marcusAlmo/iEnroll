import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCheckSquare,
  faSquareXmark,
  faDownload,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from "@/app/admin/context/useEnrollmentReview";
import Enums from "@/services/common/types/enums";
import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/services/common/file";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const RequirementsCarouselModal: React.FC = () => {
  const {
    selectedRequirement,
    requirements,
    handleNext,
    handlePrevious,
    handleRequirementStatus,
    isModalOpen,
    setIsModalOpen,
  } = useEnrollmentReview();

  // Local state
  const [showDenialReason, setShowDenialReason] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  // PDF document load event handler
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoadError(null);
  };

  // Page navigation
  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max((prevPageNumber || 1) + offset, 1), numPages || 1),
    );
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  // File fetching
  const {
    data: fileBlob,
    isPending: isFilePending,
    error: fileError,
  } = useQuery({
    queryKey: [
      "assignedRequirementsBlob",
      selectedRequirement?.applicationId,
      selectedRequirement?.requirementId,
    ],
    queryFn: () => {
      return getFile(selectedRequirement!.imageUrl!);
    },
    select: (data) => data.data,
    enabled: Boolean(selectedRequirement?.imageUrl),
    // retry: 1,
  });

  // Create and manage file blob URL

  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    // Clear previous error and revoke any previous object URL
    setLoadError(null);

    if (previousUrl.current) {
      URL.revokeObjectURL(previousUrl.current);
      previousUrl.current = null;
    }

    // Handle loading error
    if (fileError) {
      console.error("Error loading file:", fileError);
      setLoadError("Failed to load file. Please try again later.");
      return;
    }

    // Handle blob conversion if ready
    if (!isFilePending && fileBlob) {
      console.log("File blob received:", fileBlob);
      try {
        const mimeType =
          selectedRequirement?.requirementType ===
          Enums.requirement_type.document
            ? "application/pdf"
            : selectedRequirement?.requirementType ===
                Enums.requirement_type.image
              ? "image/jpeg"
              : "application/octet-stream"; // Fallback MIME type

        const url = URL.createObjectURL(
          new Blob([fileBlob], { type: mimeType }),
        );
        setFileUrl(url);
        previousUrl.current = url;
      } catch (error) {
        console.error("Error creating object URL:", error);
        setLoadError("Error processing file. Please try again later.");
      }
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (previousUrl.current) {
        URL.revokeObjectURL(previousUrl.current);
        previousUrl.current = null;
      }
    };
  }, [fileBlob, isFilePending, fileError, selectedRequirement]);

  const handleDownload = useCallback(() => {
    if (fileUrl && selectedRequirement) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = selectedRequirement.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [fileUrl, selectedRequirement]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    setPosition({ x: 0, y: 0 });
  };

  // Image drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Calculate bounds based on zoom level
      const maxOffset = (zoomLevel - 1) * 250;
      const boundedX = Math.max(Math.min(newX, maxOffset), -maxOffset);
      const boundedY = Math.max(Math.min(newY, maxOffset), -maxOffset);

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (!isModalOpen || !requirements?.length || !selectedRequirement)
    return null;

  // Check file type
  const isPdfFile =
    selectedRequirement?.fileName?.toLowerCase().endsWith(".pdf") ||
    selectedRequirement?.imageUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex justify-end">
        <button
          className="bg-danger absolute top-2 right-2 cursor-pointer rounded-[10px] px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-115 hover:bg-red-950"
          onClick={() => setIsModalOpen(false)}
        >
          Exit
        </button>
      </div>

      <div className="mb-4 flex w-full flex-row items-center justify-between px-5">
        <FontAwesomeIcon
          icon={faCircleArrowLeft}
          onClick={() => {
            handlePrevious();
            setShowDenialReason(false);
          }}
          className="hover:text-accent cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115"
        />

        <div className="flex w-full flex-row items-center justify-center p-10">
          {selectedRequirement.requirementType ===
          Enums.requirement_type.image ? (
            <div className="relative overflow-hidden" ref={imageContainerRef}>
              <div className="absolute top-5 right-0 z-10 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="button-transition text-accent hover:bg-accent cursor-pointer rounded-full bg-white px-[7px] py-[5px] hover:text-white"
                  title="Download Image"
                >
                  <FontAwesomeIcon icon={faDownload} className="text-base" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="button-transition text-accent hover:bg-accent cursor-pointer rounded-full bg-white px-[7px] py-[5px] hover:text-white"
                  title="Zoom In"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlassPlus}
                    className="text-xl"
                  />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="button-transition text-accent hover:bg-accent cursor-pointer rounded-full bg-white px-[7px] py-[5px] hover:text-white"
                  title="Zoom Out"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlassMinus}
                    className="text-xl"
                  />
                </button>
              </div>
              <div
                className="mt-5 h-[700px] w-[600px] cursor-grab rounded-[10px] active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {isFilePending ? (
                  <div className="flex h-full items-center justify-center bg-white">
                    <p>Loading image...</p>
                  </div>
                ) : loadError || fileError ? (
                  <div className="flex h-full flex-col items-center justify-center bg-white p-4 text-center">
                    <p className="text-red-500">Failed to load image</p>
                    <p className="text-sm text-gray-500">
                      The image could not be loaded. Please try again later.
                    </p>
                  </div>
                ) : (
                  fileUrl && (
                    <img
                      src={fileUrl}
                      alt={selectedRequirement.requirementName}
                      className="h-full w-full object-contain transition-transform duration-300"
                      style={{
                        transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                        transformOrigin: "center center",
                      }}
                      draggable="false"
                      onError={() => setLoadError("Failed to load image")}
                    />
                  )
                )}
              </div>
            </div>
          ) : selectedRequirement.requirementType ===
            Enums.requirement_type.document ? (
            <div className="relative overflow-hidden">
              <div className="absolute top-5 right-0 z-10 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="button-transition text-accent hover:bg-accent cursor-pointer rounded-full bg-white px-[7px] py-[5px] hover:text-white disabled:opacity-50"
                  title="Download Document"
                  disabled={!fileUrl}
                >
                  <FontAwesomeIcon icon={faDownload} className="text-base" />
                </button>
              </div>
              <div className="mt-5 max-h-[700px] w-[600px] overflow-auto rounded-[10px] bg-gray-100 p-4">
                {loadError || fileError ? (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <p className="text-red-500">Failed to load document</p>
                    <p className="text-sm text-gray-500">
                      {loadError ||
                        fileError?.message ||
                        "The document could not be loaded. Please try again later."}
                    </p>
                  </div>
                ) : isFilePending ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Loading document...</p>
                  </div>
                ) : fileUrl && isPdfFile ? (
                  <div>
                    <Document
                      file={fileUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(error) => {
                        console.error("PDF load error:", error);
                        setLoadError(`Error loading PDF: ${error.message}`);
                      }}
                      loading={
                        <div className="flex h-full items-center justify-center">
                          <p>Loading PDF...</p>
                        </div>
                      }
                      error={
                        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                          <p className="text-red-500">Failed to load PDF</p>
                          <p className="text-sm text-gray-500">
                            The PDF could not be loaded.
                          </p>
                        </div>
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={550}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="flex h-64 items-center justify-center">
                            <p>Loading page {pageNumber}...</p>
                          </div>
                        }
                        error={
                          <div className="flex h-64 items-center justify-center text-red-500">
                            <p>Error loading page {pageNumber}</p>
                          </div>
                        }
                      />
                    </Document>
                    {numPages !== null && numPages > 0 && (
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <button
                          type="button"
                          disabled={pageNumber <= 1}
                          onClick={previousPage}
                          className="text-accent hover:text-primary disabled:text-gray-400"
                        >
                          <FontAwesomeIcon
                            icon={faCircleArrowLeft}
                            className="text-2xl"
                          />
                        </button>
                        <span>
                          Page {pageNumber} of {numPages || "--"}
                        </span>
                        <button
                          type="button"
                          disabled={!numPages || pageNumber >= numPages}
                          onClick={nextPage}
                          className="text-accent hover:text-primary disabled:text-gray-400"
                        >
                          <FontAwesomeIcon
                            icon={faCircleArrowRight}
                            className="text-2xl"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <p className="mb-4">Document preview not available</p>
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Open Document
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ml-4 flex h-auto w-xl flex-col justify-between rounded-[10px] bg-white p-10">
              <label
                htmlFor="requirementType"
                className="text-primary mb-2 font-semibold"
              >
                {selectedRequirement.requirementName}
              </label>
              <Input
                id="requirementType"
                type="text"
                value={selectedRequirement.userInput}
                readOnly
                className="border-text-2 focus:border-accent focus:ring-accent block w-full rounded-[10px] border-2 px-4 py-2 sm:text-sm"
              />
              {/* <div className="flex flex-row items-center justify-between">
                <h2 className="font-bold text-primary mb-5">Requirements</h2>
                <h2 className="font-bold text-primary mb-5">Select All</h2>
              </div>
              {requirements
                .filter(req => req.requirementType === "input")
                .map((req, index) => (
                  <div key={req.requirementName} className="flex flex-row items-center justify-between">
                    <div className="mb-4 w-full">
                      <label className="block text-sm font-semibold text-text">
                        {req.requirementName}
                      </label>
                      <Input
                        type="text"
                        defaultValue={req.userInput || ""}
                        className="mt-1 px-4 py-2 block w-full rounded-[10px] border-2 border-text-2 focus:border-accent focus:ring-accent sm:text-sm"
                        onChange={(e) => {
                          console.log(`Input for ${req.requirementName}:`, e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCheckSquare}
                        className="mt-2 ml-5 cursor-pointer text-[46px] text-text-2 transition-all duration-500 ease-in-out hover:text-accent"
                      />
                    </div>
                  </div>
                ))} */}
            </div>
          )}

          <div className="ml-4 flex h-auto w-2xl flex-col items-center justify-center rounded-[10px] bg-white p-5">
            <div className="flex flex-row items-center justify-center gap-x-5 text-center font-semibold">
              <button
                onClick={() => {
                  handleRequirementStatus(true);
                  setShowDenialReason(false);
                }}
                className="border-success text-success hover:bg-success flex cursor-pointer items-center rounded-[10px] border-2 px-4 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-115 hover:text-white"
              >
                APPROVED
                <FontAwesomeIcon
                  icon={faCheckSquare}
                  className="ml-2 text-xl"
                />
              </button>

              <button
                onClick={() => setShowDenialReason(true)}
                className="border-danger text-danger hover:bg-danger flex cursor-pointer items-center rounded-[10px] border-2 px-9 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-115 hover:text-white"
              >
                DENY
                <FontAwesomeIcon
                  icon={faSquareXmark}
                  className="ml-2 text-xl"
                />
              </button>
            </div>

            {showDenialReason && (
              <>
                <Input
                  type="text"
                  placeholder="Please state the reason for the denial."
                  className="border-text-2 focus:border-accent focus:ring-accent mt-1 block h-[150px] w-full rounded-[10px] border-2 px-4 py-2 sm:text-sm"
                  onChange={(e) => setDenialReason(e.target.value)}
                />
                <button
                  onClick={() => {
                    handleRequirementStatus(false, denialReason);
                    setShowDenialReason(false);
                  }}
                  className="bg-accent hover:bg-primary mt-5 cursor-pointer rounded-[10px] px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out"
                >
                  I confirm, deny requirement
                </button>
              </>
            )}
            <p className="text-text-2 mt-5 px-10 text-center">
              Upon denial, the student will receive an automated request to
              resubmit the application with necessary corrections.
            </p>
          </div>
        </div>

        <FontAwesomeIcon
          icon={faCircleArrowRight}
          onClick={() => {
            handleNext();
            setShowDenialReason(false);
          }}
          className="hover:text-accent cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115"
        />
      </div>
    </div>
  );
};
