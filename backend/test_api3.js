import { searchTrainBetweenStations } from 'irctc-connect';
import { railwayStationsData } from './stations.js';
import { calculateDistance } from './stations.js';
import { DateTime } from "luxon";

// Helper function to convert time to minutes
function toMinutes(timeStr) {
  if (!timeStr) return Infinity;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Helper function to format time
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Improved train finding function with proper day handling
async function findNextTrain(fromStation, toStation, currentTime, currentDay) {
  try {
    const result = await searchTrainBetweenStations(fromStation, toStation);
    const trains = result.data;
    const currentTimeMins = toMinutes(currentTime);
    if (!Array.isArray(trains)) {
      console.error('Unexpected train data format:', result);
      return null;
    }
    // Find trains that run on current day and depart after current time
    const availableTrains = trains.filter((train) => {
      const runsToday = train.running_days && train.running_days[currentDay] === '1';
      const depMins = toMinutes(train.from_time);
      return runsToday && depMins >= currentTimeMins;
    });

    if (availableTrains.length === 0) {
      // Check for next day trains
      let nextDay = (currentDay + 1) % 7;
      const nextDayTrains = trains.filter((train) => {
        return train.running_days && train.running_days[nextDay] === '1';
      });

      if (nextDayTrains.length > 0) {
        // Find the earliest train next day
        const firstTrain = nextDayTrains.reduce((earliest, train) => {
          const earliestTime = toMinutes(earliest.from_time)+ toMinutes(earliest.travel_time.slice(0,5));
          const currentTime = toMinutes(train.from_time)+ toMinutes(train.travel_time.slice(0,5));
          return currentTime < earliestTime ? train : earliest;
        }, nextDayTrains[0]);
        return {
          train: firstTrain,
          dayChange: true,
          arrivalDay: (nextDay + Math.floor((toMinutes(firstTrain.from_time) + toMinutes(firstTrain.travel_time.slice(0,5))) / (24 * 60))) % 7,
          departureDay: nextDay
        };
      }
      return null;
    }

    // Get the earliest available train today
    const nextTrain = availableTrains.reduce((earliest, train) => {
      const earliestTime = toMinutes(earliest.from_time);
      const currentTime = toMinutes(train.from_time);
      return currentTime < earliestTime ? train : earliest;
    }, availableTrains[0]);

    // Calculate arrival day (handle overnight journeys)
    const totalJourneyMinutes = toMinutes(nextTrain.from_time) + toMinutes(nextTrain.travel_time.slice(0,5));
    const arrivalDay = (currentDay + Math.floor(totalJourneyMinutes / (24 * 60))) % 7;
    return {
      train: nextTrain,
      dayChange: arrivalDay !== currentDay,
      arrivalDay: arrivalDay,
      departureDay: currentDay
    };
  } catch (error) {
    console.error('Error finding train:', error);
    return null;
  }
}

// Heuristic function (estimated travel time in minutes)
function heuristic(currentStation, destinationStation, speedKmh = 50) {
  const distance = calculateDistance(
    currentStation.Latitude,
    currentStation.Longitude,
    destinationStation.Latitude,
    destinationStation.Longitude
  );
  return (distance / speedKmh) * 60;
}

// Main A* Algorithm - Fixed version
async function astar(source_code, destination_code) {
  const now = new Date();

  // Force IST using Intl
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false
  });

  const parts = formatter.formatToParts(now);

// Extract IST hour & minute
  const hour = Number(parts.find(p => p.type === "hour").value);
  const minute = Number(parts.find(p => p.type === "minute").value);

// Keep variable name: startTimeMinutes
  const startTimeMinutes = hour * 60 + minute;

// Convert weekday string → number (0 = Sunday, 6 = Saturday)
  const weekdayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
  };

