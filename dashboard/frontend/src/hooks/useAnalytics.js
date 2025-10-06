/**
 * useAnalytics Hook - Phase 3
 * Tracks user analytics events and session data
 */

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Session storage key
const SESSION_ID_KEY = 'portfolio_session_id';

export function useAnalytics(portfolioMode) {
  const sessionIdRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      initializeSession();
      hasInitialized.current = true;
    }
  }, []);

  // Initialize or resume session
  const initializeSession = async () => {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

    if (!sessionId) {
      // Create new session
      try {
        const sessionData = {
          landing_page: window.location.pathname,
          landing_mode: portfolioMode,
          referrer_source: detectReferrerSource(),
          utm_source: getQueryParam('utm_source'),
          utm_medium: getQueryParam('utm_medium'),
          utm_campaign: getQueryParam('utm_campaign'),
          user_agent: navigator.userAgent,
          device_type: detectDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          ip_address: null // Will be set by backend
        };

        const response = await fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        });

        const result = await response.json();
        sessionId = result.session_id;
        sessionStorage.setItem(SESSION_ID_KEY, sessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
        // Fallback to local UUID
        sessionId = uuidv4();
        sessionStorage.setItem(SESSION_ID_KEY, sessionId);
      }
    }

    sessionIdRef.current = sessionId;

    // Track initial page view
    trackEvent('page_view', 'navigation', 'Landing Page');
  };

  // Track an analytics event
  const trackEvent = async (
    eventType,
    eventCategory = null,
    eventLabel = null,
    options = {}
  ) => {
    if (!sessionIdRef.current) return;

    try {
      const eventData = {
        session_id: sessionIdRef.current,
        event_type: eventType,
        event_category: eventCategory,
        event_label: eventLabel,
        event_value: options.value || null,
        portfolio_mode: portfolioMode,
        page_url: window.location.href,
        referrer_url: document.referrer || null,
        target_type: options.targetType || null,
        target_id: options.targetId || null,
        metadata: options.metadata || {}
      };

      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  // Update session activity
  const updateSession = async (updates) => {
    if (!sessionIdRef.current) return;

    try {
      await fetch(`/api/analytics/session/${sessionIdRef.current}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  // Track page view
  const trackPageView = (pageName) => {
    trackEvent('page_view', 'navigation', pageName);
    updateSession({ page_views: 1 });
  };

  // Track project view
  const trackProjectView = (projectId, projectTitle) => {
    trackEvent('project_view', 'engagement', projectTitle, {
      targetType: 'project',
      targetId: projectId
    });
    updateSession({ projects_viewed: 1 });
  };

  // Track blog post view
  const trackBlogView = (postId, postTitle) => {
    trackEvent('blog_view', 'engagement', postTitle, {
      targetType: 'blog_post',
      targetId: postId
    });
    updateSession({ blog_posts_viewed: 1 });
  };

  // Track contact form submission
  const trackContactSubmit = () => {
    trackEvent('contact', 'conversion', 'Contact Form Submitted', { value: 1 });
    updateSession({ contact_submitted: true });
  };

  // Track CV download
  const trackCVDownload = () => {
    trackEvent('cv_download', 'conversion', 'CV Downloaded', { value: 1 });
    updateSession({ cv_downloaded: true });
  };

  // Track mode switch
  const trackModeSwitch = (fromMode, toMode) => {
    trackEvent('mode_switch', 'engagement', `${fromMode} → ${toMode}`);
    updateSession({ mode_switches: 1, modes_viewed: toMode });
  };

  // Track button click
  const trackClick = (label, metadata = {}) => {
    trackEvent('click', 'engagement', label, { metadata });
  };

  return {
    sessionId: sessionIdRef.current,
    trackEvent,
    trackPageView,
    trackProjectView,
    trackBlogView,
    trackContactSubmit,
    trackCVDownload,
    trackModeSwitch,
    trackClick
  };
}

// Utility functions
function detectReferrerSource() {
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('twitter') || referrer.includes('x.com')) return 'twitter';
  if (referrer.includes('facebook')) return 'facebook';
  return 'other';
}

function detectDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
  return 'Unknown';
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
