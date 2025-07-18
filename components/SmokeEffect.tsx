"use client"

import { useEffect, useRef } from "react"

export default function SmokeEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear efecto de humo
    const smokeParticles: any[] = []
    const particleCount = 15

    for (let i = 0; i < particleCount; i++) {
      smokeParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 80 + 40,
        opacity: Math.random() * 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? "rgba(212, 175, 55, " : "rgba(192, 192, 192, ",
      })
    }

    const drawSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      smokeParticles.forEach((particle) => {
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius)
        gradient.addColorStop(0, `${particle.color}${particle.opacity})`)
        gradient.addColorStop(1, `${particle.color}0)`)

        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()

        // Mover partícula
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebote en los bordes
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius

        // Cambiar opacidad
        particle.opacity = Math.max(0.05, Math.min(0.2, particle.opacity + (Math.random() - 0.5) * 0.01))
      })

      animationFrameId.current = requestAnimationFrame(drawSmoke)
    }

    drawSmoke()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  )
}
