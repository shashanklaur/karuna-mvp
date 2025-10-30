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

function Page({ title, note }: { title: string; note?: string }) {
  return (
    <section className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {note && <p className="text-gray-600 mt-2">{note}</p>}
      <div className="mt-6 p-6 bg-white rounded-2xl border shadow-sm">
        <p className="text-gray-500">This is a placeholder.</p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:block p-2 bg-white">Skip to content</a>
      <Navbar />
      <main id="main">
        <Routes>
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

          {/* Auth placeholders for later */}
          <Route path="/login" element={<Page title="Log in" />} />
          <Route path="/register" element={<Page title="Sign up" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center py-8 text-sm text-gray-500">Karuna • Built with compassion</footer>
    </div>
  );
}
