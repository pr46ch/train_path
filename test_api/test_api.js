import { searchTrainBetweenStations } from 'irctc-connect'; // hypothetical example

async function main() {
  const result = await searchTrainBetweenStations('ST', 'JP');
  console.log(result.success);

  if (result.success && Array.isArray(result.data)) {
    console.log(`🔍 Trains from ${result.data[0].from_stn_name} to ${result.data[0].to_stn_name}:`);
    
    result.data.forEach(train => {
      console.log(`🚂 ${train.train_name} (${train.train_no})`);
      console.log(`   ⏰ Departure: ${train.from_time} | Arrival: ${train.to_time}`);
      console.log(`   ⏱️ Duration: ${train.travel_time}`);
      console.log(`   📅 Days: ${train.running_days}`);
      console.log(`   📏 Distance: ${train.distance} km`);
      console.log(`   🛑 Halts: ${train.halts}`);
      console.log('   ---');
    });
  } else {
    console.log('❌ No train data available');
  }
}

main();



/*import { calculateDistanceBetweenStations, rajasthanStations } from './stations.js';

const jaipurStation = rajasthanStations.find(station => station.code === 'JP');

console.log(jaipurStation);

// Output: { name: "Jaipur Junction", code: "JP", latitude: 26.92, longitude: 75.79 }

function getTrainsFromStation(scheduleArray, sourceStationCode) {
  // Use the filter method to return a new array
  const tr= scheduleArray.filter(train => {
    // For each train object, check if its 'from' property
    // matches the given sourceStationCode.
    return train.from === sourceStationCode;
  });
}

class Node {
  constructor(parent, position) {
    this.parent = parent;
    this.position = position; // [row, col]
    this.g = 0; // distance from start
    this.h = 0; // heuristic distance to goal
    this.f = 0; // total cost
  }
}



function astar(grid, start, end) {
  // Create start and end node
  const startNode = new Node(null, start);
  const endNode = new Node(null, end);

  // Initialize open and closed lists
  let openList = [];
  let closedList = [];

  openList.push(startNode);

  // Movement directions (8-directional)
  //const directions = [
  //  [-1, 0], [1, 0], [0, -1], [0, 1], // up, down, left, right
  //  [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonals
  //];

  // Loop until goal found
  while (openList.length > 0) {
    // Sort open list by lowest f value
    openList.sort((a, b) => a.f - b.f);

    // Take node with lowest f
    const currentNode = openList.shift();
    closedList.push(currentNode);

    // If reached the goal
    if (
      currentNode.position === endNode.position
    ) {
      // Reconstruct path
      let path = [];
      let current = currentNode;
      while (current) {
        path.push(current.position);
        current = current.parent;
      }
      return path.reverse();
    }

    // Generate neighbors
    const neigh=getTrainsFromStation
    
    for (let n of neigh) {
      const newRow = currentNode.position[0] + dir[0];
      const newCol = currentNode.position[1] + dir[1];

      // Skip invalid or blocked cells
      if (
        newRow < 0 || newRow >= grid.length ||
        newCol < 0 || newCol >= grid[0].length ||
        grid[newRow][newCol] === 1
      )
        continue;

      const neighbor = new Node(currentNode, [newRow, newCol]);

      // If already visited, skip
      if (closedList.some(n => n.position[0] === neighbor.position[0] && n.position[1] === neighbor.position[1]))
        continue;

      // Compute costs
      neighbor.g = currentNode.g + 1;
      neighbor.h = Math.abs(neighbor.position[0] - endNode.position[0]) + Math.abs(neighbor.position[1] - endNode.position[1]); // Manhattan
      neighbor.f = neighbor.g + neighbor.h;

      // If a better path already exists, skip
      if (openList.some(n =>
        n.position[0] === neighbor.position[0] &&
        n.position[1] === neighbor.position[1] &&
        neighbor.g >= n.g
      ))
        continue;

      openList.push(neighbor);
    }
  }

  return []; // No path found
}*/
