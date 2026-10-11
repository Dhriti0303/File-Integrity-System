import { useEffect, useState } from "react";
import { getFileChanges } from "../services/api";
import { SearchFilters } from "../components/SearchFilters";
import type { MonitoredFileChanges } from "../types/fileChange";
import type { LogFilter } from "../types/logFilter";
import FileChangeTable from "../components/FileChangeTable";
import { ErrorMessage, SuccessMessage } from "../components/Message";
import "./Logs.css";

const Logs = () => {
  const [fileChange, setFileChange] = useState<MonitoredFileChanges[]>([]);
  const [activeFilter, setActiveFilter] = useState<LogFilter>({
    type: "all",
  });

  const [error, setError] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  if (!message && !error) return;

  const timer = setTimeout(() => {
    setMessage(null);
    setError(null);
  }, 2500);

  return () => clearTimeout(timer);
}, [message, error]);

  useEffect(() => {
    const loadInitialLogs = async () => {
      try {
        setLoading(true);
        const result = await getFileChanges();
        setFileChange(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load logs");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialLogs();
  }, []);

  const refreshPage = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      setActiveFilter({ type: "all" });

      const result = await getFileChanges();
      setFileChange(result);
      setMessage("Logs refreshed");

      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to refresh logs");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Logs</h1>
        <p>View all file integrity events and system activities.</p>

        <button className="btn refresh" onClick={refreshPage}>
          <span className="refresh-btn">&#x21BB;</span>
          Refresh
        </button>
      </header>

      <main>
        <SearchFilters
          setFileChange={setFileChange}
          setError={setError}
          setMessage={setMessage}
          setActiveFilter={setActiveFilter}
        />

        {error && <ErrorMessage error={error} />}

        {message && (
          <SuccessMessage error={error} message={message} />
        )}

        <section className="filechange-section">
          <FileChangeTable
            loading={loading}
            activeFilter={activeFilter}
            error={error}
            setError={setError}
            setMessage={setMessage}
          />
        </section>
      </main>
    </div>
  );
};

export default Logs;