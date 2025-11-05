export default function Loding(){
    return(
        <>
            <div id="loader" className="mt-8 hidden animate-fade-in">
              <div className="flex items-center justify-center gap-3 text-sm text-slate-600">
                <svg className="animate-spin w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="3" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" stroke-width="3" />
                </svg>
                <span className="italic">Finding best route for you...</span>
              </div>
            </div>
        </>
    )
}
export const p = [{
    train: 11111,
    source: 'NDLS',
    destination: 'HWH',
    from_time: '1:00pm',
    to_time: '5:00pm'
},
{
    train: 22222,
    source: 'HWH',
    destination: 'MAS',
    from_time: '6:00pm',
    to_time: '7:00pm'
},

{
    train: 333333,
    source: 'MAS',
    destination: 'SC',
    from_time: '11:00pm',
    to_time: '3:00am'
}]
