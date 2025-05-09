import {
  faCamera,
  faImage,
  faPaperclip,
  faFileLines,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import CustomAlertDialog from "@/components/CustomAlertDialog";

type UploadBoxProps<T extends FieldValues> = {
  label: string;
  requirementType: "image" | "document";
} & UseControllerProps<T>;

const UploadBox = <T extends FieldValues>({
  label,
  requirementType = "image",
  ...controllerProps
}: UploadBoxProps<T>) => {
  const { field } = useController(controllerProps);
  const [fileName, setFileName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      field.onChange(file); // register with form
    }
  };

  const clearFileInput = () => {
    setFileName("");
    field.onChange(null);
    setShowModal(false);
  };

  const isImage = requirementType === "image";
  const acceptTypes = isImage ? "image/*" : ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx";

  const displayName =
    fileName.length > 30
      ? fileName.slice(0, 20) + "..." + fileName.split(".").pop()?.toLowerCase()
      : fileName;

  return (
    <>
      <div className="text-primary text-sm font-semibold mb-2">{label}</div>
      <div className="rounded-[10px] border border-text-2 bg-border-1 py-4 px-7">
        {!field.value ? (
          <div className="flex flex-col gap-y-2.5">
            {isImage && (
              <>
                <input
                  type="file"
                  accept={acceptTypes}
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => cameraInputRef.current?.click()}
                  className="cursor-pointer flex flex-row justify-center items-center gap-x-2.5 bg-background rounded-[10px] py-3"
                >
                  <FontAwesomeIcon icon={faCamera} className="text-text-2" style={{ fontSize: "24px" }} />
                  <span className="font-semibold text-sm text-text-2">Take a photo</span>
                </div>
                <span className="text-center text-sm font-semibold text-text-2">or</span>
              </>
            )}

            <input
              type="file"
              accept={acceptTypes}
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-row justify-center items-center gap-x-2.5 bg-background rounded-[10px] py-3"
            >
              <FontAwesomeIcon icon={faPaperclip} className="text-text-2" style={{ fontSize: "24px" }} />
              <span className="font-semibold text-sm text-text-2">
                {isImage ? "Upload image" : "Upload document"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2.5">
            <div className="flex flex-row items-center gap-x-2.5 rounded-[10px] py-3 text-sm px-5 bg-background">
              <FontAwesomeIcon
                icon={isImage ? faImage : faFileLines}
                className="text-text-2"
                style={{ fontSize: "24px" }}
              />
              <span>{displayName}</span>
            </div>
            <div
              onClick={() => setShowModal(true)}
              className="rounded-[10px] border border-danger bg-danger/20 text-danger font-semibold py-3 text-sm text-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Remove and re-upload
            </div>
          </div>
        )}
      </div>

      <CustomAlertDialog
        isOpen={showModal}
        title="Remove current upload?"
        description="Are you sure you want to re-upload this requirement?"
        cancelLabel="No"
        cancelOnClick={() => setShowModal(false)}
        actionLabel="Yes"
        actionOnClick={clearFileInput}
      />
    </>
  );
};

export default UploadBox;
