import { useEffect, useState } from "react"
import {
  CircleCheckIcon,
  CircleX,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()
  const [position, setPosition] = useState("bottom-right")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPosition("top-center") // Mobile
      } else {
        setPosition("bottom-right") // Desktop
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Sonner
      theme={theme}
      position={position}
      className="toaster group"
      duration={3000}
      toastOptions={{
        className: "max-md:pointer-events-none",
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-white fill-green-600" />,
        info: <InfoIcon className="size-5 text-white fill-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-white fill-amber-600" />,
        error: <CircleX className="size-5 text-white fill-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        }
      }
      {...props}
    />
  )
}

export { Toaster }