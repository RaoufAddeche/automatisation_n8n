/**
 * ModeContext - Phase 3
 * Manages portfolio mode state (CDI vs Freelance)
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [currentMode, setCurrentMode] = useState('cdi'); // default mode
  const [availableModes, setAvailableModes] = useState([]);
  const [contentOverrides, setContentOverrides] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch available modes on mount
  useEffect(() => {
    fetchModes();
  }, []);

  // Fetch content overrides when mode changes
  useEffect(() => {
    if (currentMode) {
      fetchContentOverrides(currentMode);
    }
  }, [currentMode]);

  const fetchModes = async () => {
    try {
      const response = await fetch('/api/modes');
      const modes = await response.json();
      setAvailableModes(modes);

      // Set default mode
      const defaultMode = modes.find(m => m.is_default);
      if (defaultMode) {
        setCurrentMode(defaultMode.mode_key);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch modes:', error);
      setLoading(false);
    }
  };

  const fetchContentOverrides = async (mode) => {
    try {
      // Fetch overrides for common content types
      const [heroPitch, title, availability] = await Promise.all([
        fetch(`/api/content/hero_pitch?mode=${mode}`).then(res => res.json()),
        fetch(`/api/content/title?mode=${mode}`).then(res => res.json()),
        fetch(`/api/content/availability?mode=${mode}`).then(res => res.json())
      ]);

      setContentOverrides({
        hero_pitch: heroPitch.overrides.hero_pitch || null,
        title: title.overrides.title || null,
        availability: availability.overrides.availability || null
      });
    } catch (error) {
      console.error('Failed to fetch content overrides:', error);
    }
  };

  const switchMode = (newMode) => {
    if (newMode !== currentMode) {
      setCurrentMode(newMode);
      // Track mode switch in analytics (will be implemented in useAnalytics)
    }
  };

  const getCurrentModeConfig = () => {
    return availableModes.find(m => m.mode_key === currentMode) || null;
  };

  const value = {
    currentMode,
    availableModes,
    contentOverrides,
    loading,
    switchMode,
    getCurrentModeConfig
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
