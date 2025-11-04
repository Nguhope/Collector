export default function StatusChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-full overflow-x-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">Device Status Overview</h3>
      <table className="min-w-full border-separate border-spacing-y-3 border-spacing-x-0">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg">
            {["Date / Time", "Site Name", "Electronic Name", "IP Address", "Status"].map(header => (
              <th key={header} className="py-3 px-5 text-left font-semibold rounded-tl-lg rounded-tr-lg">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, date, site, electronic, ip, status }) => (
            <tr key={id} className="bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors rounded-xl border border-transparent hover:border-blue-300">
              <td className="py-4 px-5 font-mono text-gray-800">{date}</td>
              <td className="py-4 px-5 font-semibold text-gray-700">{site}</td>
              <td className="py-4 px-5 text-gray-700">{electronic}</td>
              <td className="py-4 px-5 font-mono text-gray-600">{ip}</td>
              <td className="py-4 px-5">
                <span
                  className={`inline-block w-5 h-5 rounded-full shadow-md ${
                    status === "online" ? "bg-green-400" : "bg-red-500"
                  }`}
                  title={status}
                ></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
