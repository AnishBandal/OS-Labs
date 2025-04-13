export const HomePage = ({ setCurrentPage, darkMode }) => {
    return (
      <div className="p-8">
        <header className="mb-12 text-center">
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Operating Systems Algorithms Visualizer
          </h1>
          <p
            className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Interactive visualizations of common OS algorithms
          </p>
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AlgorithmCard
            title="Disk Scheduling Algorithms"
            description="Visualize FCFS, SSTF, SCAN, LOOK, C-SCAN, and C-LOOK algorithms to understand how disk requests are processed."
            icon={<Disc size={40} />}
            onClick={() => setCurrentPage("disk")}
            darkMode={darkMode}
          />
  
          <AlgorithmCard
            title="Page Replacement Algorithms"
            description="Coming soon! Visualize FIFO, LRU, Optimal, and other page replacement algorithms."
            icon={<Book size={40} />}
            disabled={true}
            darkMode={darkMode}
          />
  
          <AlgorithmCard
            title="CPU Scheduling Algorithms"
            description="Coming soon! Visualize FCFS, SJF, Round Robin, Priority Scheduling, and more."
            icon={<Book size={40} />}
            disabled={true}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }
  