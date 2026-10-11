import { useEffect, useState,useRef } from "react";
import type { MonitoredFileChanges } from "../types/fileChange";
import type { LogFilter } from "../types/logFilter";
import { fetchLogsPage, fetchLogsCount } from "../services/api";
import { RecordMessage } from "../components/Message";

interface F_table {
  loading: boolean;
  activeFilter: LogFilter;
  error:string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}
const getFilterKey = (filter: LogFilter) => JSON.stringify(filter);
const FileChangeTable = ({ loading, activeFilter,error,setError,setMessage }: F_table) => {
  const [offset, setOffset] = useState(0);
  const [logs, setLogs] = useState<MonitoredFileChanges[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [fetching, setFetching] = useState(false);
  const previousFilterKey = useRef("");

  const LIMIT = 10;

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalLogs / LIMIT);

  // Reset to page 1 whenever the selected filter changes.
  useEffect(() => {
    setError(null);
    setOffset(0);
  }, [activeFilter]);

  // Fetch the selected page and the total matching count.
 useEffect(() => {
  let cancelled = false;

 const filterKey = getFilterKey(activeFilter);
  const filterChanged = previousFilterKey.current !== filterKey;
  previousFilterKey.current = filterKey;


  const loadLogs = async () => {
    setFetching(true);
    setError(null);
    setMessage(null);

    try {
      const [data, countData] = await Promise.all([
        fetchLogsPage(activeFilter, LIMIT, offset),
        fetchLogsCount(activeFilter),
      ]);

      if (cancelled) return;

      setLogs(data);
      setTotalLogs(countData.total);

      if (filterChanged) {
        setMessage(
          data.length > 0
            ? "Filter applied successfully"
            : "Filter applied, but no matching records were found."
        );
      }
    } catch (err) {
      if (cancelled) return;

      console.error("Error fetching logs:", err);

      setLogs([]);
      setTotalLogs(0);

      setError("");
    } finally {
      if (!cancelled) {
        setFetching(false);
      }
    }
  };

  loadLogs();

  return () => {
    cancelled = true;
  };
}, [activeFilter, offset, setError, setMessage]);
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setOffset((page - 1) * LIMIT);
  };

  return (
    <>
      {(loading || fetching) && (
        <div className="loading-container">
          <span className="loading loading-spinner" />
        </div>
      )}

      {error ? (
  <p role="alert"></p>
) : loading || fetching ? (
  <div className="loading-container">
    <span className="loading loading-spinner" />
  </div>
) : logs.length === 0 ? (
  <RecordMessage />
) : (
        <table className="table-section-changes">
          <thead className="table-header">
            <tr>
              <th>DETECTED_AT</th>
              <th>FILE NAME</th>
              <th>ACTION</th>
              <th>RESULT</th>
              <th>DETAIL</th>
            </tr>
          </thead>

          <tbody className="table-body">
            {logs.map((file) => (
              <tr key={file.id}>
                <td>{file.detected_at}</td>

                <td>
                  <span className="filename-symbol">📄</span>
                  {file.file_name}
                </td>

                <td>
                  <span
                    id={`action-${file.action.toLowerCase()}`}
                    className="btn btn-success"
                  >
                    {file.action}
                  </span>
                </td>

                <td>
                  <span
                    id={`status-${(file.change_type ?? "").toLowerCase()}`}
                    className="btn btn-success"
                  >
                    {file.change_type}
                  </span>
                </td>

                <td>
                  <div className="detail-container">
                    {file.action === "Deleted"
                      ? `File ${file.file_name} is deleted`
                      : file.action === "Uploaded"
                      ? "File is Uploaded and being Monitored"
                      : file.action === "Verification" &&
                        file.change_type === "RESTORED"
                      ? "File is Restored to its initial state"
                      : file.action === "Verification" &&
                        file.change_type === "MISSING"
                      ? "File is Missing from the database"
                      : file.action === "Verification" &&
                        file.change_type === "MODIFIED"
                      ? "File is Modified"
                      : ""}

                    {file.change_type === "MODIFIED" &&
                      file.new_hash && (
                        <p>
                          Hash:{" "}
                          {file.new_hash.length > 10
                            ? `${file.new_hash.slice(0, 10)}...`
                            : file.new_hash}
                        </p>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 0 && (
        <div className="pagination">
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || fetching || loading}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={`btn ${
                  currentPage === page ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => handlePageChange(page)}
                disabled={fetching || loading}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            className="btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === totalPages || fetching || loading
            }
          >
            Next
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </>
  );
};

export default FileChangeTable;
