import { ChevronRight } from "lucide-react";
// Algorithm Card Component
export const AlgorithmCard =({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  darkMode,
}) => {
  const cardClass = disabled
    ? `${
        darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
      } cursor-not-allowed`
    : `${
        darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-blue-50"
      } cursor-pointer shadow-lg hover:shadow-xl border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } transition-all`;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`rounded-xl p-6 h-full flex flex-col ${cardClass}`}
    >
      <div
        className={`${
          disabled ? "" : darkMode ? "text-blue-400" : "text-blue-600"
        } mb-4`}
      >
        {icon}
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p
        className={`${darkMode ? "text-gray-400" : "text-gray-600"} flex-grow`}
      >
        {description}
      </p>
      {!disabled && (
        <div className="mt-4 flex justify-end">
          <div
            className={`flex items-center ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            <span className="mr-1">Explore</span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}
      {disabled && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-600 text-white">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}
