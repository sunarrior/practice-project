export default function NotifyLogin({
  color,
  msg,
}: {
  color: string;
  msg: string;
}) {
  return (
    <>
      <div
        className={`bg-${color}-100 border border-${color}-400 text-${color}-700 px-5 py-3 mb-3 rounded relative`}
        role="alert"
      >
        <span className="block">{msg}</span>
      </div>
    </>
  );
}
