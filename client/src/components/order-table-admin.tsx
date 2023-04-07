export default function OrderTable({ children }: { children: any | any[] }) {
  return (
    <div className="relative overflow-x-auto shadow-md mx-10 rounded-md">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-orange-500">
          <tr>
            <th scope="col" className="px-6 py-3">
              Order ID
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Order Day
            </th>
            <th scope="col" className="px-6 py-3">
              Completed Day
            </th>
            <th scope="col" className="px-6 py-3">
              First Item In Order
            </th>
            <th scope="col" className="px-6 py-3">
              Total Item
            </th>
            <th scope="col" className="px-6 py-3">
              Cost
            </th>
            <th scope="col" className="px-1 py-3"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
