export default function Healthz() {
  return (
    <div
      style={{
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "1.2rem",
      }}
    >
      <pre>{JSON.stringify({ ok: true, version: "1.0" }, null, 2)}</pre>
    </div>
  );
}
