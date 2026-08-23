export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Nota ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill={n <= rating ? "#D1B770" : "#e2e8f0"}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.77l-5.21 2.75 1-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
