export default function Card({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
