import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

import Discover from "./features/posts/Discover";
import PostDetail from "./features/posts/PostDetail";
import PostForm from "./features/posts/PostForm";

import Connections from "./features/connect/Connections";
import Thread from "./features/connect/Thread";

import GratitudeList from "./features/gratitude/GratitudeList";

import Me from "./features/profile/Me";
import PublicProfile from "./features/profile/PublicProfile";

import Reports from "./features/admin/Reports";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:block p-2 bg-white">
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <Routes>
            {/* Discover */}
            <Route path="/" element={<Discover />} />

            {/* Posts */}
            <Route path="/post" element={<PostForm />} />
            <Route path="/service/:id" element={<PostDetail />} />

            {/* Connections */}
            <Route path="/connections" element={<Connections />} />
            <Route path="/connections/:id" element={<Thread />} />

            {/* Gratitude */}
            <Route path="/gratitude" element={<GratitudeList />} />

            {/* Profile */}
            <Route path="/profile" element={<Me />} />
            <Route path="/u/:id" element={<PublicProfile />} />

            {/* Admin */}
            <Route path="/admin/reports" element={<Reports />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card p-4">
            <p>
              Karuna • Building a circle of giving with small acts of compassion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
