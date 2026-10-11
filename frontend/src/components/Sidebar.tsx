import { NavLink } from "react-router-dom"
const Sidebar = () => {
  return (
    <>
        <aside className="sidebar">
        <h1>File Integrity System</h1>
        <hr />
        <nav className="navigation-bar">
            <NavLink to="/files">Files</NavLink>
            <NavLink to="Logs">Logs</NavLink>
            </nav>
        </aside>
    </>
  )
}
export default Sidebar