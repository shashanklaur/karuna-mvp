import { NavLink, Link } from "react-router-dom";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl hover:bg-gray-100 ${isActive ? "text-emerald-700 font-semibold" : "text-gray-700"}`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <Link to="/" className="text-xl font-bold text-emerald-700" aria-label="Karuna home">
          Karuna
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-2">
            <li><NavItem to="/">Discover</NavItem></li>
            <li><NavItem to="/post">Post</NavItem></li>
            <li><NavItem to="/connections">Connections</NavItem></li>
            <li><NavItem to="/gratitude">Gratitude</NavItem></li>
            <li><NavItem to="/profile">Profile</NavItem></li>
            <li><NavItem to="/admin/reports">Admin</NavItem></li>
          </ul>
        </nav>
        <div className="flex gap-2">
          <NavItem to="/login">Log in</NavItem>
          <NavItem to="/register">Sign up</NavItem>
        </div>
      </div>
    </header>
  );
}
