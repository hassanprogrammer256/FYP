import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config";
import Loading from "../ui/loading";
import { Button } from "@mui/joy";
import { Input } from "../ui/input";
import Spinner from "../ui/spinner";
import { Label } from "../ui/label";

function Uploader({
  File,
  setFile,
 LoadingState,
  uploadedUrl,
  setUploadedUrl,
  setLoadingState,
 
}) {
  const inputRef = useRef(null);
  function handleFileChange(event) {

    const selectedFile = event.target.files?.[0];
   

    if (selectedFile) setFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    setLoadingState(true)
    event.preventDefault();
    try {
         const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {setFile(droppedFile);} 
    } catch (error) {
      console.error("Error", error)
    }finally{
      setLoadingState(false)
    }

  }

  function handleRemove() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`w-full mt-4 max-w-md mx-auto`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload File</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="file-upload"
          type="file"
          className=" opacity-0 cursor-pointer"
          ref={inputRef}
          onChange={handleFileChange}
          
        />
        {!File ? (
          <Label
            htmlFor="upload"
            className={`flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 mb-2" ref={inputRef} />
            <span>Drag & drop or click to upload</span>
          </Label>
        ) : LoadingState ? (
          <Loading size="sm" message="uploading" color="primary" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8 " />
            </div>
            <p className="text-sm font-medium">{File.name}</p>
            <Button
              variant="solid"
              size="lg"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemove}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Uploader;