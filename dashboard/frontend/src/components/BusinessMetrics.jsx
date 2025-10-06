import React, { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, Users, Zap, Target, Award, Calendar } from 'lucide-react'

const BusinessMetrics = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!item.business_metrics && !item.technical_metrics && !item.achievements) {
    return null
  }

  const { business_metrics = {}, technical_metrics = {}, achievements = [] } = item

  const getMetricIcon = (key) => {
    const icons = {
      revenue_impact: TrendingUp,
      users_impacted: Users,
      performance_gain: Zap,
      roi_percentage: Target,
      uptime: Award,
      response_time: Calendar,
    }
    return icons[key] || Target
  }

  const formatMetricKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const businessMetricsArray = Object.entries(business_metrics).filter(([_, value]) => value)
  const technicalMetricsArray = Object.entries(technical_metrics).filter(([_, value]) => value)

  if (businessMetricsArray.length === 0 && technicalMetricsArray.length === 0 && achievements.length === 0) {
    return null
  }

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
      >
        <span>Métriques Business & Techniques</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        )}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
      }`}>
        {/* Business Metrics */}
        {businessMetricsArray.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
              Impact Business
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {businessMetricsArray.map(([key, value], index) => {
                const Icon = getMetricIcon(key)
                return (
                  <div
                    key={key}
                    className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                        {formatMetricKey(key)}
                      </div>
                      <div className="text-sm text-blue-900 dark:text-blue-200 font-semibold truncate">
                        {value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Technical Metrics */}
        {technicalMetricsArray.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 uppercase tracking-wide">
              Performance Technique
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {technicalMetricsArray.map(([key, value], index) => {
                const Icon = getMetricIcon(key)
                return (
                  <div
                    key={key}
                    className="flex items-center p-2 bg-green-50 dark:bg-green-900/30 rounded-lg animate-fade-in-up"
                    style={{ animationDelay: `${(businessMetricsArray.length + index) * 0.1}s` }}
                  >
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-green-800 dark:text-green-300 font-medium">
                        {formatMetricKey(key)}
                      </div>
                      <div className="text-sm text-green-900 dark:text-green-200 font-semibold truncate">
                        {value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">
              Réalisations
            </h4>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: `${(businessMetricsArray.length + technicalMetricsArray.length + index) * 0.1}s` }}
                >
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-900 dark:text-purple-200">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Info */}
        {(item.complexity_score || item.team_size || item.project_duration_months) && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              {item.complexity_score && (
                <span>Complexité: {item.complexity_score}/10</span>
              )}
              {item.team_size && (
                <span>Équipe: {item.team_size} pers.</span>
              )}
              {item.project_duration_months && (
                <span>Durée: {item.project_duration_months} mois</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessMetrics