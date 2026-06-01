import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "./context/ProgressContext";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Challenges } from "./pages/Challenges";
import { Profile } from "./pages/Profile";
import { ExercisePlayer } from "./pages/ExercisePlayer";

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Exercise player is deliberately outside the standard navigation layout
              because it acts as an immersive full-screen focus view */}
          <Route path="/exercise/:id" element={<ExercisePlayer />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
