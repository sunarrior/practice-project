import Link from "next/link";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { TbLock } from "react-icons/tb";

export default function User({
  userid,
  username,
  email,
  createdAt,
  role,
  status,
  url,
  handleDeleteUser,
}: {
  userid: number;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  status: string;
  url: string;
  handleDeleteUser: (userid: number) => Promise<void>;
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
        <td className="px-6 py-4">{status}</td>
        <td className="flex px-1 py-4">
          <Link href={url}>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-md text-white font-bold">
              DETAIL
            </button>
          </Link>
          <div className="py-2">
            <button
              title="Detele User"
              onClick={() => {
                handleDeleteUser(userid);
              }}
            >
              <IoPersonRemoveSharp size={20} className="ml-5" />
            </button>
          </div>
          <div className="py-2">
            <button title="Block User">
              <TbLock size={20} className="ml-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
