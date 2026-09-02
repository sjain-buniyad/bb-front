interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5 flex items-start gap-4 hover:border-[#d4d4d8] transition-colors duration-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
        accent ? "bg-accent/10 text-accent" : "bg-surface-700 text-zinc-600"
      }`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}
