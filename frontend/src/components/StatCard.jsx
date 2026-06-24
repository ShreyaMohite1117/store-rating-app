export default function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card" data-accent={accent}>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}
