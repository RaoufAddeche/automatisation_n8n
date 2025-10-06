import React, { useState } from 'react'
import { Download, FileText, ChevronDown, Check } from 'lucide-react'

const PDFExport = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('professional')

  const API_BASE = '/api'

  const templates = [
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Template classique pour entreprises',
      color: 'blue'
    },
    {
      id: 'modern',
      name: 'Moderne',
      description: 'Design contemporain et élégant',
      color: 'purple'
    },
    {
      id: 'minimalist',
      name: 'Minimaliste',
      description: 'Design épuré et sobre',
      color: 'gray'
    }
  ]

  const exportOptions = [
    {
      type: 'single',
      label: 'Ce projet',
      description: 'PDF détaillé du projet',
      icon: FileText,
      url: `${API_BASE}/export/pdf/${item.id}?template=${selectedTemplate}`
    },
    {
      type: 'summary',
      label: 'Résumé portfolio',
      description: 'Résumé de tous les projets',
      icon: Download,
      url: `${API_BASE}/export/portfolio-summary?template=${selectedTemplate}`
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Exporter en PDF"
      >
        <Download className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-scale-in">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Exporter en PDF
              </h3>

              {/* Template Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template
                </label>
                <div className="relative">
                  <button
                    onClick={() => {/* Toggle template dropdown */}}
                    className="w-full p-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-${templates.find(t => t.id === selectedTemplate)?.color || 'gray'}-500 mr-2`}></div>
                      <span className="text-gray-900 dark:text-gray-100">
                        {templates.find(t => t.id === selectedTemplate)?.name}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Template Options */}
                  <div className="mt-1 space-y-1">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full p-2 text-left rounded-lg transition-colors duration-200 flex items-center justify-between ${
                          selectedTemplate === template.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-${template.color}-500 mr-2`}></div>
                          <div>
                            <div className="text-sm font-medium">{template.name}</div>
                            <div className="text-xs opacity-70">{template.description}</div>
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Options d'export
                </label>
                {exportOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <a
                      key={option.type}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Preview */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Template: {templates.find(t => t.id === selectedTemplate)?.name}</span>
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      PDF
                    </span>
                  </div>
                  <div className="mt-1">
                    Format A4 • {templates.find(t => t.id === selectedTemplate)?.description}
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

export default PDFExport