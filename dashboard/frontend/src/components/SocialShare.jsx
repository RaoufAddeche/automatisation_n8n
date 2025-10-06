import React, { useState } from 'react'
import { Share2, Linkedin, MessageSquare, Twitter, Copy, Check } from 'lucide-react'

const SocialShare = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const API_BASE = '/api'

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.github_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socialButtons = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `${API_BASE}/share/linkedin/${item.id}`,
      description: 'Partager sur LinkedIn'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `${API_BASE}/share/twitter/${item.id}`,
      description: 'Partager sur Twitter'
    },
    {
      name: 'StackOverflow',
      icon: MessageSquare,
      color: 'bg-orange-500 hover:bg-orange-600',
      url: `${API_BASE}/share/stackoverflow/${item.id}`,
      description: 'Poser une question sur StackOverflow'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Partager ce projet"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-scale-in">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Partager "{item.title}"
              </h3>

              <div className="space-y-2">
                {socialButtons.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center w-full p-3 rounded-lg text-white ${social.color} transition-all duration-200 transform hover:scale-105 active:scale-95`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{social.name}</div>
                        <div className="text-xs opacity-90">{social.description}</div>
                      </div>
                    </a>
                  )
                })}

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-3 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 mr-3" />
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {copied ? 'Copié!' : 'Copier le lien'}
                    </div>
                    <div className="text-xs opacity-70">
                      {copied ? 'Lien copié dans le presse-papiers' : 'Copier l\'URL GitHub'}
                    </div>
                  </div>
                </button>
              </div>

              {/* Project Quick Info */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>⭐ {item.github_stars} stars</span>
                    <span>🍴 {item.github_forks} forks</span>
                  </div>
                  <div className="mt-1 truncate">
                    📂 {item.github_language || 'Multiple'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SocialShare