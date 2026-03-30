import { useState } from "react";
import { useToast } from '../../components/ui/toast-context'
import Uploader from '../../components/common/upload'
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config";
import { Box, Button } from "@mui/joy";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../components/ui/select";

function FileUploadPage() {
     const StudentCourseUnits = useSelector((state) => state.student?.results) || [];
     const  AlreadyRegistered =  useSelector((state) => state.student?.registeredUnits) || [];
  const CourseUnits = StudentCourseUnits.filter((unit) => AlreadyRegistered.includes(unit.id))?.map(i =>i?.name) ;
const {role} = useSelector((state) => state.auth)
const supervisor = useSelector((state) => state.student.bio.supervisor_name)
  const { addToast } = useToast();


  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activity,setActivity] = useState('')

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!supervisor) {
      addToast({message: "An Error Occured",variant:'destructive' });
      return;
    }

    if (!file) {
      addToast({message: "No File uploaded",variant:'destructive' });
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append("my_file", file);
    formData.append("supervisor", supervisor);

    try {
      console.log({formData})
      // const response = await fetch(`${API_BASE_URL}student/upload-work/`, {
      //   method: "POST",
      //   body: formData,
      // });
      // const result = await response.json();
 

      // if (response.ok && result.success) {
      //   addToast({message: "File uploaded successfully!",variant:'success' });
      //   // Reset
      //   setFile(null);
      //   setRecipient("");
      // } else {
      //   addToast({message: result.error || "Upload failed.",variant:'destructive' });
      // }
    } catch (error) {
        console.log(error)
      addToast({message: error.message,variant:'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const checkPlagiarism = async() => {
    alert ('Checking plagiarism')
  }

  return (
    <>
    
          <Uploader
            File={file}
            setFile={handleFileChange}
            LoadingState={loading}
            uploadedUrl={null}
            setUploadedUrl={() => {}}
            setLoadingState={setLoading}
          />
          <div className="my-6 flex justify-center">
            <Button
            variant='solid'
            color= {role === "student" ? 'primary' :'success'}
            sx={{width:'50%'}}
              className="w-full"
              onClick={role == "student" ? handleSubmit : checkPlagiarism}
              disabled={loading}
            >
             {loading ? 
  (role === "Student" ? "Uploading..." : "Checking...") 
  : 
  (role === "Lecturer" ? "Send File" : "Upload Work")
}
            </Button>
          </div>
          <Box>
 <Select

            onValueChange={(value) =>
             setActivity(value)
            }
            value={activity}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder = 'Select Activity to Upload' />
            </SelectTrigger>
            <SelectContent>
                    <SelectItem>
                     
                    </SelectItem>
            </SelectContent>
          </Select>
          </Box>
   
    </>
  );
}

export default FileUploadPage;