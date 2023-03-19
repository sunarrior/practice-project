import { MouseEventHandler } from "react";

export default function ButtonEdit({
  isEdit,
  onEdit,
  onCancel,
}: {
  isEdit: boolean;
  onEdit: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}) {
  if (isEdit) {
    return (
      <>
        <button
          className="px-3 py-2 mr-2 border rounded-md bg-red-500 hover:bg-red-400 text-white font-bold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-3 py-2 mr-2 border rounded-md bg-green-500 hover:bg-green-400 text-white font-bold"
          type="submit"
          form="profile-form"
        >
          Save
        </button>
      </>
    );
  }
  return (
    <>
      <button
        className="px-3 py-2 mr-2 border rounded-md bg-purple-500 hover:bg-purple-400 text-white font-bold"
        onClick={onEdit}
      >
        Edit
      </button>
    </>
  );
}
