  // --- Algorithm calculation functions (calculateFCFS, calculateSSTF, etc.) remain the same ---
 export const calculateFCFS = (requests, head) => {
    const seekSequence = [...requests];
    let totalSeekTime = 0;
    let currentPosition = head;
    for (const request of seekSequence) {
      totalSeekTime += Math.abs(request - currentPosition);
      currentPosition = request;
    }
    return { seekSequence, totalSeekTime };
  };

 export const calculateSSTF = (requests, head) => {
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
  export  const calculateSCAN = (requests, head, range, direction = "up") => { // Default direction
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests, head].sort((a, b) => a - b); // Include head for easier splitting
    const headIndex = sortedRequests.indexOf(head);

    const requestsLessThanHead = sortedRequests.slice(0, headIndex);
    const requestsGreaterThanHead = sortedRequests.slice(headIndex + 1);

    if (direction === "up") {
      // Go up
      requestsGreaterThanHead.forEach(req => {
        seekSequence.push(req);
        totalSeekTime += Math.abs(req - currentPosition);
        currentPosition = req;
      });
      // Hit the end if necessary
      if (requestsGreaterThanHead.length > 0 || requests.length === 0 || head < range.max) { // Go to max only if moving up or if no requests > head
          if(currentPosition !== range.max) {
              totalSeekTime += Math.abs(range.max - currentPosition);
              seekSequence.push(range.max);
              currentPosition = range.max;
          }
      }
      // Go down
      requestsLessThanHead.reverse().forEach(req => {
          seekSequence.push(req);
          totalSeekTime += Math.abs(req - currentPosition);
          currentPosition = req;
      });

    } else { // direction === "down"
      // Go down
      requestsLessThanHead.reverse().forEach(req => {
          seekSequence.push(req);
          totalSeekTime += Math.abs(req - currentPosition);
          currentPosition = req;
      });
       // Hit the beginning if necessary
       if (requestsLessThanHead.length > 0 || requests.length === 0 || head > range.min) { // Go to min only if moving down or if no requests < head
         if(currentPosition !== range.min) {
              totalSeekTime += Math.abs(range.min - currentPosition);
              seekSequence.push(range.min);
              currentPosition = range.min;
         }
      }
      // Go up
      requestsGreaterThanHead.forEach(req => {
        seekSequence.push(req);
        totalSeekTime += Math.abs(req - currentPosition);
        currentPosition = req;
      });
    }
    return { seekSequence, totalSeekTime };
};


export const calculateCSCAN = (requests, head, range) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests, head, range.min, range.max].sort((a, b) => a - b); // Include bounds and head
    const uniqueSortedRequests = [...new Set(sortedRequests)]; // Remove duplicates
    const headIndex = uniqueSortedRequests.indexOf(head);

    // Go right (up) from head to max
    for (let i = headIndex + 1; i < uniqueSortedRequests.length; i++) {
        const req = uniqueSortedRequests[i];
        if (requests.includes(req) || req === range.max) { // Service requests or hit the end
             if(seekSequence.length === 0 || seekSequence[seekSequence.length-1] !== req) { // Avoid duplicates if already at boundary
                 totalSeekTime += Math.abs(req - currentPosition);
                 currentPosition = req;
                 if (req !== head) seekSequence.push(req); // Don't add head to sequence start
             }
        }
    }

     // If not already at max, add movement to max
    if (currentPosition !== range.max) {
         totalSeekTime += Math.abs(range.max - currentPosition);
         currentPosition = range.max;
          if(seekSequence.length === 0 || seekSequence[seekSequence.length -1] !== range.max) {
             if (range.max !== head) seekSequence.push(range.max);
          }
    }


    // Jump to min if there are requests before head or if starting below min
    if (uniqueSortedRequests.slice(0, headIndex).some(r => requests.includes(r)) || head > range.min) {
         if (currentPosition !== range.min) { // Only add travel if not already there
            totalSeekTime += Math.abs(range.max - range.min); // Full sweep cost
            currentPosition = range.min;
             if(seekSequence.length === 0 || seekSequence[seekSequence.length -1] !== range.min) {
                if (range.min !== head) seekSequence.push(range.min); // Add boundary if not initial head
            }
         }

        // Go right (up) from min up to the original head position
        for (let i = uniqueSortedRequests.indexOf(range.min) + 1; i < headIndex; i++) {
             const req = uniqueSortedRequests[i];
             if (requests.includes(req)) {
                 totalSeekTime += Math.abs(req - currentPosition);
                 currentPosition = req;
                 seekSequence.push(req);
             }
         }
    }


    // Filter out the intermediate boundary points (min/max) if they weren't actual requests
    const finalSeekSequence = seekSequence.filter(pos => requests.includes(pos) || pos === range.min || pos === range.max);


    // Recalculate total seek time based *only* on the final sequence to be accurate
    let finalTotalSeekTime = 0;
    let finalCurrentPos = head;
    finalSeekSequence.forEach(req => {
        finalTotalSeekTime += Math.abs(req - finalCurrentPos);
        finalCurrentPos = req;
    });


    return { seekSequence: finalSeekSequence, totalSeekTime: finalTotalSeekTime };
};


