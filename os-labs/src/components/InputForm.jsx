const InputForm = ({ requests, initialPosition, onRequestsChange, onPositionChange, onSubmit }) => {
    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Disk Requests (comma separated)
          </label>
          <input
            type="text"
            id="requests"
            value={requests}
            onChange={(e) => onRequestsChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="e.g. 98, 183, 37, 122"
          />
        </div>
  
        <div>
          <label htmlFor="initialPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Initial Head Position
          </label>
          <input
            type="number"
            id="initialPosition"
            value={initialPosition}
            onChange={(e) => onPositionChange(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
  
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
        >
          Visualize Algorithm
        </button>
      </form>
    );
  };
  
  export default InputForm;