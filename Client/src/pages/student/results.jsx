import { Box, Grid, Sheet, Typography, Table, CircularProgress,Button } from '@mui/joy'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'
import { semisters, years } from '../../config'



const getCurrentYear = () => new Date().getFullYear().toString()

const Results = () => {
  const student_results = useSelector((state) => state.student?.studentData?.data?.academics) || []
let degree;
let cgpa;
  const initial_data = useMemo(() => {
    return student_results.map(i => ({
      course_name: i?.course_unit_Name,
      course_unit_code: i?.course_unit_Code,
      credit_units: i?.credit_Units,
      grade: i?.grade,
      marks: i?.marks_obtained,
      grade_point: i?.grade_Point,
      comment: i?.remarks,
      year: i?.year,
      semister: i?.semister,
    }))
  }, [student_results])

  // Set default filters to current year and semister 1
  const defaultYear = getCurrentYear()
  const defaultSemister = '1' // assuming semister values are strings or numbers

  const [formData, setFormData] = useState({
    Year: defaultYear,
    Semister: defaultSemister,
  })
  const [academicSummary,setacademicSummary] =useState({});

  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
const filteredResults = useMemo(() => {
  return initial_data.filter(record => {
    const matchesYear = formData.Year ? record.year === formData.Year : true;
    const matchesSemister = formData.Semister ? record.semister === formData.Semister : true;
    return matchesYear && matchesSemister;
  });
}, [initial_data, formData]);

useEffect(() => {
  setLoading(true);

  if (filteredResults) {
    const totalCredits = filteredResults.reduce((sum, course) => sum + course.credit_units, 0);
    const totalWeightedPoints = filteredResults.reduce((sum, course) => sum + course.credit_units * course.grade_point, 0);
    const gpa = totalCredits ? (totalWeightedPoints / totalCredits).toFixed(1) : '0.0';

    cgpa= parseFloat(gpa);
  
    if (cgpa >= 4.5) degree = "FIRST CLASS";
    else if (cgpa >= 4.0) degree = "SECOND CLASS UPPER";
    else if (cgpa >= 3.0) degree = "SECOND CLASS LOWER";
    else if (cgpa >= 2.5) degree = "PASS";
    else degree = "FAIL";

  }
setacademicSummary({cgpa,degree})
  setLoading(false);
}, []);


  return (
    <Sheet sx={{ p: 1, bgcolor: 'background.level1' }}>
      {/* Filters */}
      <Box sx={{ bgcolor: "background.body", borderRadius: "sm", p: 2, mb: 3 }}>
        <Typography
          level="h2"
          sx={{
            fontSize: 14,
            p: 2,
            m: 0,
            borderBottom: "1px solid",
            bgcolor: "primary.500",
            color: "common.white",
          }}
        >
          Exam Results
        </Typography>
        <Grid container sx={{ display: "flex", flexDirection: 'row', gap: 2, mt: 2 }}>
          {[
            { name: 'Year', placeholder: 'Academic Year', options: years },
            { name: 'Semister', placeholder: 'Semister/Term', options: semisters }
          ].map((field) => (
            <Box key={field.name} sx={{ display: "flex", flexDirection: "row", flex: 1 }}>
              <Select
                value={formData[field.name]}
                onValueChange={(value) => handleChange(field.name, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null} disabled>
                    {field.placeholder}
                  </SelectItem>
                  {field.options && field.options.length > 0
                    ? field.options.map((option, idx) => (
                        <SelectItem key={idx} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Results Table / Spinner */}
      <Box sx={{ mt: 4, bgcolor: "background.body", borderRadius: "sm", p: 2, overflowX: 'auto', minHeight: '200px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
            <CircularProgress size='sm'/>
          </Box>
        ) : (
          <>
            { filteredResults?.length === 0 ? (
              <>
                <Table>
                  <thead>
                    <tr>
                       <th style={{ minWidth: '50px' }}>Code</th>
                    <th style={{ minWidth: '450px' }}>Name</th>
                    <th style={{ minWidth: '60px' }}>Credit Units</th>
                    <th style={{ minWidth: '40px' }}>Grade</th>
                    <th style={{ minWidth: '50px' }}>Marks</th>
                    <th style={{ minWidth: '40px' }}>Grade Point</th>
                    <th style={{ minWidth: '50px' }}>Comment</th>
                    </tr>
                  </thead>
                </Table>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', color: 'text.primary', marginTop: 2 }}>
                  NO RESULTS FOUND
                </Typography>
              </>
            ) : (
              // Show filtered data
             <Table sx={{boxShadow:'2px 2px 3px black',overflow:'scroll'}} stickyHeader>
  <thead>
    <tr>
      <th style={{ minWidth: '40px' ,width:'50px'}}>Code</th>
      <th style={{ flex: 1,width:'400px' }}>Name</th>
      <th style={{ width: '60px' }}>Credit Units</th>
      <th style={{ width: '60px' }}>Grade</th>
      <th style={{ width: '60px' }}>Marks</th>
      <th style={{ Width: '40px' }}>Grade Point</th>
      <th style={{ Width: '70px' }}>Comment</th>
    </tr>
  </thead>
  <tbody>
    {displayData?.map((course) => (
      <tr key={course.course_unit_code}>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50px' }}>
          {course.course_unit_code}
        </td>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {course.course_unit_name}
        </td>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '50px' }}>
          {course.credit_units}
        </td>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '50px' }}>
          {course.grade}
        </td>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '50px' }}>
          {course.marks}
        </td>
        <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '40px' }}>
          {course.grade_point}
        </td>
        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {course.comment}
        </td>
      </tr>
    ))}
  </tbody>
</Table>
            )}
          </>
        )}
<Box sx={{display:'flex',flexDirection:'column',gap:3,my:4}}>
<Box sx={{display:'flex',flexDirection:'row', gap:4}}>
     <Typography component = 'strong' level='h5' sx={{fontWeight:500}}>GRADE: </Typography>
      <Typography component = 'strong' level='h5' sx={{fontWeight:700,color:'red'}}>{academicSummary.cgpa}</Typography>
  </Box>

  <Box sx={{display:'flex',flexDirection:'row', gap:4}}>
     <Typography component = 'strong' level='h5' sx={{fontWeight:500}}>DEGREE: </Typography>
      <Typography component = 'strong' level='h5' sx={{fontWeight:700,color:'red'}}>{academicSummary.degree}</Typography>
  </Box>
 </Box>

<Button variant='solid' color='danger' sx={{my:3}}>Submit Complains</Button>

      </Box>
    </Sheet>
  )
}

export default Results;