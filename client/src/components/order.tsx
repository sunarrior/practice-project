import Link from "next/link";

export default function Order({
  orderid,
  paymentMethod,
  orderDay,
  completedDay,
  firstItem,
  totalItem,
  cost,
  url,
}: {
  orderid: number;
  paymentMethod: string;
  orderDay: string;
  completedDay: string | undefined;
  firstItem: string;
  totalItem: number;
  cost: number;
  url: string;
}) {
  return (
    <>
      <tr className="bg-gray-300 border-b font-medium">
        <td scope="row" className="px-6 py-4 text-black">
          {orderid}
        </td>
        <td className="px-6 py-4">{paymentMethod}</td>
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
