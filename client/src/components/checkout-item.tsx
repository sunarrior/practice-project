import Image from "next/image";

export default function CheckoutItem({
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
      <div className="flex mx-10 my-4 border rounded-md">
        <div className="w-fit">
          <Image
            className="w-32 h-32 object-cover"
            src={url}
            alt={productName}
            width={500}
            height={500}
          />
        </div>
        <div className="w-4/5 flex-none ml-3 mt-3">
          <div className="font-bold text-md mb-2">{productName}</div>
          <div className="font-bold text-sm mb-2">Quantity: {quantity}</div>
          <p className="text-gray-700 text-base">Price: {price}$</p>
        </div>
      </div>
    </>
  );
}
