import { useState } from "react"; // Import useEffect

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

export const DiskSchedulingPage = ({ darkMode }) => {
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

    setIsAnimating(false); // Ensure animating state is reset
  };

  // Modified startAnimation: Accepts maxSteps as an argument

  const startAnimation = (maxSteps) => {
    stopAnimation(); // Clear any existing animation first
    // Check if there are steps to animate
    if (maxSteps <= 0) {
      setIsAnimating(false); // No animation needed if no steps
      return;
    }

    setIsAnimating(true);
    setAnimationStep(0); // Ensure animation starts from step 0

    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        const newStep = prev + 1;
        // Stop condition uses maxSteps argument
        if (newStep >= maxSteps) {
          clearInterval(interval);
          setIsAnimating(false); // Set animating to false when done
          setAnimationInterval(null); // Clear interval ID from state
          return maxSteps; // Ensure the final step is rendered
        }
        return newStep;
      });
    }, 250); // **Reduced interval for smoother feel (e.g., 250ms)**
    setAnimationInterval(interval);
  };

  // Modified replayAnimation: Calculates maxSteps from current results
  const replayAnimation = () => {
    stopAnimation(); // Stop current animation first

    if (!results || Object.keys(results).length === 0) {
      console.error("Cannot replay: No results available.");

      return;
    }

    // Get maxSteps from the *current* results state
    const firstResultKey = Object.keys(results)[0];
    const maxSteps = results[firstResultKey]?.seekSequence?.length || 0;

    // Reset step count *before* starting animation
    setAnimationStep(0);

    // Use setTimeout to ensure state reset (setAnimationStep(0)) is processed
    // before starting the new animation interval.
    setTimeout(() => {
      startAnimation(maxSteps); // Pass calculated maxSteps
    }, 50); // Small delay
  };

  // Modified runAlgorithm: Calculates maxSteps immediately and passes it
  const runAlgorithm = () => {
    stopAnimation(); // Stop any previous animation
    const requests = parseRequests();
    const head = getHeadPosition();
    const range = getDiskRange();

    if (requests.length === 0 || isNaN(head)) {
      alert("Please enter valid disk requests and initial head position");
      return;
    }

    let algorithmResults = {};

    // --- Algorithm selection logic remains the same ---

    if (showAllAlgorithms) {
      algorithmResults = {
        fcfs: calculateFCFS(requests, head),
        sstf: calculateSSTF(requests, head),
        scan: calculateSCAN(requests, head, range, "up"), // Assuming 'up' as default for now
        cscan: calculateCSCAN(requests, head, range),
        look: calculateLOOK(requests, head, "up"), // Assuming 'up' as default for now
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
            scan: calculateSCAN(requests, head, range, "up"), // Add direction logic if needed
          };
          break;

        case "cscan":
          algorithmResults = { cscan: calculateCSCAN(requests, head, range) };
          break;

        case "look":
          algorithmResults = { look: calculateLOOK(requests, head, "up") }; // Add direction logic if needed
          break;

        case "clook":
          algorithmResults = { clook: calculateCLOOK(requests, head) };
          break;

        default:
          break;
      }
    } else {
      alert("Please select an algorithm or check 'Show All Algorithms'");

      return;
    }

    // --- End of algorithm selection ---

    // Reset animation state *before* setting results
    setAnimationStep(0);
    setResults(algorithmResults); // Update the results state

    // Calculate maxSteps *immediately* after getting results

    const firstResultKey = Object.keys(algorithmResults)[0];

    const maxSteps = firstResultKey
      ? algorithmResults[firstResultKey]?.seekSequence?.length || 0
      : 0;

    // Start animation after a small delay to allow React to process state updates

    // Pass the calculated maxSteps directly

    setTimeout(() => {
      startAnimation(maxSteps);
    }, 50); // Small delay (can be adjusted)
  };

  // --- Algorithm calculation functions (calculateFCFS, calculateSSTF, etc.) remain the same ---

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

  // SCAN, C-SCAN, LOOK, C-LOOK implementations remain the same

  const calculateSCAN = (requests, head, range, direction = "up") => {
    // Default direction

    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests, head].sort((a, b) => a - b); // Include head for easier splitting
    const headIndex = sortedRequests.indexOf(head);
    const requestsLessThanHead = sortedRequests.slice(0, headIndex);
    const requestsGreaterThanHead = sortedRequests.slice(headIndex + 1);

    if (direction === "up") {
      // Go up

      requestsGreaterThanHead.forEach((req) => {
        seekSequence.push(req);
        totalSeekTime += Math.abs(req - currentPosition);
        currentPosition = req;
      });

      // Hit the end if necessary

      if (
        requestsGreaterThanHead.length > 0 ||
        requests.length === 0 ||
        head < range.max
      ) {
        // Go to max only if moving up or if no requests > head

        if (currentPosition !== range.max) {
          totalSeekTime += Math.abs(range.max - currentPosition);

          seekSequence.push(range.max);

          currentPosition = range.max;
        }
      }

      // Go down

      requestsLessThanHead.reverse().forEach((req) => {
        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      });
    } else {
      //direction === "down"

      // Go down

      requestsLessThanHead.reverse().forEach((req) => {
        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      });

      // Hit the beginning if necessary

      if (
        requestsLessThanHead.length > 0 ||
        requests.length === 0 ||
        head > range.min
      ) {
        // Go to min only if moving down or if no requests < head

        if (currentPosition !== range.min) {
          totalSeekTime += Math.abs(range.min - currentPosition);

          seekSequence.push(range.min);

          currentPosition = range.min;
        }
      }

      // Go up

      requestsGreaterThanHead.forEach((req) => {
        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      });
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateCSCAN = (requests, head, range) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
  
    // Step 1: Sort the requests along with the head position
    const sortedRequests = [...requests, head].sort((a, b) => a - b);
    const headIndex = sortedRequests.indexOf(head);
  
    // Step 2: Move right (toward higher numbers)
    for (let i = headIndex + 1; i < sortedRequests.length; i++) {
      const req = sortedRequests[i];
      totalSeekTime += Math.abs(req - currentPosition);
      currentPosition = req;
      seekSequence.push(req);
    }
  
    // Step 3: Go to end of disk (max)
    if (currentPosition !== range.max) {
      totalSeekTime += Math.abs(range.max - currentPosition);
      currentPosition = range.max;
      seekSequence.push(range.max);
    }
  
    // Step 4: Jump to start of disk (min)
    totalSeekTime += Math.abs(range.max - range.min); // circular move
    currentPosition = range.min;
    seekSequence.push(range.min);
  
    // Step 5: Move right again, from start up to the original head
    for (let i = 0; i < headIndex; i++) {
      const req = sortedRequests[i];
      totalSeekTime += Math.abs(req - currentPosition);
      currentPosition = req;
      seekSequence.push(req);
    }
  
    // Step 6: Final seek sequence should include only actual requests
    const finalSeekSequence = seekSequence.filter(
      (pos) => requests.includes(pos)
    );
  
    // Recalculate seek time for accuracy (based on only actual requests)
    let finalTotalSeekTime = 0;
    let finalCurrentPos = head;
  
    finalSeekSequence.forEach((req) => {
      finalTotalSeekTime += Math.abs(req - finalCurrentPos);
      finalCurrentPos = req;
    });
  
    return {
      seekSequence: finalSeekSequence,
      totalSeekTime: finalTotalSeekTime,
    };
  };
  
  const calculateLOOK = (requests, head, direction = "up") => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);
    const requestsLessThanHead = sortedRequests.filter((req) => req < head);
    const requestsGreaterThanHead = sortedRequests.filter((req) => req >= head); // Include requests AT head position

    if (direction === "up") {
      // Go up to the largest request

      requestsGreaterThanHead.forEach((req) => {
        if (req !== head) {
          // Don't add head itself if it's in the list

          seekSequence.push(req);

          totalSeekTime += Math.abs(req - currentPosition);

          currentPosition = req;
        }
      });

      // Go down to the smallest request (from right to left)

      requestsLessThanHead.reverse().forEach((req) => {
        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      });
    } else {
      // direction === "down"

      // Go down to the smallest request

      requestsLessThanHead.reverse().forEach((req) => {
        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      });

      // Go up to the largest request

      requestsGreaterThanHead.forEach((req) => {
        if (req !== head) {
          seekSequence.push(req);

          totalSeekTime += Math.abs(req - currentPosition);

          currentPosition = req;
        }
      });
    }

    return { seekSequence, totalSeekTime };
  };

  const calculateCLOOK = (requests, head) => {
    const seekSequence = [];

    let totalSeekTime = 0;

    let currentPosition = head;

    const sortedRequests = [...requests].sort((a, b) => a - b);

    const requestsLessThanHead = sortedRequests.filter((req) => req < head);

    const requestsGreaterThanHead = sortedRequests.filter((req) => req >= head); // Include requests AT head position

    // Go up (right) to the largest request

    requestsGreaterThanHead.forEach((req) => {
      if (req !== head) {
        // Don't add head itself

        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
      }
    });

    // Jump to the smallest request overall if there are requests less than the head

    if (requestsLessThanHead.length > 0) {
      const smallestRequest = requestsLessThanHead[0]; // Smallest is the first in sorted list

      // Add seek time for the jump ONLY if we moved right first

      if (
        requestsGreaterThanHead.length > 0 &&
        requestsGreaterThanHead.filter((r) => r !== head).length > 0
      ) {
        totalSeekTime += Math.abs(currentPosition - smallestRequest);
      } else {
        // If we didn't move right, the first move is just to the smallest

        totalSeekTime += Math.abs(smallestRequest - currentPosition); // Or head if currentPosition didn't change
      }

      currentPosition = smallestRequest;

      seekSequence.push(smallestRequest); // Add the smallest request to sequence

      // Continue right (up) from the smallest request up to the requests before the original head

      for (let i = 1; i < requestsLessThanHead.length; i++) {
        // Start from index 1

        const req = requestsLessThanHead[i];

        seekSequence.push(req);

        totalSeekTime += Math.abs(req - currentPosition);

        currentPosition = req;
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
        "SCAN moves the disk arm in one direction (e.g., towards the highest cylinder), serving all requests in that path. Once it hits the end, it reverses direction, serving requests on the way back.",
    },

    cscan: {
      name: "Circular SCAN (C-SCAN)",
      description:
        "C-SCAN moves the disk arm in one direction only (e.g., towards the highest cylinder), serving requests. When it hits the end, it immediately returns to the beginning of the disk without serving requests on the return trip, then starts scanning towards the high end again. This provides more uniform wait times compared to SCAN.",
    },

    look: {
      name: "LOOK Algorithm",
      description:
        "LOOK is similar to SCAN, but the disk arm only travels as far as the last request in each direction. It reverses direction immediately after servicing the final request in that direction, without going all the way to the end of the disk.",
    },

    clook: {
      name: "Circular LOOK (C-LOOK)",
      description:
        "C-LOOK is similar to C-SCAN, but like LOOK, the arm only travels as far as the last request in its current direction. After servicing the last request towards the high end, it jumps directly to the lowest pending request (without going to cylinder 0) and starts scanning towards the high end again.",
    },
  };

  // --- JSX Structure remains largely the same ---

  // Use the modified functions and state logic within the return() block.

  // Remember to update the YAxis ticks logic if needed for clarity,

  // although the provided logic should adapt.

  return (
    <div
      className={`p-6 h-full overflow-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
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

      {/* Input Form */}

      <div
        className={`p-6 rounded-xl mb-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <div className="mb-6">
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Select Algorithm & Inputs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

                <span
                  className={`ml-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Compare All Algorithms
                </span>
              </label>
            </div>

            {!showAllAlgorithms && (
              <div className="md:col-span-2">
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
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
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              className={`block mb-2 font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Disk Requests (comma separated)
            </label>

            <input
              type="text"
              value={diskRequests}
              onChange={(e) => setDiskRequests(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
              placeholder="e.g., 98, 183, 37, 122, 14, 124, 65, 67"
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Initial Head Position
            </label>

            <input
              type="text"
              value={initialHead}
              onChange={(e) => setInitialHead(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
              placeholder="e.g., 53"
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Disk Range (min-max)
            </label>

            <input
              type="text"
              value={diskRange}
              onChange={(e) => setDiskRange(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
              placeholder="e.g., 0-199"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={runAlgorithm}
            disabled={isAnimating}
            className={`px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out ${
              isAnimating
                ? "bg-gray-400 cursor-not-allowed text-gray-800"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isAnimating
              ? "Animating..."
              : results
              ? "Run Again"
              : "Run Algorithm"}
          </button>
        </div>
      </div>

      {/* Algorithm Explanation Placeholder (before running) */}

      {(algorithm || showAllAlgorithms) && !results && (
        <div
          className={`p-6 rounded-xl mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {showAllAlgorithms
              ? "Comparing All Algorithms"
              : algorithmDetails[algorithm]?.name || "Algorithm Details"}
          </h2>

          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {showAllAlgorithms
              ? "Click 'Run Algorithm' to calculate and visualize results for FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK using the provided inputs."
              : algorithmDetails[algorithm]?.description ||
                "Select an algorithm and provide inputs, then click 'Run Algorithm'."}
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
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Results
          </h2>

          <div className="grid grid-cols-1 gap-10">
            {Object.entries(results).map(([key, data]) => {
              if (!data || !data.seekSequence) {
                console.warn(`No data or seekSequence for algorithm: ${key}`);
                return <div key={key}>Error loading data for {key}.</div>;
              }

              const headPos = getHeadPosition();
              const chartData = getChartData(data.seekSequence, headPos);
              const currentMaxStep = Math.min(
                animationStep,
                chartData.length - 1
              );
              const displayedData = chartData.slice(0, currentMaxStep + 1);
              const range = getDiskRange();

              // Calculate current seek distance
              let currentSeekDistance = 0;
              if (displayedData.length > 1) {
                for (let i = 1; i < displayedData.length; i++) {
                  currentSeekDistance += Math.abs(
                    displayedData[i].value - displayedData[i - 1].value
                  );
                }
              }

              const isAnimationComplete =
                !isAnimating && animationStep >= data.seekSequence.length;

              return (
                <div
                  key={key}
                  className="mb-8 border-t pt-6 border-gray-300 dark:border-gray-700 first:border-t-0 first:pt-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {algorithmDetails[key]?.name}
                    </h3>
                    <button
                      onClick={replayAnimation}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white font-medium transition duration-150 ease-in-out`}
                    >
                      Replay Animation
                    </button>
                  </div>

                  <p
                    className={`mb-4 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {algorithmDetails[key]?.description}
                  </p>

                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } overflow-x-auto`}
                  >
                    <LineChart
                      width={800}
                      height={350}
                      data={displayedData}
                      margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#555" : "#ccc"}
                      />

                      <XAxis
                        dataKey="name"
                        interval={0}
                        tickFormatter={(value, index) => {
                          if (index === 0) return `Initial (${headPos})`;
                          const position = chartData[index]?.position;
                          return `Step ${index} (${position})`;
                        }}
                        tick={{
                          fill: darkMode ? "#e5e7eb" : "#4b5563",
                          fontSize: 10,
                        }}
                        label={{
                          value: "Request Sequence",
                          position: "insideBottom",
                          offset: -15,
                          fill: darkMode ? "#aaa" : "#666",
                        }}
                        padding={{ left: 10, right: 10 }}
                      />

                      <YAxis
                        domain={[range.min, range.max]}
                        ticks={[
                          range.min,
                          0,
                          headPos,
                          ...parseRequests(),
                          range.max,
                        ]
                          .filter((v, i, a) => !isNaN(v) && a.indexOf(v) === i)
                          .sort((a, b) => a - b)}
                        tick={{
                          fill: darkMode ? "#e5e7eb" : "#4b5563",
                          fontSize: 12,
                        }}
                        allowDecimals={false}
                        label={{
                          value: "Cylinder Position",
                          angle: -90,
                          position: "insideLeft",
                          fill: darkMode ? "#aaa" : "#666",
                        }}
                      />

                      <Tooltip
                        formatter={(value, name, props) => [
                          `Position: ${value}`,
                          `(Step ${props.payload.name.split(" ")[1] || 0})`,
                        ]}
                        labelFormatter={(_label) => ""}
                        contentStyle={{
                          backgroundColor: darkMode
                            ? "rgba(31, 41, 55, 0.9)"
                            : "rgba(249, 250, 251, 0.9)",
                          borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                        }}
                        itemStyle={{ color: darkMode ? "#ddd" : "#333" }}
                        cursor={{
                          stroke: darkMode
                            ? "rgba(0, 150, 255, 0.5)"
                            : "rgba(100, 100, 255, 0.5)",
                          strokeWidth: 1,
                          strokeDasharray: "3 3",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={darkMode ? "#60a5fa" : "#3b82f6"}
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: darkMode ? "#60a5fa" : "#3b82f6",
                          stroke: darkMode ? "#1f2937" : "#fff",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 7,
                          fill: darkMode ? "#ef4444" : "#dc2626",
                          stroke: darkMode ? "#1f2937" : "#fff",
                          strokeWidth: 2,
                        }}
                        isAnimationActive={false}
                        connectNulls={false}
                      />

                      {isAnimating && displayedData.length > 1 && (
                        <ReferenceLine
                          segment={[
                            {
                              x: displayedData[displayedData.length - 1].name,
                              y: range.min,
                            },
                            {
                              x: displayedData[displayedData.length - 1].name,
                              y: range.max,
                            },
                          ]}
                          stroke="rgba(255, 0, 0, 0.5)"
                          strokeDasharray="3 3"
                        />
                      )}
                    </LineChart>
                  </div>

                  {/* Results Text */}
                  <div className="mt-5 text-sm">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                      <span
                        className={`font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Seek Sequence:
                      </span>
                      <span
                        className={`font-mono break-all ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {headPos} →{" "}
                        {data.seekSequence.slice(0, currentMaxStep).join(" → ")}
                        {isAnimating &&
                        currentMaxStep < data.seekSequence.length
                          ? " ..."
                          : ""}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span
                        className={`font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {isAnimationComplete || !isAnimating
                          ? "Total Seek Distance:"
                          : "Current Seek Distance:"}
                      </span>
                      <span
                        className={`font-mono font-semibold ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {isAnimationComplete
                          ? data.totalSeekTime
                          : currentSeekDistance}
                        {isAnimating && animationStep < data.seekSequence.length
                          ? " (Calculating...)"
                          : ""}
                      </span>
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
};

export default DiskSchedulingPage;
