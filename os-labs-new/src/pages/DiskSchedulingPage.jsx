import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";


export const DiskSchedulingPage = ({ darkMode }) =>{
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

