import moment from "moment";

export function serializeEntries(entries) {
  return JSON.stringify(
    entries.map(e => ({
      ...e,
      timestamp: e.timestamp.toJSON()
    }))
  );
}

export function deserializeEntries(jsonString) {
  return (JSON.parse(jsonString) || []).map(e => ({
    ...e,
    timestamp: moment(e.timestamp)
  }));
}

export const getRootUrl = () =>
  window.location.protocol +
  "//" +
  window.location.hostname +
  (window.location.port ? ":" + window.location.port : "");
