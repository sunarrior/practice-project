import Image from "next/image";

export default function OrderItem({
  url,
  productName,
  quantity,
  price,
}: {
  url: string;
  productName: string;
  quantity: number;
  price: number;
}) {
  return (
    <>
      <div className="mr-4 my-5 bg-orange-300 w-64 max-w-sm rounded-md overflow-hidden shadow-lg">
        <Image
          className="w-full h-44 object-cover"
          src={url}
          alt={productName}
          width={500}
          height={500}
        />
        <div className="px-6 py-2">
          <div className="font-bold text-xl mb-2 uppercase">{productName}</div>
          <p className="text-gray-700 text-base">Quantity: {quantity}</p>
          <p className="text-gray-700 text-base">Price: {price}$</p>
        </div>
      </div>
    </>
  );
}
