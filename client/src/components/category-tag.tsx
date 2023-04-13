export default function CategoryTag({ category }: { category: string }) {
  return (
    <div className="ml-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full border bg-green-200 border-green-500 text-gray-700">
      {category}
    </div>
  );
}
