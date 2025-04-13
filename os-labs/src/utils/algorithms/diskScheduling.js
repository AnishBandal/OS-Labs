export const fcfs = (requests, initialPosition) => {
    let headMovement = 0;
    const sequence = [initialPosition];
    let currentPosition = initialPosition;
    
    requests.forEach(request => {
      headMovement += Math.abs(currentPosition - request);
      currentPosition = request;
      sequence.push(currentPosition);
    });
    
    return { sequence, totalSeekTime: headMovement };
  };
  
  export const sstf = (requests, initialPosition) => {
    let headMovement = 0;
    const sequence = [initialPosition];
    let currentPosition = initialPosition;
    let remainingRequests = [...requests];
    
    while (remainingRequests.length > 0) {
      let closestIndex = 0;
      let minDistance = Math.abs(currentPosition - remainingRequests[0]);
      
      for (let i = 1; i < remainingRequests.length; i++) {
        const distance = Math.abs(currentPosition - remainingRequests[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      headMovement += minDistance;
      currentPosition = remainingRequests[closestIndex];
      sequence.push(currentPosition);
      remainingRequests.splice(closestIndex, 1);
    }
    
    return { sequence, totalSeekTime: headMovement };
  };
  
  export const scan = (requests, initialPosition, direction = 'right', diskSize = 200) => {
    let headMovement = 0;
    const sequence = [initialPosition];
    let currentPosition = initialPosition;
    const sortedRequests = [...requests].sort((a, b) => a - b);
  
    if (direction === 'right') {
      // Requests to the right
      const rightRequests = sortedRequests.filter(req => req >= currentPosition);
      for (const req of rightRequests) {
        headMovement += Math.abs(currentPosition - req);
        currentPosition = req;
        sequence.push(currentPosition);
      }
      // Go to end if needed
      if (currentPosition !== diskSize - 1) {
        headMovement += Math.abs(currentPosition - (diskSize - 1));
        currentPosition = diskSize - 1;
        sequence.push(currentPosition);
      }
      // Requests to the left
      const leftRequests = sortedRequests.filter(req => req < initialPosition).reverse();
      for (const req of leftRequests) {
        headMovement += Math.abs(currentPosition - req);
        currentPosition = req;
        sequence.push(currentPosition);
      }
    } else {
      // Left direction (mirror of above)
      const leftRequests = sortedRequests.filter(req => req <= currentPosition).reverse();
      for (const req of leftRequests) {
        headMovement += Math.abs(currentPosition - req);
        currentPosition = req;
        sequence.push(currentPosition);
      }
      // Go to start if needed
      if (currentPosition !== 0) {
        headMovement += Math.abs(currentPosition - 0);
        currentPosition = 0;
        sequence.push(currentPosition);
      }
      // Requests to the right
      const rightRequests = sortedRequests.filter(req => req > initialPosition);
      for (const req of rightRequests) {
        headMovement += Math.abs(currentPosition - req);
        currentPosition = req;
        sequence.push(currentPosition);
      }
    }
  
    return { sequence, totalSeekTime: headMovement };
  };
  
  // Similar implementations for LOOK, C-SCAN, C-LOOK would go here