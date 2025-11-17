import React, { useState, useCallback, memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Theme, SeasonalTheme, ThemeCustomizationOptions } from '../types/themes';
import {
  Palette,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  Sparkles,
  Zap,
  Clock,
  Brush,
  Save,
  RotateCcw,
  Check,
  X,
  Star,
  Crown,
  Gift,
  Snowflake,
  Flower,
  Leaf,
  Flame,
  Droplets,
  Accessibility,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ThemeSelectorProps {
  className?: string;
  showCustomization?: boolean;
  showPreview?: boolean;
}

// Memoized ThemeCard component
const ThemeCard: React.FC<{
  theme: Theme;
  isActive: boolean;
  onSelect: (themeId: string) => void;
  onUnlock?: (themeId: string) => void;
  showUnlock?: boolean;
}> = memo(({ theme, isActive, onSelect, onUnlock, showUnlock = false }) => {
  const handleSelect = useCallback(() => {
    if (theme.isLocked && showUnlock) {
      onUnlock?.(theme.id);
    } else if (!theme.isLocked) {
      onSelect(theme.id);
    }
  }, [theme.isLocked, showUnlock, onUnlock, onSelect, theme.id]);

  const getThemeIcon = (type: Theme['type']) => {
    switch (type) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'colorblind': return <Eye className="w-4 h-4" />;
      case 'seasonal': return <Snowflake className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : theme.isLocked
          ? 'border-gray-300 bg-gray-50 opacity-75'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={handleSelect}
    >
      {theme.isPremium && (
        <div className="absolute top-2 right-2">
          <Crown className="w-4 h-4 text-yellow-500" />
        </div>
      )}

      {theme.isLocked && (
        <div className="absolute top-2 left-2">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {isActive && (
        <div className="absolute top-2 left-2">
          <Check className="w-4 h-4 text-blue-600" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br"
             style={{
               backgroundImage: `linear-gradient(135deg, ${theme.preview.colors[0]}, ${theme.preview.colors[1]})`
             }}>
          {getThemeIcon(theme.type)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{theme.displayName}</h3>
          <p className="text-sm text-gray-600 truncate">{theme.description}</p>
        </div>
      </div>

      {/* Color Preview */}
      <div className="flex gap-1 mb-3">
        {theme.preview.colors.slice(0, 4).map((color, index) => (
          <div
            key={index}
            className="flex-1 h-6 rounded"
            style={{ backgroundColor: color }}
            title={`Color ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          theme.type === 'premium' ? 'bg-yellow-100 text-yellow-700' :
          theme.type === 'seasonal' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {theme.type}
        </span>

        {theme.isLocked && theme.unlockCondition && (
          <span className="text-xs text-gray-500">
            {theme.unlockCondition}
          </span>
        )}
      </div>
    </div>
  );
});

ThemeCard.displayName = 'ThemeCard';

// Memoized SeasonalThemeCard component
const SeasonalThemeCard: React.FC<{
  seasonalTheme: SeasonalTheme;
  onSelect: (themeId: string) => void;
}> = memo(({ seasonalTheme, onSelect }) => {
  const getSeasonIcon = (season: SeasonalTheme['season']) => {
    switch (season) {
      case 'spring': return <Flower className="w-4 h-4" />;
      case 'summer': return <Sun className="w-4 h-4" />;
      case 'autumn': return <Leaf className="w-4 h-4" />;
      case 'winter': return <Snowflake className="w-4 h-4" />;
      case 'holiday': return <Gift className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="relative rounded-lg border-2 border-purple-300 bg-purple-50 p-4 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all duration-200"
      onClick={() => onSelect(seasonalTheme.theme.id)}
    >
      <div className="absolute top-2 right-2">
        <div className="flex items-center gap-1">
          {seasonalTheme.specialFeatures.particles && <Sparkles className="w-3 h-3 text-purple-500" />}
          {seasonalTheme.specialFeatures.exclusiveRewards && <Gift className="w-3 h-3 text-purple-500" />}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400">
          {getSeasonIcon(seasonalTheme.season)}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{seasonalTheme.name}</h3>
          <p className="text-sm text-gray-600">Limited time: {formatDate(seasonalTheme.startDate)} - {formatDate(seasonalTheme.endDate)}</p>
        </div>
      </div>

      {/* Theme preview colors */}
      <div className="flex gap-1 mb-3">
        {seasonalTheme.theme.preview.colors.slice(0, 4).map((color, index) => (
          <div
            key={index}
            className="flex-1 h-6 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="text-xs text-purple-700 font-medium">
        ✨ Seasonal Event Active
      </div>
    </div>
  );
});

SeasonalThemeCard.displayName = 'SeasonalThemeCard';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = '',
  showCustomization = true,
  showPreview = true
}) => {
  const {
    currentTheme,
    preferences,
    customizationOptions,
    availableThemes,
    seasonalThemes,
    activeSeasonalThemes,
    isDarkTheme,
    isColorblindTheme,
    setTheme,
    updatePreferences,
    updateCustomization,
    resetToDefaults
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'themes' | 'seasonal' | 'customization' | 'accessibility'>('themes');
  const [customTheme, setCustomTheme] = useState(customizationOptions);

  const handleThemeSelect = useCallback((themeId: string) => {
    setTheme(themeId);
  }, [setTheme]);

  const handleCustomThemeUnlock = useCallback((themeId: string) => {
    // This would typically show a confirmation dialog
    const success = true; // Simulated unlock success
    if (success) {
      setTheme(themeId);
    }
  }, [setTheme]);

  const handleCustomizationChange = useCallback((key: keyof ThemeCustomizationOptions, value: any) => {
    const updatedCustomization = { ...customTheme, [key]: value };
    setCustomTheme(updatedCustomization);
    updateCustomization({ [key]: value });
  }, [customTheme, updateCustomization]);

  const handleReset = useCallback(() => {
    resetToDefaults();
    setCustomTheme(customizationOptions);
  }, [resetToDefaults, customizationOptions]);

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Theme Settings</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.primary }} />
              <span className="text-sm font-medium text-blue-700">{currentTheme.displayName}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleThemeSelect(isDarkTheme ? 'light-default' : 'dark-default')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm font-medium">
              Switch to {isDarkTheme ? 'Light' : 'Dark'} Mode
            </span>
          </button>

          <button
            onClick={() => handleThemeSelect('colorblind-protanopia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isColorblindTheme
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Colorblind Mode</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'themes'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Brush className="w-4 h-4" />
            <span>Themes</span>
          </div>
        </button>

        {activeSeasonalThemes.length > 0 && (
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeTab === 'seasonal'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Seasonal</span>
              {activeSeasonalThemes.length > 0 && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeSeasonalThemes.length}
                </span>
              )}
            </div>
          </button>
        )}

        {showCustomization && (
          <button
            onClick={() => setActiveTab('customization')}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeTab === 'customization'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Customize</span>
            </div>
          </button>
        )}

        <button
          onClick={() => setActiveTab('accessibility')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'accessibility'
              ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Accessibility className="w-4 h-4" />
            <span>Accessibility</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isActive={theme.id === currentTheme.id}
                  onSelect={handleThemeSelect}
                  onUnlock={handleCustomThemeUnlock}
                  showUnlock={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Themes Tab */}
        {activeTab === 'seasonal' && (
          <div className="space-y-4">
            {activeSeasonalThemes.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active seasonal themes</p>
                <p className="text-sm text-gray-500">Check back later for special seasonal events!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSeasonalThemes.map(seasonalTheme => (
                  <SeasonalThemeCard
                    key={seasonalTheme.id}
                    seasonalTheme={seasonalTheme}
                    onSelect={handleThemeSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customization Tab */}
        {activeTab === 'customization' && showCustomization && (
          <div className="space-y-6">
            {/* Auto Theme Switching */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Auto Theme Switching</h3>
              <label className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={preferences.autoSwitch.enabled}
                  onChange={(e) => updatePreferences({
                    autoSwitch: { ...preferences.autoSwitch, enabled: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable automatic theme switching</span>
              </label>

              {preferences.autoSwitch.enabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Switch from</label>
                    <input
                      type="time"
                      value={preferences.autoSwitch.switchTime.from}
                      onChange={(e) => updatePreferences({
                        autoSwitch: {
                          ...preferences.autoSwitch,
                          switchTime: { ...preferences.autoSwitch.switchTime, from: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Switch to</label>
                    <input
                      type="time"
                      value={preferences.autoSwitch.switchTime.to}
                      onChange={(e) => updatePreferences({
                        autoSwitch: {
                          ...preferences.autoSwitch,
                          switchTime: { ...preferences.autoSwitch.switchTime, to: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Color Customization */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Customization</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color Hue ({customTheme.primaryHue}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customTheme.primaryHue}
                    onChange={(e) => handleCustomizationChange('primaryHue', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0°</span>
                    <span>360°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturation ({customTheme.saturation}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customTheme.saturation}
                    onChange={(e) => handleCustomizationChange('saturation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lightness ({customTheme.lightness}%)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={customTheme.lightness}
                    onChange={(e) => handleCustomizationChange('lightness', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Preview:</span>
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      backgroundColor: `hsl(${customTheme.primaryHue}, ${customTheme.saturation}%, ${customTheme.lightness}%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* UI Customization */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">UI Customization</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                  <select
                    value={preferences.customizations.borderRadius}
                    onChange={(e) => updatePreferences({
                      customizations: {
                        ...preferences.customizations,
                        borderRadius: e.target.value as any
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sharp">Sharp</option>
                    <option value="rounded">Rounded</option>
                    <option value="veryRounded">Very Rounded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={preferences.customizations.fontSize}
                    onChange={(e) => updatePreferences({
                      customizations: {
                        ...preferences.customizations,
                        fontSize: e.target.value as any
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extraLarge">Extra Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Accessibility Options</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.highContrast}
                    onChange={(e) => updatePreferences({
                      accessibility: { ...preferences.accessibility, highContrast: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
                    <p className="text-xs text-gray-500">Increases color contrast for better visibility</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reduceMotion}
                    onChange={(e) => updatePreferences({
                      accessibility: { ...preferences.accessibility, reduceMotion: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reduce Motion</span>
                    <p className="text-xs text-gray-500">Minimizes animations and transitions</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.largerText}
                    onChange={(e) => updatePreferences({
                      accessibility: { ...preferences.accessibility, largerText: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Larger Text</span>
                    <p className="text-xs text-gray-500">Increases font size for better readability</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.focusVisible}
                    onChange={(e) => updatePreferences({
                      accessibility: { ...preferences.accessibility, focusVisible: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Focus Indicators</span>
                    <p className="text-xs text-gray-500">Shows clear focus outlines for keyboard navigation</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Color Blindness Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Blindness Support</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Vision Type</label>
                <select
                  value={customTheme.colorBlindType}
                  onChange={(e) => handleCustomizationChange('colorBlindType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">Normal Vision</option>
                  <option value="protanopia">Protanopia (Red-blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  <option value="achromatopsia">Achromatopsia (Color-blind)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Adjusts colors to be more distinguishable for different types of color vision deficiency
                </p>
              </div>
            </div>

            {/* Sound Settings */}
            {currentTheme.sounds && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Sound Settings</h3>

                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={currentTheme.sounds.enabled}
                      onChange={(e) => {
                        // This would typically update the theme configuration
                        console.log('Toggle sounds:', e.target.checked);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable Sound Effects</span>
                      <p className="text-xs text-gray-500">Play sounds for game actions and events</p>
                    </div>
                  </label>

                  {currentTheme.sounds.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume ({Math.round(currentTheme.sounds.volume * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentTheme.sounds.volume * 100}
                        onChange={(e) => {
                          // This would typically update the theme configuration
                          console.log('Volume:', e.target.value);
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ThemeSelector);