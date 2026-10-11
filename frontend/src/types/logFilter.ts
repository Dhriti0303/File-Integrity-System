export type LogFilter =
  | { type: "all"; notify?: boolean }
  | { type: "status"; value: string; notify?: boolean }
  | { type: "action"; value: string; notify?: boolean }
  | { type: "week"; notify?: boolean }
  | { type: "month"; notify?: boolean }
  | { type: "date"; value: string; notify?: boolean }
  | { type: "file"; value: string; notify?: boolean };