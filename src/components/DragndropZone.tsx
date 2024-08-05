"use client";

import { useEffect, useState } from "react";
import { MdAudioFile } from "react-icons/md";

export function DragndropZone({
  onFileChange,
}: {
  onFileChange: (file: File) => void;
}) {
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();
  const [isEnter, setIsEnter] = useState(false);

  useEffect(() => {
    if (!file) return;
    onFileChange(file);
  }, [file]);

  return (
    <label htmlFor="uploadFile" className="flex w-full justify-center">
      <input
        id="uploadFile"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) return;

          const fileType = e.target.files[0].type;
          // if (
          //   !fileType.startsWith("image/png") &&
          //   !fileType.startsWith("image/jpeg")
          // ) {
          //   setError("Please upload a photo");
          //   setFile(undefined);
          //   return;
          // }
          // setStartUpload(true);
          // setPreview("");
          setFile(e.target.files[0]);
          setError("");
        }}
      />
      <div
        className={`w-full h-[72px] border-2 items-center rounded-3xl flex justify-center text-black overflow-hidden ${
          isEnter ? "border-green-400 " : "border-[#F4F4F4]"
        } ${!file ? "border-dashed" : ""}
        `}
        id="dropzone"
        onDragEnter={(e) => {
          e.preventDefault();
          setIsEnter(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsEnter(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsEnter(false);
          const fileType = e.dataTransfer.files[0].type;
          // if (
          //   !fileType.startsWith("image/png") &&
          //   !fileType.startsWith("image/jpeg")
          // ) {
          //   setError("Please upload a audio file.");
          //   return;
          // }
          setFile(e.dataTransfer.files[0]);
          setError("");
        }}
      >
        <div
          className={`flex flex-col h-full w-full items-center justify-center pointer-events-none gap-8 ${
            isEnter ? "text-green-400" : "text-[#F4F4F4]"
          }`}
        >
          <div className="items-center flex mx-4 text-center pointer-events-none text-lg gap-2 ">
            {!!file ? (
              file.name
            ) : (
              <>
                <MdAudioFile size={24} className="hidden sm:block" />
                <div className="line-clamp-1 sm:text-base text-xs">
                  Drag or paste, or click here to select file.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </label>
  );
}
