export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="pb-3 border-b last:border-0">
      <p className="text-neutral-500 text-xs mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function PreviewRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <tr>
      <td className="py-1 pr-4 w-48 text-neutral-600 align-top">{label}</td>
      <td className="py-1 pr-2 w-3 align-top">:</td>
      <td className={`py-1 align-top ${bold ? "font-semibold" : ""}`}>
        {value}
      </td>
    </tr>
  );
}
