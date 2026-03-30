import { Box, Button, Checkbox, Sheet, Typography, Table, CircularProgress} from '@mui/joy'
import { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useToast } from '../../components/ui/toast-context'
import { Close } from '@mui/icons-material';
import { API_BASE_URL } from '../../config';


const Register = () => {
const {role} = useSelector((state) => state.auth)
const CourseUnits = useSelector((state) => state.student?.results) || [];
const  AlreadyRegistered =  useSelector((state) => state.student?.registeredUnits) || [];
const CourseList = CourseUnits.filter((el) =>  !AlreadyRegistered.includes(el.id))
const [studentCourseUnits,setStudentCourseUnits] = useState([...CourseList])


const Student_id = localStorage.getItem('id')
const  {addToast}  = useToast();
const [loading, setloading] = useState(false)
const [checked, setChecked] = useState([]);
const [Registered, setRegistered] = useState(() => CourseUnits.filter((unit) => AlreadyRegistered.includes(unit.id)));

const handleChecking = (id) => {
  setChecked(prev => {
    if (prev.includes(id)) {
      return prev.filter(i => i !== id);
    } else {
      
      return [...prev, id];
    }
  });
};
  

const handleRegister = async() => {
  try {
    if (checked.length === 0) {
      addToast({message:'No Course Unit Selected',variant:'destructive'});
      return;
    }
    setloading(true);
    const response = await fetch(`${API_BASE_URL}student/register-course-units/`, {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        'student_id': Student_id,
        'course_units': checked
      })
    });
    const data = await response.json();

    if (response.ok && data.success) {
  const registeredUnits = [];
  studentCourseUnits.forEach(unit => {
    if (checked.includes(unit.id)) {
      registeredUnits.push(unit);
    }
  });

  setRegistered(prev => {
    const updated = [...prev, ...registeredUnits];
    return updated;
  });
  setStudentCourseUnits(prev => prev.filter(u => !checked.includes(u.id)));
  setChecked([]);
  addToast({message:'Registered',variant:'success'})
}
  } catch (error) {
    console.log(error);
    addToast({message: 'An error occurred during registration', variant:'destructive'});
  } finally {
    setloading(false);
  }
};

  return (
<Sheet sx={{ p: 1, bgcolor: 'background.level1' }}>
  {/* -----------------------REGISTER__________________ */}
         <Typography component='strong' bgcolor={role=="Student"?"primary.500":"success.500"} sx={{p:2,color:'white'}}>Academic Year: {new Date().getFullYear()}</Typography>
         <Box sx={{bgcolor: 'background.body', borderRadius: 'sm', p: 2, overflowX: 'auto', minHeight: '200px' }}>
           {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
               <CircularProgress size="sm" />
             </Box>
           ) : (
             <>
               {CourseList.length === 0 ? (
                 <Typography
                   sx={{
                     fontWeight: 'bold',
                     fontSize: '1.2rem',
                     textAlign: 'center',
                     color: 'text.primary',
                     marginTop: 2,
                   }}
                 >
                   NO DATA FOUND
                 </Typography>
               ) : (
                 <Table sx={{ boxShadow: '2px 2px 3px black', overflow: 'scroll' }} stickyHeader>
                   <thead>
                     <tr>
                       <th>Code</th>
                       <th>Name</th>
                       <th>Credit Units</th>
                     </tr>
                   </thead>
                   <tbody>
                     {studentCourseUnits.map((unit) => (
                       <tr key={unit.id}>
                         <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '50px' }}>
                           {unit.code}
                         </td>
                         <td>
                           {unit.name}
                         </td>
                         <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '70px' }}>
                           {unit.credit_units}
                         </td>
                         <td style={{ width: '10px' }}>
                         <Checkbox onChange={() =>handleChecking(unit.id)}  uncheckedIcon={<Close />} />
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </Table>
               )}
             </>
           )}
           <Box sx={{ display: 'flex', justifyContent: 'center' , cursor:'pointer'}}>
   <Button disabled = {loading ||CourseList.length === 0}  variant="solid" color={role === "Lecturer" ? "success" : "primary"} sx={{ my: 3, width: '50%' }} onClick={handleRegister}>
     {!loading ? 'Register Now': "Registering..."}
             </Button>
           </Box>
         </Box>

{/* ------------REGISTERED COURSE UNITS___________________________ */}
<Typography component='strong' bgcolor={role=="Student"?"primary.500":"success.500"} sx={{p:2,color:'white'}}>Registerd Course Units</Typography>
         <Box sx={{bgcolor: 'background.body', borderRadius: 'sm', p: 2, overflowX: 'auto', minHeight: '200px' }}>
           {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
               <CircularProgress size="sm" />
             </Box>
           ) : (
             <>
               {Registered.length === 0 ? (
                 <Typography
                   sx={{
                     fontWeight: 'bold',
                     fontSize: '1.2rem',
                     textAlign: 'center',
                     color: 'text.primary',
                     marginTop: 2,
                   }}
                 >
                   NO COURSE UNITS REGISTERED
                 </Typography>
               ) : (
                 <Table sx={{ boxShadow: '2px 2px 3px black', overflow: 'scroll' }} stickyHeader>
                   <thead>
                     <tr>
                       <th>Code</th>
                       <th>Name</th>
                       <th>Credit Units</th>
                     </tr>
                   </thead>
                   <tbody>
                     {Registered.map((unit) => (
                       <tr key={unit.id}>
                         <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '50px' }}>
                           {unit.code}
                         </td>
                         <td>
                           {unit.name}
                         </td>
                         <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '70px' }}>
                           {unit.credit_units}
                         </td>

                       </tr>
                     )) }
                   </tbody>
                 </Table>
               )}
             </>
           )}
         </Box>


       </Sheet>
  );
};

export default Register;