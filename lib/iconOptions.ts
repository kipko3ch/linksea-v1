import {
  Globe,
  Facebook,
  Linkedin,
  Github,
  Mail,
  Music,
  Video,
  ShoppingBag,
  Newspaper,
  Camera,
  Gamepad2,
  Coffee,
  BookOpen,
  Podcast,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Star,
  Link as LinkIcon,
  Instagram,
  type LucideIcon
} from 'lucide-react'
import React from 'react'

// Custom X (Twitter) Icon
const XIcon: React.FC<{ size?: number; color?: string; [key: string]: any }> = ({ 
  size = 24, 
  color = 'currentColor', 
  ...props 
}) => {
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    ...props
  }, 
    React.createElement('path', {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    })
  )
}

export type IconOption = {
  value: string
  label: string
  icon: LucideIcon | typeof XIcon
  color: string
}

export const iconOptions: IconOption[] = [
  { value: 'website', label: 'Website', icon: Globe, color: '#4B5563' },
  { value: 'x', label: 'X (Twitter)', icon: XIcon, color: '#000000' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { value: 'github', label: 'GitHub', icon: Github, color: '#181717' },
  { value: 'email', label: 'Email', icon: Mail, color: '#EA4335' },
  { value: 'music', label: 'Music', icon: Music, color: '#1DB954' },
  { value: 'video', label: 'Video', icon: Video, color: '#FF0000' },
  { value: 'shop', label: 'Shop', icon: ShoppingBag, color: '#F59E0B' },
  { value: 'blog', label: 'Blog', icon: Newspaper, color: '#3B82F6' },
  { value: 'photos', label: 'Photos', icon: Camera, color: '#8B5CF6' },
  { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#10B981' },
  { value: 'coffee', label: 'Buy Me Coffee', icon: Coffee, color: '#FFDD00' },
  { value: 'book', label: 'Book', icon: BookOpen, color: '#6366F1' },
  { value: 'podcast', label: 'Podcast', icon: Podcast, color: '#9333EA' },
  { value: 'contact', label: 'Contact', icon: Phone, color: '#059669' },
  { value: 'location', label: 'Location', icon: MapPin, color: '#EF4444' },
  { value: 'calendar', label: 'Calendar', icon: Calendar, color: '#0EA5E9' },
  { value: 'donate', label: 'Donate', icon: DollarSign, color: '#22C55E' },
  { value: 'support', label: 'Support', icon: Heart, color: '#EC4899' },
  { value: 'reviews', label: 'Reviews', icon: Star, color: '#F59E0B' },
  { value: 'other', label: 'Other', icon: LinkIcon, color: '#6B7280' },
]

export const getIconByValue = (value: string): IconOption => {
  return iconOptions.find(option => option.value === value) || iconOptions[0]
} 