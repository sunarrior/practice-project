export default function CategoryTag({
  category,
  handleRemoveTag,
}: {
  category: string;
  handleRemoveTag: (name: string) => void;
}) {
  return (
    <div className="relative w-fit">
      <div className="ml-1 text-xs inline-flex justify-start font-bold uppercase pl-3 pr-6 py-1 rounded-full border bg-green-200 border-green-500 text-gray-700">
        {category}
      </div>
      <button
        className="absolute right-2"
        onClick={() => handleRemoveTag(category)}
      >
        x
      </button>
    </div>
  );
}
