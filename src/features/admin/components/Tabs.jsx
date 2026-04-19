const TABS = ["Destinations", "Packages"];

export default function Tabs({ tab, onTabChange }) {
  return (
    <div className="mt-6 flex gap-2">
      {TABS.map((tabName) => (
        <button
          key={tabName}
          onClick={() => onTabChange(tabName)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all ${
            tab === tabName
              ? "bg-[#10B981] text-white shadow-lg shadow-emerald-500/25"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
}
