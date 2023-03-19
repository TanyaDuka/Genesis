import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CoursesPage from "./components/CoursesPage";
import LessonPage from "./components/LessonPage";

function App() {
  return (
    
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path={"/courses/:id"} element={<LessonPage />} />
        <Route path="*" element={<Navigate to="/courses" />} />
      </Routes>
  
  );
}

export default App;
