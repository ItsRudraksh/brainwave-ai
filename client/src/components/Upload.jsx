import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { attachmentImg } from "../assets";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/imagekit/auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    console.log(data);
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImg }) => {
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{ display: "none" }}
          ref={ikUploadRef}
        />
        {
          <label
            onClick={() => ikUploadRef.current.click()}
            className="cursor-pointer"
          >
            <img src={attachmentImg} alt="" className="w-5 h-5" />
            <span className="tooltip-text">Upload Image</span>
          </label>
        }
      </IKContext>
      <style>{`
        .tooltip-text {
          visibility: hidden;
          background-color: #0e0c15;
          color: #fff;
          text-align: center;
          padding: 8px 12px;
          border-radius: 6px;
          position: absolute;
          z-index: 1;
          bottom: 100%; /* Position above the upload button */
          left: 5%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s, bottom 0.3s;
          font-size: 14px;
          white-space: nowrap;
        }

        .tooltip-text::after {
          content: "";
          position: absolute;
          bottom: -10px; /* Position the arrow just below the tooltip */
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px;
          border-style: solid;
          border-color: #25232c transparent transparent transparent;
        }

        label:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
          bottom: 120%; /* Adjust for smooth transition */
        }
      `}</style>
    </div>
  );
};

export default Upload;
