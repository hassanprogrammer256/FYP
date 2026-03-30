import { Grid, Typography } from "@mui/joy"

const CardHorizontal = ({role,data}) => {
  return (
          <Grid spacing={1} sx={{ m: '2px' }}>
        {data?.length > 0
          ? data.slice(0,5).map((e, index) => (
              <Grid xs={12} sm={12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: 1,
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} gap={2}>
                    <Typography level="h4">{index === 0 ? 1 : index + 1}</Typography>
                    <div className="flex justify-between w-full">
                      {role === 'supervisor' ? (
                        <div className="flex gap-5 flex-row">
                          <Avatar size="md">
                            <img
                              src={`https://i.pravatar.cc/150?img=${e?.id}`}
                              alt="Student Pic"
                            />
                          </Avatar>
                          <Typography level="h5" noWrap>{e?.title}</Typography>
                        </div>
                      ) : (
                        <Typography level="h5" noWrap>{e?.title}</Typography>
                      )}
                     { 
                     <CircularProgress
                        color={
                         ( role === "student"? e.best_marks : e.marks_obtained) <= 50
                            ? 'danger'
                            : (role === "supervisor"? e.best_marks : e.marks_obtained) > 50 && (role === "supervisor"? e.best_marks : e.marks_obtained) <= 70
                            ? 'warning'
                            : 'success'
                        }
                        size="md"
                        determinate
                        value= {role === "supervisor" ? e.best_marks : e.marks_obtained}
                      >
                        {`${role === "supervisor"? e.best_marks : e.marks_obtained}%`}
                      </CircularProgress>}
                    </div>
                  </Stack>
                </Card>
              </Grid>
            ))
          : <Typography component="strong" level="h3" sx={{ textTransform: 'capitalize' }}>No Data Found</Typography>}
      </Grid>

  )
}

export default CardHorizontal
