export default function Paths({ paths }) {
  return (
    <div className="space-y-4">
      {paths.map((path, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex justify-between"
        >
          <div className="items-center">
            <p className="text-1xl md:text-2xl text-emerald-600"><i class="fa-solid fa-location-dot "></i>  {path.source}</p>
          <p>Departure: {path.from_time}</p>
          </div>
          <div className="w-[70px] h-[5px] bg-linear-to-b from-slate-800 to-transparent"></div>
          <div className="items-center">
          <p><i class="fa-solid fa-train"></i> Train No: {path.train}</p>
          </div>
          <div className="w-[70px] h-[5px] bg-linear-to-b from-slate-800 to-transparent"></div>
          <div className="items-center">
          <p className="text-1xl md:text-2xl text-emerald-600"><i class="fa-solid fa-location-dot "></i> {path.destination}</p>
          <p>Arrival: {path.to_time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
