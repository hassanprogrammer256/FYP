import { Box, Grid, Sheet, Typography, Table, CircularProgress, Button } from '@mui/joy'
import React, { useState, useEffect,useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'
import { useToast } from '../../components/ui/toast-context'


const Marks = () => {
  const dispatch = useDispatch()
  const {role} = useSelector((state) => state.auth)

  const {bio} = useSelector((state) => state.staff)
  const [allCourseUnits, setAllCourseUnits] = useState([])
  const [selectedCourseUnitId, setSelectedCourseUnitId] = useState(bio.course_units[0])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setuploading] = useState(false)
  const [marks, setMarks] = useState({})
  const {addToast} = useToast()

const AllMarks = React.useMemo(() => {
  if (!students || students.length === 0) return [];
  return students.map(student => ({
    student_id: student.id,
    course_unit_id: selectedCourseUnitId,
    marks_obtained: marks[student.id] || 0,
  }));
}, [students, marks, selectedCourseUnitId]);

  useEffect(() => {
  if (!selectedCourseUnitId) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await dispatch(fetchLecturerStudents(selectedCourseUnitId)).unwrap();
      if (data?.success) {
        setAllCourseUnits([data.units]);
        setStudents(data.students);
        const newMarks = {};
        data.students.forEach(student => {
          newMarks[student.id] = 0;
        });
        setMarks(newMarks);
      }
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedCourseUnitId]);

  const handleMarkChange = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: parseInt(value, 10) }))
  };


const HandleSubmit = async() => {
  try{ 
  setuploading(true)
const response = await uploadMarks(AllMarks)
if (response?.success){
 
  return addToast({message:response.message,variant:"success"})}
else{
  return addToast({message:response.error,variant:"destructive"})
}
 
}catch(e){
  console.log(str(e))
}finally{
  setuploading(false)
}

}

  return (
    <Sheet sx={{ p: 1, bgcolor: 'background.level1' }}>
      <Typography component='strong' sx={{mt:4}}>Select Course Unit</Typography>
      <Box sx={{bgcolor: 'background.body', borderRadius: 'sm', p: 2, overflowX: 'auto', minHeight: '200px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 4 }}>
          <Select
            value={selectedCourseUnitId || 'Select Course Unit'}
            onValueChange={(value) => setSelectedCourseUnitId(value)}
            sx={{ width: 200 }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={'Select Course Unit'} />
            </SelectTrigger>
            <SelectContent>
              {allCourseUnits.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Box>

        {/* Loading Indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
            <CircularProgress size="sm" />
          </Box>
        ) : (
          <>
            {/* No students message */}
            {students.length === 0 ? (
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  color: 'text.primary',
                  marginTop: 2,
                }}
              >
                NO STUDENTS FOUND FOR THIS COURSE UNIT
              </Typography>
            ) : (
              // Students Table
              <Table sx={{ boxShadow: '2px 2px 3px black', overflow: 'scroll' }} stickyHeader>
                <thead>
                  <tr>
                    <th style={{ minWidth: '150px' }}>Army Number</th>
                    <th style={{ minWidth: '150px' }}>First Name</th>
                    <th style={{ minWidth: '150px' }}>Last Name</th>
                    <th style={{ minWidth: '50px' }}>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '150px' }}>
                        {student.army_number}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '150px' }}>
                        {student.first_name}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '150px' }}>
                        {student.last_name}
                      </td>
                      <td>
                        <Select
                          value={marks[student.id]?.toString() || '0'}
                          onValueChange={(value) => handleMarkChange(student.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={marks[student.id]?.toString() || '0'} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 101 }, (_, i) => i).map((option) => (
                              <SelectItem key={option} value={option.toString()}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
<Button disabled = {uploading} variant="solid" color={role === "Lecturer" ? "success" : "primary"} sx={{ my: 3, width: '50%' }} onClick={HandleSubmit}>
  {!uploading ? 'Upload Marks': "Uploading Marks"}
          </Button>
        </Box>
      </Box>
    </Sheet>
  )
}

export default Marks;


