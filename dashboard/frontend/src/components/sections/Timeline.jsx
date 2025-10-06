/**
 * Timeline Section - Career journey visualization
 * Shows commercial → formation → alternance progression
 */

import { usePortfolio } from '../../contexts/PortfolioContext';
import { Section, Badge } from '../ui';
import { FaBriefcase, FaGraduationCap, FaCode, FaAward, FaLightbulb } from 'react-icons/fa';

const CATEGORY_CONFIG = {
  commercial: {
    icon: FaBriefcase,
    color: 'blue',
    label: 'Expérience Professionnelle',
  },
  formation: {
    icon: FaGraduationCap,
    color: 'purple',
    label: 'Formation',
  },
  alternance: {
    icon: FaCode,
    color: 'green',
    label: 'Alternance',
  },
  certification: {
    icon: FaAward,
    color: 'yellow',
    label: 'Certification',
  },
  project: {
    icon: FaLightbulb,
    color: 'pink',
    label: 'Projet',
  },
};

export default function Timeline() {
  const { timeline, timelineLoading } = usePortfolio();

  if (timelineLoading) {
    return <TimelineSkeleton />;
  }

  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <Section
      id="timeline"
      title="Mon Parcours"
      subtitle="De commercial à data scientist : une reconversion complète en 2 ans"
      background="gray"
    >
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden md:block"></div>

        {/* Timeline Events */}
        <div className="space-y-12">
          {timeline.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineEvent({ event, index, isLeft }) {
  const config = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.formation;
  const Icon = config.icon;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      year: 'numeric',
    });
  };

  const period = event.end_date
    ? `${formatDate(event.date)} - ${formatDate(event.end_date)}`
    : formatDate(event.date);

  return (
    <div
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col`}
    >
      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-${config.color}-200 dark:border-${config.color}-800 hover:shadow-xl transition-all duration-300 ${
            event.is_highlight ? 'ring-2 ring-offset-2 ring-' + config.color + '-500' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-${config.color}-100 dark:bg-${config.color}-900 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{period}</div>
                {event.is_highlight && (
                  <Badge variant="primary" size="sm">✨ Highlight</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {event.description}
            </p>
          )}

          {/* Metrics */}
          {event.metrics && Object.keys(event.metrics).length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
              {Object.entries(event.metrics).map(([key, value]) => (
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

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, i) => (
                <Badge key={i} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Link */}
          {event.link_url && (
            <div className="mt-4">
              <a
                href={event.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                En savoir plus →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Center Icon (Desktop only) */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 items-center justify-center">
        <div className={`w-16 h-16 rounded-full bg-${config.color}-500 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900 z-10`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Empty space on the other side (Desktop only) */}
      <div className="hidden md:block w-5/12"></div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <Section id="timeline" background="gray">
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className="w-full md:w-5/12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
