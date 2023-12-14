import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl bg-amber-500" to="/">
          FilesFromYou
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className="text-lg">
            <Link to="/dashboard">CPU Usage Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