// Keep variable name: startDay
  const startDay = weekdayMap[
    parts.find(p => p.type === "weekday").value
  ];
  const openSet = new Set([source_code]);
  const cameFrom = new Map();
  const trainUsed = new Map();
  
  const gScore = new Map();
  gScore.set(source_code, startTimeMinutes);
  
  const gScoreDay = new Map();
  gScoreDay.set(source_code, startDay);
  
  const fScore = new Map();
  
  const sourceStation = railwayStationsData.find(s => s.Code === source_code);
  const destStation = railwayStationsData.find(s => s.Code === destination_code);
  
  if (!sourceStation || !destStation) {
    console.log('❌ Invalid station codes');
    return null;
  }

  fScore.set(source_code, startTimeMinutes + heuristic(sourceStation, destStation));

  while (openSet.size > 0) {
    // Find station with lowest fScore
    let currentStation = null;
    let lowestFScore = Infinity;
    
    for (const stationCode of openSet) {
      const score = fScore.get(stationCode) || Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        currentStation = stationCode;
      }
    }

    if (currentStation === destination_code) {
      return reconstructPath(cameFrom, trainUsed, gScoreDay, source_code, destination_code, startDay);
    }

    openSet.delete(currentStation);

    const currentStationData = railwayStationsData.find(s => s.Code === currentStation);
    const currentAbsoluteTime = gScore.get(currentStation);
    const currentDay = gScoreDay.get(currentStation);
    const currentTimeOfDay = currentAbsoluteTime % (24 * 60);

    // Explore neighbors with better filtering
    for (const neighbor of railwayStationsData) {
      if (neighbor.Code === currentStation) continue;
      
      // Improved heuristic filtering to prevent infinite loops
      const currentToDest = heuristic(currentStationData, destStation);
      const neighborToDest = heuristic(neighbor, destStation);
      
      if (neighborToDest > currentToDest * 2) continue; // Skip stations that take us further away

      const trainResult = await findNextTrain(
        currentStation, 
        neighbor.Code, 
        formatTime(currentTimeOfDay), 
        currentDay
      );

      if (!trainResult) continue;
      const train = trainResult.train;
      const arrivalTimeMins = toMinutes(train.to_time);
      // Calculate absolute arrival time considering day changes
      const daysDifference = (trainResult.arrivalDay - startDay + 7) % 7;
      const absoluteArrivalTime = arrivalTimeMins + (daysDifference * 24 * 60);


      const currentNeighborScore = gScore.get(neighbor.Code) || Infinity;
      if (absoluteArrivalTime < currentNeighborScore) {
        cameFrom.set(neighbor.Code, currentStation);
        trainUsed.set(neighbor.Code, {
          trainNumber: train.train_no,
          trainName: train.train_name,
          departure: train.from_time,
          arrival: train.to_time,
          departureDay: trainResult.departureDay,
          arrivalDay: trainResult.arrivalDay,
          dayChange: trainResult.dayChange
        });
        gScore.set(neighbor.Code, absoluteArrivalTime);
        gScoreDay.set(neighbor.Code, trainResult.arrivalDay);
        
        const heuristicEstimate = heuristic(neighbor, destStation);
        fScore.set(neighbor.Code, absoluteArrivalTime + heuristicEstimate);
        
        openSet.add(neighbor.Code);
      }
    }
  }

  console.log('❌ No route found');
  return null;
}

// Improved path reconstruction
function reconstructPath(cameFrom, trainUsed, gScoreDay, source, destination, startDay) {
  const path = [];
  let current = destination;

  while (current !== source) {
    const fromStation = cameFrom.get(current);
    const trainInfo = trainUsed.get(current);
    
    if (!fromStation || !trainInfo) {
      console.log('❌ Path reconstruction failed');
      break;
    }

    path.unshift({
      source: fromStation,
      destination: current,
      train_name: trainInfo.trainName,
      train: trainInfo.trainNumber,
      from_time: trainInfo.departure,
      to_time: trainInfo.arrival,
      departureDay: trainInfo.departureDay,
      arrivalDay: trainInfo.arrivalDay,
      dayChange: trainInfo.dayChange
    });

    current = fromStation;
  }

  // Calculate total duration
  let totalDuration = 0;
  if (path.length > 0) {
    const firstDeparture = toMinutes(path[0].departure);
    const lastArrival = toMinutes(path[path.length - 1].arrival);
    const firstDepartureDay = path[0].departureDay;
    const lastArrivalDay = path[path.length - 1].arrivalDay;
    
    // Calculate total minutes including days
    const dayDifference = (lastArrivalDay - firstDepartureDay + 7) % 7;
    totalDuration = lastArrival - firstDeparture + (dayDifference * 24 * 60);
    
    if (totalDuration < 0) {
      totalDuration += 24 * 60;
    }
  }

  return {
    path: path,
    totalDuration: totalDuration,
    segments: path.length,
    journeyDays: Math.ceil(totalDuration / (24 * 60))
  };
}

// Get day name from index
function getDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

// Usage example with proper async handling
async function findRoute(fromStation, toStation) {
  console.log(`🚂 Finding route from ${fromStation} to ${toStation}...`);
  
  try {
    const route = await astar(fromStation, toStation);
    return route;
  } catch (error) {
    console.error('Error finding route:', error);
    return null;
  }
}

export default findRoute;
