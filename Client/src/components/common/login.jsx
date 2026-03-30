import{ useState } from 'react';
import {login } from '../../features/authSlice';
import {FaUser} from 'react-icons/fa'
import App_Logo from '/SmartFYP_Logo.png'
import Form from './Form';
import { LoginFormFields } from '../../config';
import {useDispatch} from 'react-redux'
import { useToast } from '../ui/toast-context';
import { useNavigate } from 'react-router-dom';




const LogIn = () => {
  const role = localStorage.getItem('role') || ''
 const dispatch= useDispatch()
 const  [isloading,setIsloading] = useState(false)
  const userData = {username: '', password: ''}
  const [formData,setformData] = useState(userData)
const  {addToast}  = useToast();
const navigate = useNavigate()




 const isFormValid = () => {
  return Object.keys(formData)
    .map((key) => formData[key] !== "")
    .every((item) => item);
 
   
}

    const  handleSubmit = async(event) => {
      event.preventDefault();
      setIsloading(true)
 await dispatch(login(formData)).then((data) => {
if (data?.payload?.success) {
  setIsloading(false)
  addToast({message:'Logged in successfully',variant:'success'})
  if( role === 'student') {
    navigate('/student/dashboard')
  }
  if( role === 'supervisor') {
    navigate('/supervisor/dashboard')
  }


} else {
  setIsloading(false)
 addToast({ message: "Login Failed", variant: 'destructive' });
}
})}

  return (
   <div className="h-screen bg-gradient-to-b from-scsc-green from-50% to-white to-50% flex flex-col items-center justify-center gap-10 px-2">

  <div className="flex flex-col items-center shadow-lg shadow-black px-4 py-2 bg-white rounded">
    <img src={App_Logo} alt="SCSC Logo" className='w-1/6' />
    <h1 className="text-center text-black font-black text-xs md:text-lg ">
     ISLAMIC UNIVERSITY IN UGANDA
    </h1>
    <h1 className="text-center text-scsc-red font-black text-xs">
     FINAL YEAR PROJECTS MANAGEMENT SYSTEM
    </h1>
    <h1 className="text-center text-black font-semibold text-md">
      SMART FYP
    </h1>
  </div>
<div className="flex flex-col gap-3  items-center w-full md:w-[50%] p-4 bg-white border-2">
    <div className="flex justify-around">
<FaUser className='text-icon-sm'/>
<h1 className='text-black font-bold my-auto font-poppins text-xl'>LOG IN</h1>
    </div>
  
    {/* formwraper */}
    <div className='w-full'>
 <Form  formControls={LoginFormFields}
          isLoading = {isloading}
          buttonText={"LOG IN"}
          formData={formData}
          setFormData={setformData}
          onSubmit={handleSubmit}
          variant='success'
          isBtnDisabled={!isFormValid()}
          message='Please Wait......'
         />

    </div>

   
  </div>
</div>
  );
};

export default LogIn;