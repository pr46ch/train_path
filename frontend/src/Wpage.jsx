import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Loding, { p } from "./components/Loding";
import Paths from "./components/Paths";

export default function Wpage(props) {
  const [isloading, setisloading] = useState(false);
  const [currlocation, setcurrlocation] = useState("");
  const [destilocation, setdestilocation] = useState("");
  const [finalcurr, setfinalcurr] = useState("");
  const [finaldest, setfinaldest] = useState("");
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    if (!isloading) return;

    async function findpaths() {
      // just for testing
      if (finalcurr === "NDLS" && finaldest === "MAS") {
        setPaths(p);
        setisloading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${API_URL}/path`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: finalcurr,
            destination: finaldest,
          }),
        });

        const temppaths = await res.json();
        const t=temppaths.path;
        setPaths(t);
      } catch (err) {
        console.log(err.message);
      } finally {
        setisloading(false);
      }
    }

    findpaths();
  }, [isloading, finalcurr, finaldest]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="max-w-[1000px] mx-auto px-6 py-16 text-center">
          <Hero />
        </section>

        <section className="max-w-[1000px] mx-auto px-6 py-16">
          <div className="rounded-3xl glass shadow-xl border border-white/40 p-8 transition-all duration-300 hover:shadow-2xl">
            <form id="routeForm" className="space-y-8" noValidate>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-600">
                    Current location
                  </span>
                  <input
                    id="fromInput"
                    name="from"
                    required
                    type="text"
                    placeholder="e.g., Mumbai Central"
                    value={currlocation}
                    onChange={(e) => setcurrlocation(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-600">
                    Destination
                  </span>
                  <input
                    id="toInput"
                    name="to"
                    required
                    type="text"
                    placeholder="e.g., Goa (Madgaon)"
                    value={destilocation}
                    onChange={(e) => setdestilocation(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200"
                  />
                </label>
              </div>

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  id="findBtn"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setfinalcurr(currlocation);
                    setcurrlocation("");
                    setfinaldest(destilocation);
                    setdestilocation("");
                    setisloading(true);
                  }}
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
                >
                  <i className="fa-solid fa-magnifying-glass"></i> Find Route
                </button>

                <button
                  id="clearBtn"
                  type="button"
                  onClick={() => {
                    setcurrlocation("");
                    setdestilocation("");
                    setPaths([]);
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-all duration-200"
                >
                  <i className="fa-solid fa-rotate-left"></i> Clear
                </button>
              </div>

              <div>
                {isloading ? <Loding /> : <Paths paths={paths} />}
              </div>

              <p
                id="formNote"
                className="text-xs text-center text-slate-500"
              >
                💡 Tip: try “New Delhi” → “Mumbai CSMT”. This demo will show a
                sample route.
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
