const dots = [
  [5,10,300,.9,14,0],[25,60,260,.8,16,2],[45,15,340,.7,18,1],
  [60,70,300,.8,15,3],[80,12,280,.9,13,4],[90,55,320,.7,17,2],
] as const
export default function BgDots() {
  return (
    <div className="bg-dots" aria-hidden="true">
      {dots.map(([l, t, s, o, d, dl], i) => (
        <span key={i} className="dot" style={{ left: l + '%', top: t + '%', width: s, height: s, opacity: o, animationDuration: d + 's', animationDelay: dl + 's' }} />
      ))}
    </div>
  )
}