export const calculateLOOK = (requests, head, direction = "up") => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    const requestsLessThanHead = sortedRequests.filter(req => req < head);
    const requestsGreaterThanHead = sortedRequests.filter(req => req >= head); // Include requests AT head position

    if (direction === "up") {
      // Go up to the largest request
      requestsGreaterThanHead.forEach(req => {
         if (req !== head) { // Don't add head itself if it's in the list
            seekSequence.push(req);
            totalSeekTime += Math.abs(req - currentPosition);
            currentPosition = req;
          }
      });

      // Go down to the smallest request (from right to left)
      requestsLessThanHead.reverse().forEach(req => {
          seekSequence.push(req);
          totalSeekTime += Math.abs(req - currentPosition);
          currentPosition = req;
      });
    } else { // direction === "down"
       // Go down to the smallest request
       requestsLessThanHead.reverse().forEach(req => {
          seekSequence.push(req);
          totalSeekTime += Math.abs(req - currentPosition);
          currentPosition = req;
      });

       // Go up to the largest request
       requestsGreaterThanHead.forEach(req => {
         if (req !== head) {
            seekSequence.push(req);
            totalSeekTime += Math.abs(req - currentPosition);
            currentPosition = req;
          }
      });
    }

    return { seekSequence, totalSeekTime };
};

export const calculateCLOOK = (requests, head) => {
    const seekSequence = [];
    let totalSeekTime = 0;
    let currentPosition = head;
    const sortedRequests = [...requests].sort((a, b) => a - b);

    const requestsLessThanHead = sortedRequests.filter(req => req < head);
    const requestsGreaterThanHead = sortedRequests.filter(req => req >= head); // Include requests AT head position

    // Go up (right) to the largest request
    requestsGreaterThanHead.forEach(req => {
        if (req !== head) { // Don't add head itself
            seekSequence.push(req);
            totalSeekTime += Math.abs(req - currentPosition);
            currentPosition = req;
        }
    });

    // Jump to the smallest request overall if there are requests less than the head
    if (requestsLessThanHead.length > 0) {
        const smallestRequest = requestsLessThanHead[0]; // Smallest is the first in sorted list
        // Add seek time for the jump ONLY if we moved right first
         if (requestsGreaterThanHead.length > 0 && requestsGreaterThanHead.filter(r => r !== head).length > 0) {
             totalSeekTime += Math.abs(currentPosition - smallestRequest);
         } else {
             // If we didn't move right, the first move is just to the smallest
              totalSeekTime += Math.abs(smallestRequest - currentPosition); // Or head if currentPosition didn't change
         }
        currentPosition = smallestRequest;
        seekSequence.push(smallestRequest); // Add the smallest request to sequence

        // Continue right (up) from the smallest request up to the requests before the original head
        for (let i = 1; i < requestsLessThanHead.length; i++) { // Start from index 1
            const req = requestsLessThanHead[i];
            seekSequence.push(req);
            totalSeekTime += Math.abs(req - currentPosition);
            currentPosition = req;
        }
    }

    return { seekSequence, totalSeekTime };
};
