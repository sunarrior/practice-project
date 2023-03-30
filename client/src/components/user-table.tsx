export default function UserTable({ children }: { children: any | any[] }) {
  return (
    <div className="relative overflow-x-auto shadow-md mx-10 rounded-md">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-orange-500">
          <tr>
            <th scope="col" className="px-6 py-3">
              User ID
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-1 py-3 w-48"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
