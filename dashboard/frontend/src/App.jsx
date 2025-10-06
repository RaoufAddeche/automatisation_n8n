/**
 * Phase 3 Portfolio App - Dual Mode (CDI/Freelance) + Analytics
 */

import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModeProvider, useMode } from './contexts/ModeContext';
import { useAnalytics } from './hooks/useAnalytics';
import ModeToggle from './components/ModeToggle';
import ProjectShowcase from './components/sections/ProjectShowcase';
import Blog from './components/sections/Blog';
import Testimonials from './components/sections/Testimonials';
import Skills from './components/sections/Skills';
import ContactForm from './components/sections/ContactForm';

// Main App wrapped with providers
export default function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <PortfolioApp />
      </ModeProvider>
    </ThemeProvider>
  );
}

function PortfolioApp() {
  const { currentMode, contentOverrides, loading: modeLoading } = useMode();
  const analytics = useAnalytics(currentMode);

  const [profile, setProfile] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refetch data when mode changes
  useEffect(() => {
    if (!modeLoading) {
      fetchData();
    }
  }, [currentMode, modeLoading]);

  const fetchData = () => {
    setLoading(true);
    // Fetch all data with mode-specific endpoints
    Promise.all([
      fetch('/api/profile').then(res => res.json()),
      fetch('/api/timeline').then(res => res.json()),
      fetch(`/api/mode-projects?mode=${currentMode}&featured_only=true`).then(res => res.json()),
      fetch('/api/blog?featured_only=true&limit=3').then(res => res.json()),
      fetch('/api/testimonials?featured_only=true').then(res => res.json()),
      fetch('/api/skills?primary_only=true').then(res => res.json())
    ])
      .then(([profileData, timelineData, projectsData, blogData, testimonialsData, skillsData]) => {
        setProfile(profileData);
        setTimeline(timelineData);
        setProjects(projectsData);
        setBlogPosts(blogData);
        setTestimonials(testimonialsData);
        setSkills(skillsData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Apply content overrides
  const displayTitle = contentOverrides.title || profile?.title;
  const displayHeroPitch = contentOverrides.hero_pitch || profile?.hero_pitch;
  const displayAvailability = contentOverrides.availability || profile?.availability;

  // Track analytics on component interactions
  const handleProjectClick = (project) => {
    analytics.trackProjectView(project.id, project.title);
  };

  const handleBlogClick = (post) => {
    analytics.trackBlogView(post.id, post.title);
  };

  const handleCVDownload = () => {
    analytics.trackCVDownload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mode Toggle */}
      <ModeToggle />

      {/* Hero Section Simplifié */}
      <div className="container mx-auto px-4 py-20">
          {loading && (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ Erreur de connexion : {error}
            </div>
          )}

          {profile && (
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge Disponibilité - MODE AWARE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {displayAvailability || 'Disponible'}
              </div>

              {/* Nom et Titre - MODE AWARE */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {profile.full_name}
              </h1>
              <h2 className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
                {displayTitle}
              </h2>

              {/* Pitch - MODE AWARE */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {displayHeroPitch}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <Stat value="2 ans" label="En Data Science" />
                <Stat value="5+ ans" label="Expérience Business" />
                <Stat value="Hybride" label="Tech + Business" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => scrollToSection('timeline')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  📅 Voir mon parcours
                </button>
                <button
                  onClick={() => {
                    handleCVDownload();
                    window.open('/api/export/cv.pdf', '_blank');
                  }}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 font-medium rounded-lg transition-all duration-200"
                >
                  📥 Télécharger CV
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium rounded-lg transition-all duration-200"
                >
                  ✉️ Me contacter
                </button>
              </div>

              {/* Info Debug */}
              <div className="mt-12 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-mono text-sm">
                  ✅ API connectée | Email: {profile.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Section */}
        {timeline.length > 0 && (
          <section id="timeline" className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Mon Parcours
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  De commercial à data scientist : une reconversion complète en 2 ans
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {timeline.map((event, index) => (
                  <TimelineEvent key={event.id} event={event} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        <ProjectShowcase projects={projects} />

        {/* Skills Section */}
        <Skills skills={skills} />

        {/* Blog Section */}
        <Blog posts={blogPosts} />

        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} />

        {/* Contact Section with Form */}
        <ContactForm profile={profile} />

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Portfolio automatisé avec ❤️ et 🤖
            </p>
          </div>
        </footer>
      </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function TimelineEvent({ event, index }) {
  const categoryColors = {
    commercial: 'blue',
    formation: 'purple',
    alternance: 'green',
    certification: 'yellow',
    project: 'pink'
  };

  const color = categoryColors[event.category] || 'gray';
  const isLeft = index % 2 === 0;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  return (
    <div className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${color}-500 flex items-center justify-center text-white font-bold shadow-lg`}>
        {event.category === 'commercial' && '💼'}
        {event.category === 'formation' && '🎓'}
        {event.category === 'alternance' && '🚀'}
        {event.category === 'certification' && '🏆'}
        {event.category === 'project' && '💡'}
      </div>

      {/* Content */}
      <div className={`flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-${color}-500 ${event.is_highlight ? 'ring-2 ring-' + color + '-300' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {event.end_date ? `${formatDate(event.date)} - ${formatDate(event.end_date)}` : formatDate(event.date)}
            </p>
            {event.is_highlight && (
              <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded mt-1">
                ✨ Highlight
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {event.title}
        </h3>

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
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
