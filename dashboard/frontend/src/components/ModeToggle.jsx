/**
 * ModeToggle Component - Phase 3
 * Allows users to switch between CDI and Freelance modes
 */

import { useMode } from '../contexts/ModeContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ModeToggle() {
  const { currentMode, availableModes, switchMode, getCurrentModeConfig } = useMode();
  const analytics = useAnalytics(currentMode);

  if (availableModes.length === 0) return null;

  const currentConfig = getCurrentModeConfig();

  const handleModeSwitch = (newMode) => {
    if (newMode !== currentMode) {
      analytics.trackModeSwitch(currentMode, newMode);
      switchMode(newMode);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex gap-1">
        {availableModes.map((mode) => {
          const isActive = mode.mode_key === currentMode;
          const colorClass = mode.color_primary || 'blue';

          return (
            <button
              key={mode.mode_key}
              onClick={() => handleModeSwitch(mode.mode_key)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2
                ${
                  isActive
                    ? `bg-${colorClass}-600 text-white shadow-md`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
                }
              `}
              title={mode.description}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-sm font-bold">{mode.display_name}</span>
            </button>
          );
        })}
      </div>

      {/* Mode description tooltip */}
      {currentConfig && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 max-w-xs">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentConfig.description}
          </p>
        </div>
      )}
    </div>
  );
}
