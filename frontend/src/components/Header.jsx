export default function Header(props){
    return (
      <header className="w-full border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="brand text-3xl text-emerald-600">TrackRoute</div>
            <span className="text-sm text-slate-600">Find the perfect train — fast</span>
          </div>
          <button id="demoBtn" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700 hover:scale-[1.03] transition-all">
            <i className="fa-brands fa-github"></i> Demo
          </button>
        </div>
      </header>
    )
}