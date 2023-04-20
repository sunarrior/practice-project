export default function PaymentMethod({
  id,
  bankType,
  last4,
  expMonth,
  expYear,
  checked,
  onPaymentMethodTypeChange,
  onPaymentMethodTypeClick,
}: {
  id: string;
  bankType: string;
  last4: string;
  expMonth: string;
  expYear: string;
  checked: boolean;
  onPaymentMethodTypeChange: (pmId: string) => void;
  onPaymentMethodTypeClick: (pmId: string) => void;
}) {
  return (
    <>
      <div
        className="w-full border border-black h-10 bg-slate-300 hover:bg-slate-400 rounded-md relative mb-2 py-2 hover:cursor-pointer"
        onClick={() => onPaymentMethodTypeClick(id)}
      >
        <div className="absolute left-4 flex">
          <input
            id={id}
            type="radio"
            value={id}
            name="payment-method-type"
            className="hover:cursor-pointer"
            onChange={() => onPaymentMethodTypeChange(id)}
            checked={checked}
          />
          <label htmlFor={id} className="ml-2 hover:cursor-pointer uppercase">
            {bankType}
          </label>
        </div>
        <div className="absolute right-4">
          <p className="italic font-bold">
            ********{last4} - {expMonth}/{expYear}
          </p>
        </div>
      </div>
    </>
  );
}
