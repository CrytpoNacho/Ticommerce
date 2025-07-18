"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

// Componente para una moneda individual
const Coin = ({ delay, duration }: { delay: number; duration: number }) => {
  const randomLeft = Math.random() * 100
  const randomRotation = Math.random() * 720 - 360
  const randomSize = Math.random() * 20 + 10

  return (
    <div
      className="absolute top-0 z-10 pointer-events-none"
      style={{
        left: `${randomLeft}%`,
        animation: `fallAndFade ${duration}s ease-in ${delay}s forwards`,
        transform: `rotate(${randomRotation}deg)`,
      }}
    >
      <div
        className="rounded-full bg-primary"
        style={{
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)",
        }}
      ></div>
    </div>
  )
}

export default function SoundEffect() {
  const [isMuted, setIsMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showCoins, setShowCoins] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showControls, setShowControls] = useState(true)

  // Generar monedas
  const coins = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: Math.random() * 2 + 1,
  }))

  useEffect(() => {
    // Verificar si ya se ha reproducido el sonido en esta sesión
    const hasPlayedSound = sessionStorage.getItem("hasPlayedSound")

    // Crear el elemento de audio
    audioRef.current = new Audio("/sounds/coin-drop.mp3")
    audioRef.current.volume = 0.5 // Volumen al 50%

    // Intentar reproducir el sonido si no se ha reproducido antes
    const attemptAutoplay = async () => {
      if (!hasPlayedSound && audioRef.current) {
        try {
          // Intentar reproducir (puede fallar debido a políticas de autoplay)
          await audioRef.current.play()
          sessionStorage.setItem("hasPlayedSound", "true")
          setIsMuted(false)
          setShowCoins(true)

          // Ocultar las monedas después de la animación
          setTimeout(() => {
            setShowCoins(false)
          }, 3000)
        } catch (error) {
          // Si falla, necesitamos interacción del usuario
          console.log("Autoplay prevented. User interaction needed.")
          setIsMuted(true)
        }
      }
    }

    attemptAutoplay()

    // Ocultar los controles después de 5 segundos
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 5000)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      clearTimeout(timer)
    }
  }, [])

  // Mostrar controles al pasar el mouse
  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    // Solo ocultar si ya ha pasado la interacción inicial
    if (hasInteracted) {
      setShowControls(false)
    }
  }

  const toggleMute = async () => {
    if (audioRef.current) {
      if (isMuted) {
        try {
          audioRef.current.currentTime = 0 // Reiniciar el audio
          await audioRef.current.play()
          setIsMuted(false)
          setShowCoins(true)
          sessionStorage.setItem("hasPlayedSound", "true")

          // Ocultar las monedas después de la animación
          setTimeout(() => {
            setShowCoins(false)
          }, 3000)
        } catch (error) {
          console.log("Playback failed:", error)
        }
      } else {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsMuted(true)
      }
    }

    setHasInteracted(true)
  }

  return (
    <>
      {/* Animación de monedas */}
      {showCoins && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {coins.map((coin) => (
            <Coin key={coin.id} delay={coin.delay} duration={coin.duration} />
          ))}
        </div>
      )}

      {/* Botón de control de sonido */}
      <div
        className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-background border border-primary flex items-center justify-center text-primary hover:bg-primary hover:bg-opacity-10 transition-all"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          title={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </>
  )
}
