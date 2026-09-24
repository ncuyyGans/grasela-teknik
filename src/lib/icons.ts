import {
  Wind, Wrench, Hammer, Droplet, Zap, Settings, Snowflake,
  Fan, Thermometer, Plug, Lightbulb, ShieldCheck, type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  wind: Wind,
  wrench: Wrench,
  tool: Hammer,
  droplet: Droplet,
  zap: Zap,
  settings: Settings,
  snowflake: Snowflake,
  fan: Fan,
  thermometer: Thermometer,
  plug: Plug,
  lightbulb: Lightbulb,
  hammer: Hammer,
  shield: ShieldCheck,
}

export function getServiceIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Wrench
}

export const availableIcons = [
  { name: 'wind', label: 'Angin / AC' },
  { name: 'snowflake', label: 'Salju / AC' },
  { name: 'fan', label: 'Kipas' },
  { name: 'wrench', label: 'Kunci Pas' },
  { name: 'tool', label: 'Perkakas' },
  { name: 'droplet', label: 'Air / Freon' },
  { name: 'thermometer', label: 'Termometer' },
  { name: 'zap', label: 'Listrik' },
  { name: 'plug', label: 'Stop Kontak' },
  { name: 'lightbulb', label: 'Lampu' },
  { name: 'settings', label: 'Pengaturan' },
  { name: 'hammer', label: 'Palu' },
  { name: 'shield', label: 'Perisai' },
]
