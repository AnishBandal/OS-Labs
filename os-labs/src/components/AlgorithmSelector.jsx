const AlgorithmSelector = ({ selectedAlgorithms, onChange }) => {
    const algorithms = [
      { value: 'FCFS', label: 'FCFS (First Come First Serve)' },
      { value: 'SSTF', label: 'SSTF (Shortest Seek Time First)' },
      { value: 'SCAN', label: 'SCAN (Elevator Algorithm)' },
      { value: 'LOOK', label: 'LOOK' },
      { value: 'C-SCAN', label: 'C-SCAN (Circular SCAN)' },
      { value: 'C-LOOK', label: 'C-LOOK (Circular LOOK)' }
    ];
  
    const toggleAlgorithm = (algorithm) => {
      if (selectedAlgorithms.includes(algorithm)) {
        onChange(selectedAlgorithms.filter(a => a !== algorithm));
      } else {
        onChange([...selectedAlgorithms, algorithm]);
      }
    };
  
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Select Algorithms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {algorithms.map((algorithm) => (
            <label key={algorithm.value} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedAlgorithms.includes(algorithm.value)}
                onChange={() => toggleAlgorithm(algorithm.value)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-300">{algorithm.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  export default AlgorithmSelector;