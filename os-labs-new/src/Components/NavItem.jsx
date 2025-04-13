export const NavItem = ({ icon, label, active, onClick, expanded, darkMode }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors ${
          active
            ? darkMode
              ? "bg-blue-900 text-blue-200"
              : "bg-blue-100 text-blue-800"
            : darkMode
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100"
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {expanded && <span className="ml-3">{label}</span>}
      </button>
    );
  }
  