const Rating = ({ value, text }) => {
  const ratingValue = Number(value || 0);
  const ratingPercent = `${(Math.max(0, Math.min(5, ratingValue)) / 5) * 100}%`;

  return (
    <div className="rating" aria-label={`Ocena ${ratingValue} od 5`}>
      <span className="rating-stars" style={{ '--rating-percent': ratingPercent }} aria-hidden="true" />
      <span className="rating-text">{text && text}</span>
    </div>
  );
};

export default Rating;
