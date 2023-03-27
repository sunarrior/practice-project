import Image from "next/image";

export default function ProductCart({
  id,
  checkedItem,
  url,
  productName,
  quantity,
  price,
  handleItemClick,
  handleCheckboxChange,
}: {
  id: number;
  checkedItem: boolean;
  url: string;
  productName: string;
  quantity: number;
  price: number;
  handleItemClick: (id: number) => void;
  handleCheckboxChange: (id: number) => void;
}) {
  return (
    <>
      <div className="relative mr-4 my-5 bg-orange-400 w-64 max-w-sm rounded-md overflow-hidden shadow-md">
        <input
          className="absolute top-2 left-2 w-4 h-4 rounded-md"
          type="checkbox"
          onChange={() => handleCheckboxChange(id)}
          checked={checkedItem}
        />
        <div onClick={() => handleItemClick(id)}>
          <Image
            className="w-full h-44 object-cover"
            src={url}
            alt={productName}
            width={500}
            height={500}
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{productName}</div>
            <div className="font-bold text-md mb-2">Quantity: {quantity}</div>
            <p className="text-gray-700 text-base">Price: {price}$</p>
          </div>
        </div>
      </div>
    </>
  );
}
