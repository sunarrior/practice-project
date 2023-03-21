import Image from "next/image";

export default function Banner({
  url,
  categoryName,
  productQuantity,
  description,
}: {
  url: string;
  categoryName: string;
  productQuantity: number;
  description: string;
}) {
  return (
    <>
      <div
        id="banner"
        className="flex max-w-full mx-52 py-3 px-4 bg-orange-400 border border-b border-gray-200 rounded-md"
      >
        <Image
          className="w-1/4 h-52"
          src={url}
          alt={categoryName}
          width={500}
          height={500}
        />
        <div className="flex-none w-3/4">
          <p className="text-lg font-bold ml-5 mb-3 uppercase">
            {categoryName}
          </p>
          <p className="text-md font-bold ml-5 mb-3">
            PRODUCT QUANTITY: {productQuantity}
          </p>
          <p className="text-md text-justify ml-5">{description}</p>
        </div>
      </div>
    </>
  );
}
