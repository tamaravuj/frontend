function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default SummaryRow;
