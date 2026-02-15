export default function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array(5).fill(0).map((_, i) => (
        <span
          key={i}
          className={`text-xl ${i < rating ? "text-gold" : "text-gray-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
