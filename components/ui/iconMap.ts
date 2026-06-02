/**
 * Resuelve un nombre de icono (string usado en los archivos de datos) al
 * componente lucide correspondiente. Devuelve `Hexagon` como reserva.
 */
import {
  Boxes,
  Brain,
  Coins,
  Compass,
  Crown,
  Eye,
  Flag,
  Hexagon,
  Info,
  Layers,
  Lock,
  Radio,
  RefreshCw,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from './icons';

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  Brain,
  Coins,
  Compass,
  Crown,
  Eye,
  Flag,
  Hexagon,
  Info,
  Layers,
  Lock,
  Radio,
  RefreshCw,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Users,
  Zap,
};

export function getIcon(name?: string): LucideIcon {
  return (name && ICONS[name]) || Hexagon;
}
