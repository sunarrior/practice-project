import React from "react";

export default function CategoryListCheckbox({
  id,
  categoryName,
  onCheckboxClick,
}: {
  id: number;
  categoryName: string;
  onCheckboxClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): React.ReactElement {
  return (
    <>
      <li className="w-full border border-gray-300 rounded-lg">
        <div className="flex items-center pl-3">
          <input
            id={String(id)}
            type="checkbox"
            value={categoryName}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            onChange={onCheckboxClick}
          />
          <label
            htmlFor={String(id)}
            className="w-full py-3 ml-2 text-sm font-medium text-gray-900"
          >
            {categoryName}
          </label>
        </div>
      </li>
    </>
  );
}
