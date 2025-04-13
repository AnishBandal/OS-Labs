import { useState } from "react";
import {
  Home,
  Disc,
  Book,
  Moon,
  Sun,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { NavItem } from "./Components/NavItem";
// Main App Component
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [navExpanded, setNavExpanded] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Sidebar Navigation */}
      <div
        className={`${
          navExpanded ? "w-64" : "w-20"
        } transition-all duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } border-r ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`font-bold text-xl ${navExpanded ? "block" : "hidden"}`}
          >
            OS Lab
          </h1>
          <button
            onClick={() => setNavExpanded(!navExpanded)}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {navExpanded ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 py-6">
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            active={currentPage === "home"}
            onClick={() => setCurrentPage("home")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Disc size={20} />}
            label="Disk Scheduling"
            active={currentPage === "disk"}
            onClick={() => setCurrentPage("disk")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Book size={20} />}
            label="Documentation"
            active={currentPage === "docs"}
            onClick={() => setCurrentPage("docs")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className={`${navExpanded ? "block" : "hidden"} text-sm`}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentPage === "home" && (
          <HomePage setCurrentPage={setCurrentPage} darkMode={darkMode} />
        )}
        {currentPage === "disk" && <DiskSchedulingPage darkMode={darkMode} />}
        {currentPage === "docs" && <DocumentationPage darkMode={darkMode} />}
      </div>
    </div>
  );
}



// Home Page Component
function HomePage({ setCurrentPage, darkMode }) {
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

// Algorithm Card Component
function AlgorithmCard({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  darkMode,
}) {
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

// Disk Scheduling Page Component
function DiskSchedulingPage({ darkMode }) {
  const [algorithm, setAlgorithm] = useState("");
  const [showAllAlgorithms, setShowAllAlgorithms] = useState(false);
  const [diskRequests, setDiskRequests] = useState(
    "98, 183, 37, 122, 14, 124, 65, 67"
  );
  const [initialHead, setInitialHead] = useState("53");
  const [diskRange, setDiskRange] = useState("0-199");
  const [isAnimating, setIsAnimating] = useState(false);
  const [results, setResults] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationInterval, setAnimationInterval] = useState(null);

  const parseRequests = () => {
    return diskRequests
      .split(",")
      .map((req) => parseInt(req.trim()))
      .filter((req) => !isNaN(req));
  };

  const getHeadPosition = () => {
    return parseInt(initialHead.trim());
  };

  const getDiskRange = () => {
    const [min, max] = diskRange.split("-").map((v) => parseInt(v.trim()));
    return { min: min || 0, max: max || 199 };
  };

  const getChartData = (seekSequence, head) => {
    if (!seekSequence) return [];

    const fullSequence = [head, ...seekSequence];

    return fullSequence.map((position, index) => ({
      name: index === 0 ? "Initial" : `Step ${index}`,
      position,
      value: position,
    }));
  };

  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
    setIsAnimating(false);
  };

  const replayAnimation = () => {
    stopAnimation();
    setAnimationStep(0);
    // Start animation after a small delay
    setTimeout(() => {
      startAnimation();
    }, 100);
  };
  // Updated startAnimation function
  const startAnimation = () => {
    stopAnimation(); // Clear any existing animation
    setIsAnimating(true);

    const maxSteps = Object.values(results)[0].seekSequence.length;
    // let step = 0;

    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        const newStep = prev + 1;
        if (newStep >= maxSteps) {
          clearInterval(interval);
          setIsAnimating(false);
        }
        return newStep;
      });
    }, 500); // Adjust timing for smoother animation (500ms per step)

    setAnimationInterval(interval);
  };

  const runAlgorithm = () => {
    const requests = parseRequests();
    const head = getHeadPosition();
    const range = getDiskRange();

    if (requests.length === 0 || isNaN(head)) {
      alert("Please enter valid disk requests and initial head position");
      return;
    }

    let algorithmResults = {};

    if (showAllAlgorithms) {
      algorithmResults = {
        fcfs: calculateFCFS(requests, head),
        sstf: calculateSSTF(requests, head),
        scan: calculateSCAN(requests, head, range, "up"),
        cscan: calculateCSCAN(requests, head, range),
        look: calculateLOOK(requests, head, "up"),
        clook: calculateCLOOK(requests, head),
      };
    } else if (algorithm) {
      switch (algorithm) {
        case "fcfs":
          algorithmResults = { fcfs: calculateFCFS(requests, head) };
          break;
        case "sstf":
          algorithmResults = { sstf: calculateSSTF(requests, head) };
          break;
        case "scan":
          algorithmResults = {
            scan: calculateSCAN(requests, head, range, "up"),
          };
          break;
        case "cscan":
          algorithmResults = { cscan: calculateCSCAN(requests, head, range) };
          break;
        case "look":
          algorithmResults = { look: calculateLOOK(requests, head, "up") };
          break;
        case "clook":
          algorithmResults = { clook: calculateCLOOK(requests, head) };
          break;
        default:
          break;
      }
    } else {
      alert("Please select an algorithm");
      return;
    }

    // Reset animation state
    setAnimationStep(0);
    setResults(algorithmResults);

    // Start animation after a small delay to allow state to update
    setTimeout(() => {
      startAnimation();
    }, 100);
  };

  // Algorithm implementations
  const calculateFCFS = (requests, head) => {
    const seekSequence = [...requests];
    let totalSeekTime = 0;
    let currentPosition = head;

    for (const request of seekSequence) {
      totalSeekTime += Math.abs(request - currentPosition);
      currentPosition = request;
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateSSTF = (requests, head) => {
    const remainingRequests = [...requests];
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;

    while (remainingRequests.length > 0) {
      // Find the closest request
      let minDistance = Infinity;
      let minIndex = -1;

      for (let i = 0; i < remainingRequests.length; i++) {
        const distance = Math.abs(remainingRequests[i] - currentPosition);
        if (distance < minDistance) {
          minDistance = distance;
          minIndex = i;
        }
      }

      const nextRequest = remainingRequests[minIndex];
      remainingRequests.splice(minIndex, 1);
      seekSequence.push(nextRequest);
      totalSeekTime += minDistance;
      currentPosition = nextRequest;
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateSCAN = (requests, head, range, direction) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Split requests into those greater than and less than head
    const requestsGreaterThanHead = sortedRequests.filter((req) => req > head);
    const requestsLessThanHead = sortedRequests.filter((req) => req < head);

    if (direction === "up") {
      // First go up
      for (const request of requestsGreaterThanHead) {
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }

      // Then go to the end
      if (currentPosition < range.max) {
        seekSequence.push(range.max);
        totalSeekTime += Math.abs(range.max - currentPosition);
        currentPosition = range.max;
      }

      // Then go down
      for (let i = requestsLessThanHead.length - 1; i >= 0; i--) {
        const request = requestsLessThanHead[i];
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }
    } else {
      // First go down
      for (let i = requestsLessThanHead.length - 1; i >= 0; i--) {
        const request = requestsLessThanHead[i];
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }

      // Then go to the beginning
      if (currentPosition > range.min) {
        seekSequence.push(range.min);
        totalSeekTime += Math.abs(range.min - currentPosition);
        currentPosition = range.min;
      }

      // Then go up
      for (const request of requestsGreaterThanHead) {
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateCSCAN = (requests, head, range) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Split requests into those greater than and less than head
    const requestsGreaterThanHead = sortedRequests.filter((req) => req > head);
    const requestsLessThanHead = sortedRequests.filter((req) => req < head);

    // First go up
    for (const request of requestsGreaterThanHead) {
      seekSequence.push(request);
      totalSeekTime += Math.abs(request - currentPosition);
      currentPosition = request;
    }

    // Go to the end
    if (currentPosition < range.max) {
      seekSequence.push(range.max);
      totalSeekTime += Math.abs(range.max - currentPosition);
      currentPosition = range.max;
    }

    // Go to the beginning
    seekSequence.push(range.min);
    totalSeekTime += Math.abs(range.max - range.min);
    currentPosition = range.min;

    // Then process requests less than head
    for (const request of requestsLessThanHead) {
      seekSequence.push(request);
      totalSeekTime += Math.abs(request - currentPosition);
      currentPosition = request;
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateLOOK = (requests, head, direction) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Split requests into those greater than and less than head
    const requestsGreaterThanHead = sortedRequests.filter((req) => req > head);
    const requestsLessThanHead = sortedRequests.filter((req) => req < head);

    if (direction === "up") {
      // First go up
      for (const request of requestsGreaterThanHead) {
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }

      // Then go down
      for (let i = requestsLessThanHead.length - 1; i >= 0; i--) {
        const request = requestsLessThanHead[i];
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }
    } else {
      // First go down
      for (let i = requestsLessThanHead.length - 1; i >= 0; i--) {
        const request = requestsLessThanHead[i];
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }

      // Then go up
      for (const request of requestsGreaterThanHead) {
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateCLOOK = (requests, head) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Split requests into those greater than and less than head
    const requestsGreaterThanHead = sortedRequests.filter((req) => req > head);
    const requestsLessThanHead = sortedRequests.filter((req) => req < head);

    // First go up
    for (const request of requestsGreaterThanHead) {
      seekSequence.push(request);
      totalSeekTime += Math.abs(request - currentPosition);
      currentPosition = request;
    }

    // Jump to the beginning of the requests
    if (requestsLessThanHead.length > 0) {
      const minRequest = Math.min(...requestsLessThanHead);
      totalSeekTime += Math.abs(currentPosition - minRequest);
      currentPosition = minRequest;
      seekSequence.push(minRequest);

      // Process remaining requests less than head
      for (let i = 1; i < requestsLessThanHead.length; i++) {
        const request = requestsLessThanHead[i];
        seekSequence.push(request);
        totalSeekTime += Math.abs(request - currentPosition);
        currentPosition = request;
      }
    }

    return { seekSequence, totalSeekTime };
  };

  const algorithmDetails = {
    fcfs: {
      name: "First Come First Served (FCFS)",
      description:
        "FCFS is the simplest disk scheduling algorithm. Requests are served in the order they arrive in the queue, regardless of their location on the disk.",
    },
    sstf: {
      name: "Shortest Seek Time First (SSTF)",
      description:
        "SSTF selects the request that requires the least head movement from the current position, minimizing seek time.",
    },
    scan: {
      name: "SCAN (Elevator Algorithm)",
      description:
        "SCAN moves the disk arm in one direction, serving all requests in that direction, then reverses direction to serve requests in the opposite direction.",
    },
    cscan: {
      name: "Circular SCAN (C-SCAN)",
      description:
        "C-SCAN moves the disk arm in one direction only, returning to the beginning of the disk when it reaches the end, to provide more uniform wait times.",
    },
    look: {
      name: "LOOK Algorithm",
      description:
        "LOOK is similar to SCAN but only goes as far as the last request in each direction, rather than going to the end of the disk.",
    },
    clook: {
      name: "Circular LOOK (C-LOOK)",
      description:
        "C-LOOK is similar to C-SCAN but only goes as far as the last request in each direction, providing better performance than C-SCAN.",
    },
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <header className="mb-6">
        <h1
          className={`text-3xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Disk Scheduling Algorithms
        </h1>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Visualize and compare different disk scheduling algorithms.
        </p>
      </header>

      {/* Algorithm Selection & Input Form */}
      <div
        className={`p-6 rounded-xl mb-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showAllAlgorithms}
                  onChange={(e) => {
                    setShowAllAlgorithms(e.target.checked);
                    if (e.target.checked) setAlgorithm("");
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Show All Algorithms</span>
              </label>
            </div>

            {!showAllAlgorithms && (
              <>
                <div>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className={`w-full rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } px-3 py-2`}
                    disabled={showAllAlgorithms}
                  >
                    <option value="">Select an algorithm</option>
                    <option value="fcfs">FCFS</option>
                    <option value="sstf">SSTF</option>
                    <option value="scan">SCAN</option>
                    <option value="cscan">C-SCAN</option>
                    <option value="look">LOOK</option>
                    <option value="clook">C-LOOK</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              Disk Requests (comma separated)
            </label>
            <input
              type="text"
              value={diskRequests}
              onChange={(e) => setDiskRequests(e.target.value)}
              className={`w-full rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } px-3 py-2`}
              placeholder="e.g., 98, 183, 37, 122, 14, 124, 65, 67"
            />
          </div>

          <div>
            <label className="block mb-2">Initial Head Position</label>
            <input
              type="text"
              value={initialHead}
              onChange={(e) => setInitialHead(e.target.value)}
              className={`w-full rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } px-3 py-2`}
              placeholder="e.g., 53"
            />
          </div>

          <div>
            <label className="block mb-2">Disk Range (min-max)</label>
            <input
              type="text"
              value={diskRange}
              onChange={(e) => setDiskRange(e.target.value)}
              className={`w-full rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } px-3 py-2`}
              placeholder="e.g., 0-199"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={runAlgorithm}
            disabled={isAnimating}
            className={`px-4 py-2 rounded-lg ${
              isAnimating
                ? "bg-gray-400 cursor-not-allowed"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium`}
          >
            {isAnimating ? "Animating..." : "Run Algorithm"}
          </button>
        </div>
      </div>

      {/* Algorithm Explanation */}
      {(algorithm || showAllAlgorithms) && !results && (
        <div
          className={`p-6 rounded-xl mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-2">
            {showAllAlgorithms
              ? "Comparing All Algorithms"
              : algorithmDetails[algorithm]?.name || "Algorithm Details"}
          </h2>
          <p>
            {showAllAlgorithms
              ? "This will compare all six disk scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK."
              : algorithmDetails[algorithm]?.description || ""}
          </p>
        </div>
      )}

      {/* Results & Visualization */}
      {results && (
        <div
          className={`p-6 rounded-xl mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          {/* Chart */}
          <div className="grid grid-cols-1 gap-8">
            {Object.entries(results).map(([key, data]) => {
              const chartData = getChartData(
                data.seekSequence,
                getHeadPosition()
              );
              const displayedData = chartData.slice(0, animationStep + 1);
              const range = getDiskRange();

              return (
                <div key={key} className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {algorithmDetails[key]?.name}
                    </h3>
                    <button
                      onClick={replayAnimation}
                      className={`px-3 py-1 rounded-lg ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white text-sm`}
                    >
                      Replay Animation
                    </button>
                  </div>
                  <p className="mb-4">{algorithmDetails[key]?.description}</p>

                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } overflow-x-auto`}
                  >
                    <LineChart
                      width={800}
                      height={300}
                      data={displayedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tickFormatter={(value, index) =>
                          index === 0 ? "Initial" : `Step ${index}`
                        }
                        tick={{ fill: darkMode ? "#e5e7eb" : "#4b5563" }}
                      />
                      <YAxis
                        domain={[range.min, range.max]} // Set fixed domain based on disk range
                        ticks={[
                          range.min,
                          ...displayedData.map((d) => d.value),
                          range.max,
                        ]
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .sort((a, b) => a - b)}
                      />
                      <Tooltip
                        formatter={(value) => [`Position: ${value}`, ""]}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
                          borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                        }}
                      />
                      <ReferenceLine
                        y={getHeadPosition()}
                        stroke="green"
                        strokeDasharray="5 5"
                        label={{
                          value: "Initial Head",
                          position: "insideTopLeft", // Changed position
                          fill: darkMode ? "#fff" : "#000",
                          fontSize: 12,
                        }}
                      />

                      <Line
                        type="monotone" // Changed to monotone for smoother curves
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false} // We handle animation ourselves
                        connectNulls={true}
                      />
                      {displayedData.length > 1 && (
                        <ReferenceLine
                          y={displayedData[displayedData.length - 1].value}
                          stroke="red"
                          label={{
                            value: "Current",
                            position: "insideBottomRight",
                          }}
                        />
                      )}
                    </LineChart>

                    {/* Results */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="font-medium">Seek Sequence:</span>
                        <span className="font-mono">
                          {getHeadPosition()} -&gt;{" "}
                          {data.seekSequence
                            .slice(0, animationStep)
                            .join(" -> ")}
                          {animationStep < data.seekSequence.length
                            ? " -> ..."
                            : ""}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium">Total Seek Time:</span>
                        <span className="font-mono">
                          {isAnimating &&
                          animationStep < data.seekSequence.length
                            ? "Calculating..."
                            : data.totalSeekTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Documentation Page Component
function DocumentationPage({ darkMode }) {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Documentation
        </h1>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Learn about operating system algorithms and how to use this
          application.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div
            className={`sticky top-8 p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-4">Contents</h2>
            <ul
              className={`space-y-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <li>
                <a href="#introduction" className="hover:underline">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#disk-scheduling" className="hover:underline">
                  Disk Scheduling Algorithms
                </a>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>
                    <a href="#fcfs" className="hover:underline">
                      FCFS
                    </a>
                  </li>
                  <li>
                    <a href="#sstf" className="hover:underline">
                      SSTF
                    </a>
                  </li>
                  <li>
                    <a href="#scan" className="hover:underline">
                      SCAN
                    </a>
                  </li>
                  <li>
                    <a href="#cscan" className="hover:underline">
                      C-SCAN
                    </a>
                  </li>
                  <li>
                    <a href="#look" className="hover:underline">
                      LOOK
                    </a>
                  </li>
                  <li>
                    <a href="#clook" className="hover:underline">
                      C-LOOK
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#usage" className="hover:underline">
                  How to Use the App
                </a>
              </li>
              <li>
                <a href="#future" className="hover:underline">
                  Future Additions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div
            className={`p-6 rounded-xl mb-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            id="introduction"
          >
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">
              This application is designed to help students and professionals
              visualize and understand various operating system algorithms.
              Currently, the application supports disk scheduling algorithms,
              with plans to add more categories in the future.
            </p>
            <p>
              The interactive visualizations allow you to see how different
              algorithms handle the same input data, making it easier to compare
              their efficiency and behavior under various scenarios.
            </p>
          </div>

          <div
            className={`p-6 rounded-xl mb-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            id="disk-scheduling"
          >
            <h2 className="text-2xl font-bold mb-4">
              Disk Scheduling Algorithms
            </h2>
            <p className="mb-6">
              Disk scheduling algorithms determine the order in which disk I/O
              requests are serviced. A good disk scheduling algorithm should aim
              to minimize seek time and provide a fair service to all processes.
            </p>

            <div className="mb-6" id="fcfs">
              <h3 className="text-xl font-semibold mb-2">
                First Come First Served (FCFS)
              </h3>
              <p>
                FCFS is the simplest disk scheduling algorithm. Requests are
                processed in the order they arrive in the queue, regardless of
                their location on the disk. While simple to implement, FCFS can
                lead to long seek times if requests are far apart on the disk.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Simple to implement</li>
                  <li>Fair to all processes</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Can result in high average seek times</li>
                  <li>No optimization for minimizing head movement</li>
                </ul>
              </div>
            </div>

            <div className="mb-6" id="sstf">
              <h3 className="text-xl font-semibold mb-2">
                Shortest Seek Time First (SSTF)
              </h3>
              <p>
                SSTF selects the request that requires the least head movement
                from the current position. This approach minimizes seek time but
                can lead to starvation of requests that are far from the current
                head position.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Better average seek time than FCFS</li>
                  <li>Optimizes for minimal head movement</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Possible starvation of requests far from the head</li>
                  <li>Overhead of finding the closest request</li>
                </ul>
              </div>
            </div>

            <div className="mb-6" id="scan">
              <h3 className="text-xl font-semibold mb-2">
                SCAN (Elevator Algorithm)
              </h3>
              <p>
                SCAN moves the disk arm in one direction (up or down), serving
                all requests in that path. When it reaches the end of the disk,
                it reverses direction and services requests in the opposite
                direction. This algorithm is also known as the elevator
                algorithm.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Better performance than FCFS and SSTF for high loads</li>
                  <li>Prevents starvation</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Longer wait times for requests just visited by the head
                  </li>
                  <li>Uneven service distribution across the disk</li>
                </ul>
              </div>
            </div>

            <div className="mb-6" id="cscan">
              <h3 className="text-xl font-semibold mb-2">
                Circular SCAN (C-SCAN)
              </h3>
              <p>
                C-SCAN is a variant of SCAN that moves the head from one end of
                the disk to the other, servicing requests along the way. When it
                reaches the end, it immediately returns to the beginning and
                continues scanning in the same direction.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>More uniform wait times than SCAN</li>
                  <li>Better service distribution across the disk</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Can have higher seek times than SCAN if most requests are in
                    one area
                  </li>
                  <li>Wastes time during the return to the beginning</li>
                </ul>
              </div>
            </div>

            <div className="mb-6" id="look">
              <h3 className="text-xl font-semibold mb-2">LOOK Algorithm</h3>
              <p>
                LOOK is an improvement of SCAN. The head moves in one direction
                until there are no more requests in that direction, then
                reverses direction. Unlike SCAN, it doesn't go all the way to
                the end of the disk if there are no requests there.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    More efficient than SCAN by avoiding unnecessary movements
                  </li>
                  <li>Prevents starvation like SCAN</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Similar wait time distribution issues as SCAN</li>
                  <li>Slightly more complex to implement than SCAN</li>
                </ul>
              </div>
            </div>

            <div id="clook">
              <h3 className="text-xl font-semibold mb-2">
                Circular LOOK (C-LOOK)
              </h3>
              <p>
                C-LOOK is to LOOK what C-SCAN is to SCAN. It moves in one
                direction until there are no more requests, then jumps to the
                lowest/highest request and continues scanning in the same
                direction.
              </p>
              <div className="mt-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <h4 className="font-medium mb-2">Advantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>More uniform wait times than LOOK</li>
                  <li>
                    More efficient than C-SCAN by avoiding unnecessary movements
                  </li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Disadvantages:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Can have higher seek times than LOOK for clustered requests
                  </li>
                  <li>
                    Most complex of the disk scheduling algorithms to implement
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl mb-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            id="usage"
          >
            <h2 className="text-2xl font-bold mb-4">How to Use the App</h2>
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <p className="font-medium inline">
                  Select an algorithm or choose to show all algorithms:
                </p>
                <p className="mt-1 ml-6">
                  On the Disk Scheduling page, you can either select a specific
                  algorithm to visualize or check "Show All Algorithms" to
                  compare all six disk scheduling algorithms side by side.
                </p>
              </li>
              <li>
                <p className="font-medium inline">Enter your disk requests:</p>
                <p className="mt-1 ml-6">
                  Input a comma-separated list of disk request positions. For
                  example: 98, 183, 37, 122, 14, 124, 65, 67
                </p>
              </li>
              <li>
                <p className="font-medium inline">
                  Set the initial head position:
                </p>
                <p className="mt-1 ml-6">
                  Enter the starting position of the disk head. For example: 53
                </p>
              </li>
              <li>
                <p className="font-medium inline">Define the disk range:</p>
                <p className="mt-1 ml-6">
                  Specify the minimum and maximum positions on the disk in the
                  format min-max. For example: 0-199
                </p>
              </li>
              <li>
                <p className="font-medium inline">Run the algorithm:</p>
                <p className="mt-1 ml-6">
                  Click the "Run Algorithm" button to visualize the selected
                  algorithm(s). The visualization will show the movement of the
                  disk head step by step, and calculate the total seek time.
                </p>
              </li>
            </ol>
          </div>

          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            id="future"
          >
            <h2 className="text-2xl font-bold mb-4">Future Additions</h2>
            <p className="mb-4">
              We plan to add more operating system algorithm visualizations in
              the future, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <p className="font-medium inline">
                  Page Replacement Algorithms:
                </p>
                <p className="ml-6">
                  FIFO, LRU, Optimal, Clock, Second Chance, and more.
                </p>
              </li>
              <li>
                <p className="font-medium inline">CPU Scheduling Algorithms:</p>
                <p className="ml-6">
                  FCFS, SJF, Round Robin, Priority Scheduling, Multilevel Queue,
                  and more.
                </p>
              </li>
              <li>
                <p className="font-medium inline">
                  Memory Management Algorithms:
                </p>
                <p className="ml-6">
                  First Fit, Best Fit, Worst Fit, Buddy System, and more.
                </p>
              </li>
              <li>
                <p className="font-medium inline">
                  Deadlock Detection and Recovery:
                </p>
                <p className="ml-6">
                  Resource Allocation Graphs, Banker's Algorithm, and more.
                </p>
              </li>
            </ul>
            <p className="mt-4">
              Stay tuned for these exciting additions that will make this
              application an even more comprehensive learning tool for operating
              system concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
