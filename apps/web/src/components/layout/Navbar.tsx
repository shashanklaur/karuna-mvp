import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../features/auth/api";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl transition ${
        isActive ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100 text-gray-700"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const nav = useNavigate();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: authApi.me });
  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      nav("/");
    }
  });

  return (
    <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <Link to="/" className="text-xl font-bold text-emerald-700" aria-label="Karuna home">
          Karuna
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-2">
            <li><NavItem to="/">Discover</NavItem></li>
            <li><NavItem to="/post">Post</NavItem></li>
            <li><NavItem to="/connections">Connections</NavItem></li>
            <li><NavItem to="/gratitude">Gratitude</NavItem></li>
            <li><NavItem to="/profile">Profile</NavItem></li>
            {me?.role === "admin" && <li><NavItem to="/admin/reports">Admin</NavItem></li>}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          {!me ? (
            <>
              <NavItem to="/login">Log in</NavItem>
              <NavItem to="/register">Sign up</NavItem>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">Hello, {me.name}</span>
              <button
                onClick={() => logout.mutate()}
                className="btn btn-secondary"
                disabled={logout.isPending}
                aria-label="Log out"
              >
                {logout.isPending ? "…" : "Log out"}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden px-3 py-2 rounded-xl border hover:bg-gray-50"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav id="mobile-nav" className="md:hidden border-t bg-white">
          <ul className="max-w-6xl mx-auto p-3 space-y-2">
            <li><NavItem to="/" >Discover</NavItem></li>
            <li><NavItem to="/post">Post</NavItem></li>
            <li><NavItem to="/connections">Connections</NavItem></li>
            <li><NavItem to="/gratitude">Gratitude</NavItem></li>
            <li><NavItem to="/profile">Profile</NavItem></li>
            {me?.role === "admin" && <li><NavItem to="/admin/reports">Admin</NavItem></li>}
            <li className="pt-2 border-t">
              {!me ? (
                <div className="flex gap-2">
                  <Link to="/login" className="btn btn-primary w-full text-center">Log in</Link>
                  <Link to="/register" className="btn btn-secondary w-full text-center">Sign up</Link>
                </div>
              ) : (
                <button
                  onClick={() => { setOpen(false); logout.mutate(); }}
                  className="btn btn-secondary w-full"
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "…" : "Log out"}
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
