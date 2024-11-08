import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Edit2, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import LinkForm from './LinkForm'
import { iconOptions, getIconByValue } from '@/lib/iconOptions'

type LinkItemProps = {
  link: {
    id: string
    title: string
    url: string
    description?: string
    icon?: string
  }
  clicks?: number
  onEdit: () => void
  onDelete: () => void
}

export default function LinkItem({ link, clicks, onEdit, onDelete }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFullUrl, setShowFullUrl] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    setLoading(true)
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', link.id)

    if (error) {
      console.error('Error deleting link:', error)
    } else {
      onDelete()
    }
    setLoading(false)
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return showFullUrl ? url : `${urlObj.hostname}${urlObj.pathname}`
    } catch {
      return url
    }
  }

  if (isEditing) {
    return (
      <LinkForm
        link={link}
        onSave={() => {
          setIsEditing(false)
          onEdit()
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  const selectedIcon = link.icon ? getIconByValue(link.icon) : null
  const IconComponent = selectedIcon?.icon

  return (
    <div className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200">
      <div className="flex items-center text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 flex items-center gap-4 min-w-0">
        {IconComponent ? (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
            <IconComponent className="w-6 h-6" style={{ color: selectedIcon.color }} />
          </div>
        ) : (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {link.title}
          </h3>
          {link.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {link.description}
            </p>
          )}
          <button 
            onClick={() => setShowFullUrl(!showFullUrl)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 mt-1 truncate max-w-full"
          >
            <span className="truncate">
              {formatUrl(link.url)}
            </span>
            <ExternalLink className="flex-shrink-0 w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg
                   hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg
                   hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 