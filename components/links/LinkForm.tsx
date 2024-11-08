import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Type, Globe } from 'lucide-react'
import { iconOptions, type IconOption } from '@/lib/iconOptions'

type LinkFormProps = {
  link?: {
    id: string
    title: string
    url: string
    description?: string
    icon?: string
  }
  onSave: () => void
  onCancel: () => void
}

export default function LinkForm({ link, onSave, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState(link?.title || '')
  const [url, setUrl] = useState(link?.url || '')
  const [description, setDescription] = useState(link?.description || '')
  const [selectedIcon, setSelectedIcon] = useState<IconOption | null>(
    iconOptions.find(option => option.value === link?.icon) || null
  )
  const [loading, setLoading] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      if (link?.id) {
        // Update existing link
        await supabase
          .from('links')
          .update({ 
            title, 
            url, 
            description, 
            icon: selectedIcon?.value || null 
          })
          .eq('id', link.id)
      } else {
        // Create new link
        const { data: links } = await supabase
          .from('links')
          .select('position')
          .eq('user_id', user.id)
          .order('position', { ascending: false })
          .limit(1)

        const nextPosition = (links?.[0]?.position ?? -1) + 1

        await supabase
          .from('links')
          .insert({
            user_id: user.id,
            title,
            url,
            description,
            icon: selectedIcon?.value || null,
            position: nextPosition
          })
      }

      onSave()
    } catch (error) {
      console.error('Error saving link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg
                   text-gray-900 dark:text-gray-100 placeholder-gray-500
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   transition-colors duration-200"
          placeholder="Enter link title"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg
                   text-gray-900 dark:text-gray-100 placeholder-gray-500
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   transition-colors duration-200"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Icon
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 
                     border border-gray-200 dark:border-gray-700 rounded-lg text-left
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="flex items-center">
              {selectedIcon ? (
                <>
                  <selectedIcon.icon className="w-5 h-5 mr-2" style={{ color: selectedIcon.color }} />
                  <span className="text-gray-900 dark:text-gray-100">{selectedIcon.label}</span>
                </>
              ) : (
                <span className="text-gray-500">Select an icon</span>
              )}
            </div>
          </button>

          {showIconPicker && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <div className="grid grid-cols-3 gap-1 p-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(option)
                      setShowIconPicker(false)
                    }}
                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <option.icon className="w-6 h-6 mb-1" style={{ color: option.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg
                   text-gray-900 dark:text-gray-100 placeholder-gray-500
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   transition-colors duration-200"
          placeholder="Enter a brief description"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700
                   border border-gray-200 dark:border-gray-600 rounded-lg 
                   hover:bg-gray-200 dark:hover:bg-gray-600
                   focus:outline-none focus:ring-2 focus:ring-gray-500
                   transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 
                   rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-primary-500
                   transition-colors duration-200"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
} 