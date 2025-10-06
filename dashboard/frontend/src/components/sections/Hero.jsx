/**
 * Hero Section - Landing page header
 * Showcases profile with photo, title, pitch, and CTA buttons
 */

import { usePortfolio } from '../../contexts/PortfolioContext';
import { Button, Container } from '../ui';
import { FaLinkedin, FaGithub, FaEnvelope, FaDownload } from 'react-icons/fa';

export default function Hero() {
  const { profile, profileLoading, socialLinks } = usePortfolio();

  if (profileLoading) {
    return <HeroSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const handleDownloadCV = () => {
    // Will be implemented with PDF export
    window.open('/api/export/cv', '_blank');
  };

  const handleContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <Container className="relative z-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Tag/Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {profile.availability || 'Disponible'}
            </div>

            {/* Name & Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {profile.full_name}
              </h1>
              <h2 className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-semibold">
                {profile.title}
              </h2>
            </div>

            {/* Hero Pitch */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {profile.hero_pitch}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 py-4">
              <Stat value="2 ans" label="En Data Science" />
              <Stat value="5+ ans" label="Expérience Business" />
              <Stat value="Hybride" label="Tech + Business" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir mes projets
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadCV}
              >
                <FaDownload className="mr-2" />
                Télécharger CV
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleContact}
              >
                Me contacter
              </Button>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4 pt-4">
                {socialLinks.map((link) => (
                  <SocialLink key={link.id} link={link} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Profile Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>

              {/* Profile Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">💼</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">En alternance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
            <span className="text-sm">Découvrir mon parcours</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Stat component
function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

// Social Link component
function SocialLink({ link }) {
  const icons = {
    linkedin: FaLinkedin,
    github: FaGithub,
    email: FaEnvelope,
  };

  const Icon = icons[link.platform] || FaEnvelope;

  return (
    <a
      href={link.url}
      target={link.platform !== 'email' ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-110"
      title={link.display_name}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

// Loading Skeleton
function HeroSkeleton() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Container className="py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-16 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
