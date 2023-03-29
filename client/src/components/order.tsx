import Link from "next/link";

export default function Order({
  orderid,
  orderDay,
  completedDay,
  firstItem,
  totalItem,
  cost,
  url,
}: {
  orderid: number;
  orderDay: string;
  completedDay: string;
  firstItem: string;
  totalItem: number;
  cost: number;
  url: string;
}) {
  return (
    <>
      <tr className="bg-gray-300 border-b font-medium">
        <th scope="row" className="px-6 py-4 text-black">
          {orderid}
        </th>
        <td className="px-6 py-4">{orderDay}</td>
        <td className="px-6 py-4">{completedDay || "Not yet completed"}</td>
        <td className="px-6 py-4">{firstItem}</td>
        <td className="px-6 py-4">{totalItem}</td>
        <td className="px-6 py-4">{cost}$</td>
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
