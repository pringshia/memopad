import moment from "moment";

export function serializeEntries(entries) {
  return JSON.stringify(
    entries.map(e => ({
      ...e,
      timestamp:
        typeof e.timestamp === "string" ? e.timestamp : e.timestamp.toJSON()
    }))
  );
}

export function deserializeEntries(jsonString) {
  return JSON.parse(jsonString) || [];
}

export function convertTimestamps(entries) {
  return (
    entries &&
    entries.map(e => ({
      ...e,
      timestamp: moment(e.timestamp)
    }))
  );
}

export const getRootUrl = () =>
  window.location.protocol +
  "//" +
  window.location.hostname +
  (window.location.port ? ":" + window.location.port : "");
