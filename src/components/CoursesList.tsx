import React, { useState } from "react";
import { ICourse } from "../types/types";
import CourseItem from "./CourseItem";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Pagination, useMediaQuery, useTheme } from "@mui/material";

interface CourseListProps {
  courses: ICourse[];
}

const PAGE_SIZE = 10;

const CoursesList: React.FC<CourseListProps> = ({ courses }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalCourses = courses.length;
  const totalPages = Math.ceil(totalCourses / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const coursesToShow = courses.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%" }} className="box">
      <Grid container spacing={isMobile ? 1 : 3}>
        {coursesToShow.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <CourseItem
              course={course}
              onClick={(course) => navigate("/courses/" + course.id)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  )
};

export default CoursesList;
