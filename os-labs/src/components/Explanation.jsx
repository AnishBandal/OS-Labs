const explanations = {
    FCFS: "First Come First Serve (FCFS) serves requests in the order they arrive. Simple but may result in higher seek times.",
    SSTF: "Shortest Seek Time First (SSTF) selects the request closest to the current head position, minimizing seek time but may cause starvation.",
    SCAN: "SCAN (Elevator Algorithm) moves the head back and forth across the disk, serving requests in its path.",
    LOOK: "Similar to SCAN but reverses direction only when no more requests exist in the current direction.",
    "C-SCAN": "Circular SCAN moves the head in one direction and returns to the start without servicing requests on the return.",
    "C-LOOK": "Like C-SCAN but only moves as far as the last request in each direction."
  };
  
  const Explanation = ({ selectedAlgorithms }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Algorithm Explanation</h2>
        {selectedAlgorithms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Select an algorithm to see its explanation</p>
        ) : (
          selectedAlgorithms.map(algorithm => (
            <div key={algorithm} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-200">{algorithm}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{explanations[algorithm]}</p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default Explanation;