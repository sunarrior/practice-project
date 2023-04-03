import Image from "next/image";

export default function Category({
  url,
  categoryName,
  productQuantity,
}: {
  url: string;
  categoryName: string;
  productQuantity: number;
}) {
  return (
    <>
      <div className="mr-4 my-5 bg-orange-300 w-[248px] max-w-sm rounded-md overflow-hidden shadow-lg">
        <Image
          className="w-full h-44 object-cover"
          src={url}
          alt={categoryName}
          width={500}
          height={500}
        />
        <div className="px-6 py-2">
          <div className="font-bold text-xl mb-2 uppercase">{categoryName}</div>
          <p className="text-gray-700 text-base">Quantity: {productQuantity}</p>
        </div>
      </div>
    </>
  );
}
