import React from "react";
import { Routes, Route } from "react-router-dom";
import AddCourseView from "../../features/views/course/AddCourseView";
import CourseList from "../../features/views/course/CourseList";


const CoursesPage = () => {
  return (
    <Routes>
      <Route index element={<CourseList />} />
      <Route path="add" element={<AddCourseView />} />
    </Routes>
  );
};

export default CoursesPage;
