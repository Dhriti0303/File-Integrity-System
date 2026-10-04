import type { MonitoredFileChanges } from "../types/file";

interface F_table{
    fileChanges:MonitoredFileChanges[];
}

const FileChangeTable = ({fileChanges}:F_table) => {
  return (
    <>
        <h1>Logs Table</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>FILE_ID</th>
                    <th>FILE_NAME</th>
                    <th>OLD_HASH</th>
                    <th>NEW_HASH</th>
                    <th>DETECTED_AT</th>
                    <th>ACTION</th>
                    <th>CHANGE_TYPE</th>
                </tr>
            </thead>
            <tbody>
                {fileChanges.map((file)=>(
                    <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>{file.file_id}</td>
                        <td>{file.file_name}</td>
                        <td>{file.old_hash}</td>
                        <td>{file.new_hash}</td>
                        <td>{file.detected_at}</td>
                        <td>{file.action}</td>
                        <td>{file.change_type}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  )
}
export default FileChangeTable
