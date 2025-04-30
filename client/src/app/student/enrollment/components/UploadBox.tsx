import { faCamera, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type UploadBoxProps = {
  label: string;
}

const UploadBox = ({
  label
}: UploadBoxProps) => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  return (
    <>
      <div className="text-primary text-sm font-semibold mb-2">{label}</div>
      <div className="rounded-[10px] border border-text-2 bg-border-1 py-4 px-7">
        {!isUploaded 
          ? (
              <div className="flex flex-col gap-y-2.5">
                <button 
                  className="flex flex-row justify-center items-center gap-x-2.5 bg-background rounded-[10px] py-3"
                  onClick={() => console.log("Clicked")}
                >
                  <FontAwesomeIcon icon={faCamera} className="text-text-2" style={{ fontSize: "24px" }} />
                  <span className="font-semibold text-sm text-text-2">Take a photo</span>
                </button>

                <span className="text-center text-sm font-semibold text-text-2">or</span>
                
                <button 
                  className="flex flex-row justify-center items-center gap-x-2.5 bg-background rounded-[10px] py-3"
                  onClick={() => console.log("Clicked")}
                >
                  <FontAwesomeIcon icon={faPaperclip} className="text-text-2" style={{ fontSize: "24px" }} />
                  <span className="font-semibold text-sm text-text-2">Upload attachment</span>
                </button>
              </div>
            )
          : (
              <div>
              </div>
            )
        }
      </div>
    </>
  )
}

export default UploadBox
