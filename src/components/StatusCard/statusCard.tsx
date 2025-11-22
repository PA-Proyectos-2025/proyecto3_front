import "./statusCard.css";

type Props = {
  color: "yellow" | "blue" | "green" | "red";
  value: number;
  label: string;
  icon: string;
};

export default function StatusCard({ color, value, label, icon }: Props) {
  return (
    <div className={`status-card ${color}`}>
      <div className="value">{String(value).padStart(2, "0")}</div>
      <div className="label">{label}</div>
      <div className="icon">{icon}</div>
    </div>
  );
}