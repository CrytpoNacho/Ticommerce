export default function GoldenCurves() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Curva superior izquierda */}
      <div
        className="absolute top-0 left-0 w-[60%] h-[40%]"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.2), transparent 70%)",
        }}
      />

      {/* Curva superior derecha */}
      <div
        className="absolute top-0 right-0 w-[50%] h-[30%]"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.15), transparent 70%)",
        }}
      />

      {/* Curva inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 w-[40%] h-[40%]"
        style={{
          background: "radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.1), transparent 70%)",
        }}
      />

      {/* Curva inferior derecha */}
      <div
        className="absolute bottom-0 right-0 w-[60%] h-[50%]"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(212, 175, 55, 0.2), transparent 70%)",
        }}
      />

      {/* Líneas doradas */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="absolute top-[10%] right-[-10%] w-[80%] h-[1px] transform rotate-[-20deg]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7), transparent)",
          }}
        />
        <div
          className="absolute top-[30%] left-[-10%] w-[80%] h-[1px] transform rotate-[15deg]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)",
          }}
        />
        <div
          className="absolute bottom-[20%] right-[-10%] w-[80%] h-[1px] transform rotate-[25deg]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)",
          }}
        />
        <div
          className="absolute bottom-[40%] left-[-10%] w-[80%] h-[1px] transform rotate-[-15deg]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)",
          }}
        />
      </div>
    </div>
  )
}
