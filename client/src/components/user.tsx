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
  isBlocked,
  url,
  handleDeleteUser,
  handleBlockUser,
}: {
  userid: number;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  status: string;
  isBlocked: boolean;
  url: string;
  handleDeleteUser: (userid: number) => Promise<void>;
  handleBlockUser: (username: string, isBlocked: boolean) => Promise<void>;
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
        <td className="px-6 py-4">{isBlocked ? "Yes" : "No"}</td>
        <td className="flex px-1 py-4">
          <Link href={url}>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-md text-white font-bold">
              DETAIL
            </button>
          </Link>
          <div className="py-2">
            <button
              className="focus:outline-none"
              title="Detele User"
              onClick={() => {
                handleDeleteUser(userid);
              }}
            >
              <IoPersonRemoveSharp size={20} className="ml-5" />
            </button>
          </div>
          <div className="py-2">
            <button
              className="focus:outline-none"
              title="Block User"
              onClick={() => {
                handleBlockUser(username, isBlocked);
              }}
            >
              <TbLock size={20} className="ml-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
