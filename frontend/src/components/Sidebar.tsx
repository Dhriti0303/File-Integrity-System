import { Link } from "react-router-dom"
const Sidebar = () => {
  return (
    <>
        <aside className="sidebar">
        <h1>File Integrity System</h1>
        <hr />
        <nav className="navigation-bar">
            <Link to="/files">Files</Link>
            <Link to="Logs">Logs</Link>
            </nav>
        </aside>
    </>
  )
}
export default Sidebar