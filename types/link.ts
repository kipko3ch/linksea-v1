export type Link = {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  position: number
  clicks?: number
  user_id: string
  created_at: string
}

export type LinkFormProps = {
  link?: Omit<Link, 'user_id' | 'created_at' | 'position' | 'clicks'>
  onSave: () => void
  onCancel: () => void
}

export type LinkItemProps = {
  link: Link
  clicks?: number
  onEdit: () => void
  onDelete: () => void
} 