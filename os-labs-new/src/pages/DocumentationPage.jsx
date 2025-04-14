export const DocumentationPage = ({ darkMode }) => {
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
  