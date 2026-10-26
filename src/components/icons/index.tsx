import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Handshake,
  Image as LucideImage,
  Info,
  Layers,
  Lock,
  Mail,
  MapPin,
  Menu,
  Moon,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Scale,
  Search,
  Send,
  Settings,
  Shield,
  Sun,
  Tag,
  Trash2,
  Users,
  X,
  LucideProps,
} from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  size?: number | string;
  className?: string;
  'aria-label'?: string;
}

function createIcon(Component: React.ComponentType<LucideProps>, defaultSize = 20) {
  return function IconWrapper({
    size = defaultSize,
    strokeWidth = 1.75,
    className = '',
    'aria-label': ariaLabel,
    ...props
  }: IconProps) {
    return (
      <Component
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        {...props}
      />
    );
  };
}

// Navigation & Directional Icons
export const IconChevronDown = createIcon(ChevronDown, 18);
export const IconChevronRight = createIcon(ChevronRight, 18);
export const IconChevronLeft = createIcon(ChevronLeft, 18);
export const IconArrowRight = createIcon(ArrowRight, 18);
export const IconArrowLeft = createIcon(ArrowLeft, 18);
export const IconMenu = createIcon(Menu, 22);
export const IconX = createIcon(X, 20);
export const IconExternalLink = createIcon(ExternalLink, 16);

// Search & Actions
export const IconSearch = createIcon(Search, 18);
export const IconFilter = createIcon(Filter, 18);
export const IconRefreshCw = createIcon(RefreshCw, 16);
export const IconPlus = createIcon(Plus, 18);
export const IconEdit = createIcon(Pencil, 18);
export const IconTrash = createIcon(Trash2, 18);
export const IconSave = createIcon(Save, 18);
export const IconSend = createIcon(Send, 18);
export const IconEye = createIcon(Eye, 18);
export const IconDownload = createIcon(Download, 18);

// Status & Feedback
export const IconCheck = createIcon(Check, 18);
export const IconCheckCircle = createIcon(CheckCircle2, 18);
export const IconAlertTriangle = createIcon(AlertTriangle, 18);
export const IconAlertCircle = createIcon(AlertCircle, 18);
export const IconInfo = createIcon(Info, 18);

// Domain & Institutional Icons
export const IconScale = createIcon(Scale, 22);
export const IconShield = createIcon(Shield, 22);
export const IconUsers = createIcon(Users, 22);
export const IconHandshake = createIcon(Handshake, 22);
export const IconFileText = createIcon(FileText, 18);
export const IconBookOpen = createIcon(BookOpen, 18);
export const IconCalendar = createIcon(Calendar, 16);
export const IconClock = createIcon(Clock, 16);
export const IconBuilding = createIcon(Building2, 18);
export const IconTag = createIcon(Tag, 14);
export const IconLayers = createIcon(Layers, 18);
export const IconBarChart = createIcon(BarChart3, 18);
export const IconImage = createIcon(LucideImage, 18);
export const IconSettings = createIcon(Settings, 18);
export const IconLock = createIcon(Lock, 16);

// Contact & Location
export const IconMapPin = createIcon(MapPin, 18);
export const IconPhone = createIcon(Phone, 18);
export const IconMail = createIcon(Mail, 18);
export const IconGlobe = createIcon(Globe, 16);

// Theme Mode
export const IconSun = createIcon(Sun, 18);
export const IconMoon = createIcon(Moon, 18);
