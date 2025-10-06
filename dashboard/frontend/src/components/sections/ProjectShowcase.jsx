/**
 * ProjectShowcase Component - Phase 2
 * Displays featured projects with GitHub integration
 */

import { useState } from 'react';

export default function ProjectShowcase({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Projets Phares
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Une sélection de mes meilleurs projets Data Science & ML
          </p>
        </div>

        {/* Projects Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, onClick }) {
  const categoryColors = {
    ml: 'blue',
    data_viz: 'purple',
    automation: 'green',
    web_app: 'pink',
    analysis: 'yellow'
  };

  const color = categoryColors[project.category] || 'gray';

  return (
    <div
      onClick={onClick}
      className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image or placeholder */}
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className={`w-full h-48 bg-gradient-to-br from-${color}-400 to-${color}-600 flex items-center justify-center`}>
          <span className="text-6xl">
            {project.category === 'ml' && '🤖'}
            {project.category === 'data_viz' && '📊'}
            {project.category === 'automation' && '⚙️'}
            {project.category === 'web_app' && '🌐'}
            {project.category === 'analysis' && '🔍'}
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {project.short_description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Metrics */}
        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {Object.entries(project.metrics).slice(0, 2).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GitHub Link */}
        {project.github_url && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>💻</span>
            <span>{project.github_language || 'Code'}</span>
            {project.github_stars > 0 && (
              <>
                <span>⭐</span>
                <span>{project.github_stars}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {project.role && <span>👤 {project.role}</span>}
              {project.duration_months && <span>⏱️ {project.duration_months} mois</span>}
              {project.team_size && <span>👥 {project.team_size} personne{project.team_size > 1 ? 's' : ''}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Long Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {project.long_description || project.short_description}
            </p>
          </div>

          {/* Business Impact */}
          {project.business_impact && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">
                💼 Impact Business
              </h3>
              <p className="text-green-700 dark:text-green-300">
                {project.business_impact}
              </p>
            </div>
          )}

          {/* Metrics */}
          {project.metrics && Object.keys(project.metrics).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                📊 Métriques
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">
                      {key.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              🛠️ Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                🏷️ Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 text-center"
              >
                💻 Voir le Code
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-center"
              >
                🚀 Voir la Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
