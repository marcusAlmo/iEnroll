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
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from "@/app/admin/context/useEnrollmentReview";
import Enums from "@/services/common/types/enums";
import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/services/common/file";

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFileReady, setIsFileReady] = useState(false);

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
    queryFn: async () => {
      try {
        const fileUrl =
          selectedRequirement?.imageUrl || selectedRequirement?.fileUrl;

        // Throw an error if no file URL is available
        if (!fileUrl) {
          throw new Error("No file URL provided");
        }

        const response = await getFile(fileUrl);

        // Ensure we have valid data
        if (response?.data) {
          // If it's a Blob, convert it to a URL
          if (response.data instanceof Blob) {
            // Check if the blob is not empty
            if (response.data.size === 0) {
              throw new Error("File is empty");
            }
            return URL.createObjectURL(response.data);
          }

          // If it's already a URL or base64, return as is
          return response.data;
        }
        throw new Error("Invalid file data received");
      } catch (error) {
        console.error("Error loading file:", error);
        throw error;
      }
    },
    enabled: Boolean(
      selectedRequirement?.imageUrl || selectedRequirement?.fileUrl,
    ),
  });

  // Create and manage file URL
  const previousUrl = useRef<string | null>(null);
  useEffect(() => {
    // Clean up previous URL if it exists
    return () => {
      if (previousUrl.current) {
        URL.revokeObjectURL(previousUrl.current);
      }
    };
  }, []);

  // Set file URL when fileBlob changes
  useEffect(() => {
    if (fileBlob) {
      setFileUrl(fileBlob);
      setIsFileReady(true);
      previousUrl.current = fileBlob;
    } else {
      setIsFileReady(false);
    }
  }, [fileBlob]);

  const handleDownload = useCallback(() => {
    if (fileUrl && selectedRequirement) {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = selectedRequirement.fileName || "download";

      // Append to the document and trigger click
      document.body.appendChild(link);
      link.click();

      // Clean up
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

  // Check file type
  const isPdfFile =
    selectedRequirement?.fileName?.toLowerCase().endsWith(".pdf") ||
    selectedRequirement?.fileUrl?.toLowerCase().endsWith(".pdf");

  if (!isModalOpen || !requirements?.length || !selectedRequirement)
    return null;

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
          {/* IMAGE VIEWER */}
          {selectedRequirement.requirementType ===
          Enums.requirement_type.image ? (
            <div className="relative overflow-hidden" ref={imageContainerRef}>
              <div className="absolute top-5 right-0 z-10 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="button-transition text-accent hover:bg-accent cursor-pointer rounded-full bg-white px-[7px] py-[5px] hover:text-white"
                  title="Download Image"
                  disabled={!isFileReady}
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
            /* DOCUMENT DOWNLOAD ONLY - No PDF Viewer */
            <div className="mt-5 flex h-[700px] w-[600px] flex-col items-center justify-center rounded-[10px] bg-white p-8">
              {isFilePending ? (
                <div className="flex h-full items-center justify-center">
                  <p>Loading document information...</p>
                </div>
              ) : loadError || fileError ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-xl text-red-500">
                    Failed to load document
                  </p>
                  <p className="mt-2 text-gray-500">
                    {loadError ||
                      fileError?.message ||
                      "The document could not be loaded."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex flex-col items-center justify-center">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="text-accent mb-4 text-8xl"
                    />
                    <h3 className="text-xl font-semibold">
                      {selectedRequirement.fileName || "Document"}
                    </h3>
                    <p className="text-text-2 mt-2 max-w-md text-center">
                      This document is ready for download. Click the button
                      below to download and review it.
                    </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={!isFileReady}
                    className={`bg-accent hover:bg-primary flex items-center gap-3 rounded-lg px-6 py-3 text-lg font-medium text-white transition-all ${
                      !isFileReady ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    Download {isPdfFile ? "PDF" : "Document"}
                  </button>

                  {selectedRequirement.fileUrl && (
                    <a
                      href={fileUrl || selectedRequirement.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-primary mt-4 font-medium hover:underline"
                    >
                      Open in new tab
                    </a>
                  )}
                </>
              )}
            </div>
          ) : (
            /* TEXT INPUT REQUIREMENT */
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
            </div>
          )}

          {/* APPROVAL CONTROLS */}
          <div className="ml-4 flex h-auto w-2xl flex-col items-center justify-center rounded-[10px] bg-white p-5">
            <div className="flex flex-row items-center justify-center gap-x-5 text-center font-semibold">
              {/* Approve Button */}
              {selectedRequirement.requirementStatus !== "invalid" && (
                <button
                  disabled={
                    selectedRequirement.requirementStatus === "accepted"
                  }
                  onClick={() => {
                    handleRequirementStatus(true);
                    setShowDenialReason(false);
                  }}
                  className={`flex items-center rounded-[10px] border-2 px-4 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-115 ${
                    selectedRequirement.requirementStatus === "accepted"
                      ? "border-success text-success cursor-not-allowed opacity-50"
                      : "border-success text-success hover:bg-success cursor-pointer hover:text-white"
                  }`}
                >
                  {selectedRequirement.requirementStatus === "accepted"
                    ? "APPROVED"
                    : "APPROVE"}
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="ml-2 text-xl"
                  />
                </button>
              )}

              {/* Deny Button */}
              {selectedRequirement.requirementStatus !== "accepted" && (
                <button
                  disabled={selectedRequirement.requirementStatus === "invalid"}
                  onClick={() => setShowDenialReason(true)}
                  className={`flex items-center rounded-[10px] border-2 px-9 py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:scale-115 ${
                    selectedRequirement.requirementStatus === "invalid"
                      ? "border-danger text-danger cursor-not-allowed opacity-50"
                      : "border-danger text-danger hover:bg-danger cursor-pointer hover:text-white"
                  }`}
                >
                  {selectedRequirement.requirementStatus === "invalid"
                    ? "DENIED"
                    : "DENY"}
                  <FontAwesomeIcon
                    icon={faSquareXmark}
                    className="ml-2 text-xl"
                  />
                </button>
              )}
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
