import React from "react";
import { Routes, Route } from "react-router-dom";
import CourseList from "../pages/users/views/CourseList";
import AddCourseView from "../pages/users/views/AddCourseView";

const CoursesPage = () => {
  return (
    <Routes>
      <Route index element={<CourseList />} />
      <Route path="add" element={<AddCourseView />} />
    </Routes>
  );
};

export default CoursesPage;
