import { Navigate, Route, Routes } from "react-router-dom";
import ProjectsListPage from "../pages/ProjectsListPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import AppLayout from "./AppLayout";

export default function App() {
  return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </AppLayout>
  );
}
