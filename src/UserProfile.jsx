import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export function UserProfile() {
  const { user, logout, updatePreferences } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
    favoriteCuisines: user?.preferences?.favoriteCuisines || [],
    allergies: user?.preferences?.allergies || []
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const togglePreference = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const savePreferences = () => {
    updatePreferences(preferences);
    setShowSettings(false);
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
  const cuisineOptions = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'Indian', 'American', 'French', 'Thai', 'Chinese', 'Japanese'];
  const allergyOptions = ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'];

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <button
        className="user-profile-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="user-avatar">
          {getInitials(user.name)}
        </div>
        <span>{user.name}</span>
        <ChevronDown size={18} />
      </button>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <div className="profile-menu">
            <button
              className="profile-menu-item"
              onClick={() => {
                setShowSettings(true);
                setShowDropdown(false);
              }}
            >
              <Settings size={18} />
              Preferences
            </button>
            <button
              className="profile-menu-item logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Preferences</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <h3>Dietary Restrictions</h3>
                <div className="preference-options">
                  {dietaryOptions.map(option => (
                    <button
                      key={option}
                      className={`preference-tag ${
                        preferences.dietaryRestrictions.includes(option) ? 'selected' : ''
                      }`}
                      onClick={() => togglePreference('dietaryRestrictions', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h3>Favorite Cuisines</h3>
                <div className="preference-options">
                  {cuisineOptions.map(option => (
                    <button
                      key={option}
                      className={`preference-tag ${
                        preferences.favoriteCuisines.includes(option) ? 'selected' : ''
                      }`}
                      onClick={() => togglePreference('favoriteCuisines', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h3>Allergies</h3>
                <div className="preference-options">
                  {allergyOptions.map(option => (
                    <button
                      key={option}
                      className={`preference-tag ${
                        preferences.allergies.includes(option) ? 'selected' : ''
                      }`}
                      onClick={() => togglePreference('allergies', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={savePreferences} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
