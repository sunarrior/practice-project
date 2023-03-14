export default function NotifyLogin({
  color,
  msg,
}: {
  color: string;
  msg: string;
}) {
  const notifyColor =
    color === "red"
      ? "bg-red-100 border border-red-500 text-red-600 px-5 py-3 mb-3 rounded relative"
      : "bg-green-100 border border-green-400 text-green-700 px-5 py-3 mb-3 rounded relative";
  return (
    <>
      <div className={notifyColor} role="alert">
        <span className="block font-bold">{msg}</span>
      </div>
    </>
  );
}
