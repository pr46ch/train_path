import { railwayStationsData } from "../public/railwaystationlist";
export default function StationList({ setcurrlocation, currlocation }) {

  // Filter list based on user input
  const filteredStations = railwayStationsData.filter(s => 
    s.Station.toLowerCase().includes(currlocation.toLowerCase())
  );

  return (
    <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {filteredStations.map((station) => (
        <li 
          key={station.Code}
          // Use onMouseDown so it fires BEFORE the input's onBlur
          onMouseDown={() => {
            setcurrlocation(station.Station);
          }}
          className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-left border-b last:border-0"
        >
          <span className="font-bold">{station.Code}</span> - {station.Station}
        </li>
      ))}
    </ul>
  );
}