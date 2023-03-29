import Link from "next/link";

export default function User({
  userid,
  username,
  email,
  createdAt,
  role,
  url,
}: {
  userid: number;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  url: string;
}) {
  return (
    <>
      <tr className="bg-gray-300 border-b font-medium">
        <th scope="row" className="px-6 py-4 text-black">
          {userid}
        </th>
        <td className="px-6 py-4">{username}</td>
        <td className="px-6 py-4">{email || "Not yet completed"}</td>
        <td className="px-6 py-4">{createdAt.toLocaleString()}</td>
        <td className="px-6 py-4">{role}</td>
        <td className="px-1 py-4">
          <Link href={url}>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-md text-white font-bold">
              DETAIL
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
}
