import Link from "next/link";

export default function Order({
  isSelected,
  orderid,
  username,
  paymentMethod,
  orderDay,
  completedDay,
  firstItem,
  totalItem,
  cost,
  url,
  handleOrderSelection,
}: {
  isSelected: boolean;
  orderid: number;
  username: string;
  paymentMethod: string;
  orderDay: string;
  completedDay: string | undefined;
  firstItem: string;
  totalItem: number;
  cost: number;
  url: string;
  handleOrderSelection: (orderid: number) => void;
}) {
  return (
    <>
      <tr
        className={
          isSelected
            ? "bg-gray-400 border-b font-medium"
            : "bg-gray-300 border-b font-medium"
        }
        onClick={() => handleOrderSelection(orderid)}
      >
        <td scope="row" className="px-6 py-4 text-black">
          {orderid}
        </td>
        <td className="px-6 py-4">{username}</td>
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
