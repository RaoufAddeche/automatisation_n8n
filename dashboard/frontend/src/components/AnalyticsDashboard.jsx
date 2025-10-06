import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Globe,
  Monitor,
  Smartphone,
  Share2,
  Download,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState(null)
  const [socialStats, setSocialStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const API_BASE = '/api'

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [socialRes] = await Promise.all([
        axios.get(`${API_BASE}/social-analytics`),
        // Ici on pourrait ajouter d'autres endpoints d'analytics
      ])

      setSocialStats(socialRes.data)

      // Simuler des données d'analytics pour la démo
      setAnalytics({
        views: {
          total: 1247,
          unique: 891,
          returning: 356,
          growth: 23.5
        },
        visitors: {
          countries: [
            { name: 'France', count: 425, percentage: 47.7 },
            { name: 'États-Unis', count: 178, percentage: 20.0 },
            { name: 'Canada', count: 89, percentage: 10.0 },
            { name: 'Allemagne', count: 67, percentage: 7.5 },
            { name: 'Royaume-Uni', count: 56, percentage: 6.3 }
          ],
          devices: [
            { type: 'Desktop', count: 534, percentage: 59.9 },
            { type: 'Mobile', count: 267, percentage: 30.0 },
            { type: 'Tablet', count: 90, percentage: 10.1 }
          ]
        },
        recruiterActivity: [
          {
            company: 'Google',
            visits: 12,
            timeSpent: '8m 34s',
            lastVisit: '2024-01-15T10:30:00Z',
            projectsViewed: ['seductAI', 'automatisation_n8n']
          },
          {
            company: 'Microsoft',
            visits: 8,
            timeSpent: '6m 12s',
            lastVisit: '2024-01-14T15:22:00Z',
            projectsViewed: ['Churn-Clients', 'mail-assistant-ai']
          },
          {
            company: 'Meta',
            visits: 5,
            timeSpent: '4m 45s',
            lastVisit: '2024-01-13T09:15:00Z',
            projectsViewed: ['seductAI']
          }
        ],
        topProjects: [
          { name: 'seductAI', views: 342, avgTime: '3m 15s' },
          { name: 'automatisation_n8n', views: 289, avgTime: '4m 32s' },
          { name: 'Churn-Clients', views: 234, avgTime: '2m 48s' },
          { name: 'mail-assistant-ai', views: 198, avgTime: '2m 12s' }
        ]
      })
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics()
    }
  }, [isOpen, selectedPeriod])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Visualisez l'engagement des recruteurs avec votre portfolio
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-select text-sm"
            >
              <option value="1d">24h</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="90d">3 mois</option>
            </select>

            <button
              onClick={fetchAnalytics}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stats-card">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Eye className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Vues totales</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {analytics?.views.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Visiteurs uniques</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {analytics?.views.unique?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Croissance</p>
                      <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                        +{analytics?.views.growth}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                      <Share2 className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Partages</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {socialStats?.total_shares || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Projects */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Projets les plus vus
                  </h3>
                  <div className="space-y-3">
                    {analytics?.topProjects.map((project, index) => (
                      <div
                        key={project.name}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {project.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Temps moyen: {project.avgTime}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {project.views}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">vues</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recruiter Activity */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Activité Recruteurs
                  </h3>
                  <div className="space-y-3">
                    {analytics?.recruiterActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {activity.company}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(activity.lastVisit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>{activity.visits} visites</span>
                          <span>{activity.timeSpent}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Projets vus: {activity.projectsViewed.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic and Device Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geographic Distribution */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Répartition géographique
                  </h3>
                  <div className="space-y-3">
                    {analytics?.visitors.countries.map((country) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">{country.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${country.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {country.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Types */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Types d'appareils
                  </h3>
                  <div className="space-y-4">
                    {analytics?.visitors.devices.map((device) => {
                      const Icon = device.type === 'Desktop' ? Monitor :
                                 device.type === 'Mobile' ? Smartphone : Monitor
                      return (
                        <div key={device.type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{device.type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {device.percentage.toFixed(1)}%
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {device.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Social Sharing Stats */}
              {socialStats?.platform_stats?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Statistiques de partage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {socialStats.platform_stats.map((platform) => (
                      <div
                        key={platform.platform}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {platform.platform}
                        </h4>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {platform.shares}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">partages</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard