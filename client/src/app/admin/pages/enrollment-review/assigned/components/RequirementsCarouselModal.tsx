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
  // local declaration here kasi nagkakaproblema sa context nagstastale
  const [showDenialReason, setShowDenialReason] = useState(false);
  const [denialReason, setDenialReason] = useState(""); // State to store the denial reason
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data: fileBlob, isPending: isFilePending } = useQuery({
    queryKey: [
      "assignedRequirementsBlob",
      selectedRequirement?.applicationId,
      selectedRequirement?.requirementId,
    ],
    queryFn: () => getFile(selectedRequirement!.imageUrl!),
    select: (data) => data.data,
    enabled:
      Boolean(selectedRequirement) && Boolean(selectedRequirement?.imageUrl),
  });

  useEffect(() => {
    if (!isFilePending && fileBlob) {
      const url = URL.createObjectURL(fileBlob);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    }
  }, [fileBlob, isFilePending]);

  // const handleDownload = () => {
  //   if (selectedRequirement?.imageUrl) {
  //     window.open(selectedRequirement.imageUrl, "_blank");
  //   }
  // };

  const handleDownload = useCallback(() => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  }, [fileUrl]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    setPosition({ x: 0, y: 0 }); // Reset position when zooming
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    setPosition({ x: 0, y: 0 }); // Reset position when zooming
  };

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
      const maxOffset = (zoomLevel - 1) * 250; // 250 is half of the image width
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
                {fileUrl && (
                  <img
                    src={fileUrl}
                    alt={selectedRequirement.requirementName}
                    className="h-full w-full object-contain transition-transform duration-300"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                      transformOrigin: "center center",
                    }}
                    draggable="false"
                  />
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
                  onChange={(e) => setDenialReason(e.target.value)} // Update denial reason state
                />
                <button
                  onClick={() => {
                    console.log("Submitting denial reason:", denialReason); // Log the denial reason
                    handleRequirementStatus(false, denialReason); // Pass the denial reason to the handler
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
