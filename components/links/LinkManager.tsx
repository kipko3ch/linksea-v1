import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Plus, LinkIcon } from 'lucide-react'

// Dynamically import components to avoid SSR issues
const LinkForm = dynamic(() => import('./LinkForm'), { ssr: false })
const LinkItem = dynamic(() => import('./LinkItem'), { ssr: false })

type Link = {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  position: number
  clicks: number
}

export default function LinkManager() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [analytics, setAnalytics] = useState<{[key: string]: number}>({})

  useEffect(() => {
    fetchLinks()
    fetchAnalytics()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position')

      if (error) throw error

      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('analytics')
        .select('link_id, count')
        .eq('user_id', user.id)

      if (error) throw error

      const analyticsMap: {[key: string]: number} = {}
      data?.forEach(item => {
        analyticsMap[item.link_id] = item.count
      })
      setAnalytics(analyticsMap)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }))

    setLinks(updatedItems)

    try {
      const updates = updatedItems.map(item => ({
        id: item.id,
        position: item.position
      }))

      const { error } = await supabase
        .from('links')
        .upsert(updates)

      if (error) throw error
    } catch (error) {
      console.error('Error updating positions:', error)
      fetchLinks() // Revert on error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsAddingLink(true)}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-4 flex items-center justify-center gap-3
                 transition-all duration-200 transform hover:scale-[1.02] shadow-lg border border-primary-500"
      >
        <Plus className="w-6 h-6" />
        <span className="text-lg font-medium">Add New Link</span>
      </button>

      {isAddingLink && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <LinkForm
            onSave={() => {
              fetchLinks()
              setIsAddingLink(false)
            }}
            onCancel={() => setIsAddingLink(false)}
          />
        </motion.div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {links.map((link, index) => (
                <Draggable 
                  key={link.id} 
                  draggableId={link.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transform transition-transform ${
                        snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                      }`}
                    >
                      <LinkItem
                        link={link}
                        clicks={analytics[link.id] || 0}
                        onEdit={fetchLinks}
                        onDelete={fetchLinks}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!loading && links.length === 0 && (
        <div className="text-center py-12">
          <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No links yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first link to get started!
          </p>
        </div>
      )}
    </div>
  )
} 