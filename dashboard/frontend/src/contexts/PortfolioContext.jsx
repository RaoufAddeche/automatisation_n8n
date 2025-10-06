/**
 * Portfolio Context for global state management
 * Centralized data fetching and caching
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  // Profile state
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Timeline state
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState(null);

  // Skills state
  const [skills, setSkills] = useState({ technical: {}, business: {} });
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState(null);

  // Social links state
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialLinksLoading, setSocialLinksLoading] = useState(true);

  // Portfolio projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  // Portfolio stats
  const [stats, setStats] = useState(null);

  // Fetch profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch timeline
  useEffect(() => {
    fetchTimeline();
  }, []);

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch social links
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProfile() {
    try {
      setProfileLoading(true);
      setProfileError(null);
      const data = await api.profile.get();
      setProfile(data);
    } catch (error) {
      setProfileError(error.message);
      console.error('Failed to fetch profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }

  async function fetchTimeline(filters = {}) {
    try {
      setTimelineLoading(true);
      setTimelineError(null);
      const data = await api.timeline.getAll(filters);
      setTimeline(data);
    } catch (error) {
      setTimelineError(error.message);
      console.error('Failed to fetch timeline:', error);
    } finally {
      setTimelineLoading(false);
    }
  }

  async function fetchSkills() {
    try {
      setSkillsLoading(true);
      setSkillsError(null);
      const data = await api.skills.getGrouped();
      setSkills(data);
    } catch (error) {
      setSkillsError(error.message);
      console.error('Failed to fetch skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  }

  async function fetchSocialLinks() {
    try {
      setSocialLinksLoading(true);
      const data = await api.socialLinks.getAll();
      setSocialLinks(data);
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setSocialLinksLoading(false);
    }
  }

  async function fetchProjects(filters = { status: 'published', limit: 50 }) {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      const data = await api.portfolio.getAll(filters);
      setProjects(data);

      // Also fetch stats
      const statsData = await api.portfolio.getStats();
      setStats(statsData);
    } catch (error) {
      setProjectsError(error.message);
      console.error('Failed to fetch projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  }

  // Refresh functions
  const refresh = {
    profile: fetchProfile,
    timeline: fetchTimeline,
    skills: fetchSkills,
    socialLinks: fetchSocialLinks,
    projects: fetchProjects,
  };

  // Loading states
  const isLoading = profileLoading || timelineLoading || skillsLoading || projectsLoading;

  const value = {
    // Profile
    profile,
    profileLoading,
    profileError,

    // Timeline
    timeline,
    timelineLoading,
    timelineError,

    // Skills
    skills,
    skillsLoading,
    skillsError,

    // Social Links
    socialLinks,
    socialLinksLoading,

    // Projects
    projects,
    projectsLoading,
    projectsError,
    stats,

    // Utilities
    isLoading,
    refresh,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook to use portfolio context
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

export default PortfolioContext;
