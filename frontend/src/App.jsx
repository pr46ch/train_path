import { Link } from "react-router-dom";
import Header from "./components/Header"
import Hero from "./components/Hero";
const header=<Header/>;
const hero=<Hero/>;
function App(props) {
  return (
    <>
      {header}
      <main className="flex-1 items-center">
        <section className="max-w-[1000px] mx-auto px-6 pt-30 text-center min-h-screen gap-2.5">
          {hero}

          <div className="mt-8 grid sm:grid-cols-2 gap-6 text-left max-w-[700px] mx-auto">
            <Link to="/form"  className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" >
              <h3 className="font-semibold text-slate-900 text-lg">Try out now</h3>
            </Link>
            <a href=""  className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" >
              <h3 className="font-semibold text-slate-900 text-lg">see source code</h3>
            </a>
          </div>

          <div className="flex flex-col items-center mt-10">
            <p className="text-[10px] text-gray-500 tracking-wider uppercase mb-2">Scroll for more</p>
            <div className="w-[2px] h-[70px] bg-gradient-to-b from-slate-400 to-transparent"></div>
          </div>
        </section>

        <section className="max-w-[1000px] mx-auto px-6 py-16">
          <div className="mt-8 grid sm:grid-cols-3 gap-6 text-left  mx-auto">
            <div className="items-start gap-3 border border-solid border-slate-800 p-4 rounded-lg duration-200 flex flex-col">
              <i className="fa-solid fa-bolt text-emerald-600 bg-slate-50 text-xl border border-solid rounded-lg px-4 py-2 -mt-8"></i>
              <div>
                <h3 className="font-semibold text-slate-800">Fast suggestions</h3>
                <p className="text-sm text-slate-600">Mocked data for instant results — perfect for testing the UI.</p>
              </div>
            </div>
            <div className="items-start gap-3 border border-solid border-slate-800 p-4 rounded-lg duration-200 flex flex-col">
              <i className="fa-solid fa-mobile-screen-button text-emerald-600 bg-slate-50 text-xl border border-solid rounded-lg px-4 py-2 -mt-8"></i>
              <div>
                <h3 className="font-semibold text-slate-800">Mobile-friendly</h3>
                <p className="text-sm text-slate-600">Fully responsive interface that adapts beautifully to all screen sizes.</p>
              </div>
            </div>
            <div className="items-start gap-3 border border-solid border-slate-800 p-4 rounded-lg duration-200 flex flex-col">
              <i className="fa-solid fa-info text-emerald-600 bg-slate-50 text-xl border border-solid rounded-lg px-4 py-2 -mt-8"></i>
              <div>
                <h3 className="font-semibold text-slate-800">Detailed info</h3>
                <p className="text-sm text-slate-600">Get detailed info of route including departure time,arival time,stations</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 bg-gradient-to-r from-white via-emerald-50 to-white">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-semibold text-slate-800">💬 Found an issue or idea?</h2>
              <p className="text-sm text-slate-600">Contribute or report bugs on GitHub — help improve TrackRoute.</p>
            </div>

            <button id="exportBtn"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 hover:scale-[1.03] transition-all duration-200">
              <i className="fa-brands fa-github"></i> Visit GitHub
            </button>
          </div>

          <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500">
            © <strong className="brand text-emerald-600">TrackRoute</strong> — Built with Tailwind, React & ❤️
          </div>
        </footer>
      </main>
    </>
  )
}

export default App
