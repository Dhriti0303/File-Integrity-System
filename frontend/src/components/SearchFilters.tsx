import React, { useState } from "react";
import type { LogFilter } from "../types/logFilter";
import "daisyui";

type SearchFiltersProps = {
  setFileChange: React.Dispatch<
    React.SetStateAction<import("../types/fileChange").MonitoredFileChanges[]>
  >;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveFilter: React.Dispatch<React.SetStateAction<LogFilter>>;
};

export const SearchFilters = ({setError,setMessage,setActiveFilter,}: SearchFiltersProps) => {
  const [fileName, setFileName] = useState("");
  const [changeType, setChangeType] = useState("-");
  const [action, setAction] = useState("-");
  const [date, setDate] = useState("");

  const applyFilter = (filter: LogFilter) => {
    setError(null);
    setMessage(null);
    setActiveFilter(filter);
}

  const getOneFileChange = () => {
    const name = fileName.trim();

    if (!name) {
      setError("");
      return;
    }
    setFileName("");
    applyFilter({ type: "file", value: name });
  };

  const handleStatusChange = (value: string) => {
    setChangeType(value);

    if (value === "-") {
      applyFilter({ type: "all" });
    } else {
      setAction("-");
      applyFilter({ type: "status", value });
    }
  };

  const handleActionChange = (value: string) => {
    setAction(value);

    if (value === "-") {
      applyFilter({ type: "all" });
    } else {
      setChangeType("-");
      applyFilter({ type: "action", value });
    }
  };

  const handleWeek = () => {
    setChangeType("-");
    setAction("-");
    applyFilter({ type: "week" });
  };

  const handleMonth = () => {
    setChangeType("-");
    setAction("-");
    applyFilter({ type: "month" });
  };

  const handleDate = () => {
    if (!date) {
      setError("");
      return;
    }

    setChangeType("-");
    setAction("-");
    applyFilter({ type: "date", value: date });
    setDate("");
  };

  return (
    <div className="filters">
      <section className="changeType">
        <select
          id="status"
          name="status"
          value={changeType}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="-">All Statuses</option>
          <option value="RESTORED">RESTORED</option>
          <option value="MODIFIED">MODIFIED</option>
          <option value="MISSING">MISSING</option>
        </select>
      </section>

      <section className="action">
        <select
          id="action"
          name="action"
          value={action}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="-">All Actions</option>
          <option value="Verification">Verification</option>
          <option value="Uploaded">Uploaded</option>
          <option value="Deleted">Deleted</option>
        </select>
      </section>

      <div className="btn week">
        <button type="button" onClick={handleWeek}>Week</button>
      </div>

      <div className="btn month">
        <button type="button" onClick={handleMonth}>Month</button>
      </div>

      <div className="date">
        <input
          placeholder="yyyy-mm-dd"
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="button" onClick={handleDate}>Search</button>
      </div>

      <div className="search-item">
        <input
          type="text"
          placeholder="Enter File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") getOneFileChange();
          }}
        />
        <button
          type="button"
          className="btn search"
          onClick={getOneFileChange}
        >
          &#x1F50E;
        </button>
      </div>
    </div>
  );
};
