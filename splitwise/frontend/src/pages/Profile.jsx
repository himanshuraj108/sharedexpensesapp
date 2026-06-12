import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api';
import { SplitwiseLogoMark } from '../components/SplitwiseLogo';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Basic Account States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [password, setPassword] = useState('');

  // Dropdown States
  const [currency, setCurrency] = useState(user?.default_currency || 'USD');
  const [timezone, setTimezone] = useState(user?.time_zone || '(GMT+05:30) Chennai');
  const [language, setLanguage] = useState(user?.language || 'English');

  // Inline Edit Toggles
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Avatar Upload States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Notifications Checkbox States
  const [notifications, setNotifications] = useState({
    groupAdd: true,
    friendAdd: true,
    expenseAdd: true,
    expenseEdit: true,
    expenseComment: true,
    expenseDue: false,
    payMe: true,
    monthlySummary: true,
    newsUpdates: false,
    tips: false,
  });

  // Privacy tab state
  const [activePrivacyTab, setActivePrivacyTab] = useState('apps');
  const [allowSuggestFriend, setAllowSuggestFriend] = useState(true);

  // Sync user details when auth loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
      setCurrency(user.default_currency || 'USD');
      setTimezone(user.time_zone || '(GMT+05:30) Chennai');
      setLanguage(user.language || 'English');
    }
  }, [user]);

  // Handle saving of individual inline text fields
  const handleFieldSave = async (field, value, setEditing) => {
    if (!value.trim()) {
      toast.error('Field cannot be empty');
      return;
    }
    try {
      const payload = { [field]: value.trim() };
      const res = await authAPI.updateMe(payload);
      updateUser(res.data);
      toast.success('Field updated successfully!');
      setEditing(false);
    } catch {
      toast.error('Failed to update field');
    }
  };

  // Handle password saving
  const handlePasswordSave = async () => {
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await authAPI.updateMe({ password });
      toast.success('Password updated successfully!');
      setPassword('');
      setEditingPassword(false);
    } catch {
      toast.error('Failed to update password');
    }
  };

  // Save the right-hand column options (Currency, Timezone, Language)
  const handleSaveDropdowns = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateMe({
        default_currency: currency,
        time_zone: timezone,
        language: language,
      });
      updateUser(res.data);
      toast.success('Account preferences saved! ⚙️');
    } catch {
      toast.error('Failed to save account preferences');
    }
  };

  // Save Notification Preferences
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success('Notification preferences saved! ✉️');
  };

  // Save Privacy Preferences
  const handleSavePrivacy = (e) => {
    e.preventDefault();
    toast.success('Privacy settings saved! 🔒');
  };

  // Save Advanced Features
  const handleSaveAdvanced = (e) => {
    e.preventDefault();
    toast.success('Advanced settings saved! 🚀');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="profile-container fade-in">
      
      {/* SECTION 1: YOUR ACCOUNT */}
      <div className="profile-section">
        <h2 className="profile-section-title">Your account</h2>
        
        <div className="profile-row">
          {/* Left: Avatar Upload */}
          <div className="profile-left">
            <div className="profile-avatar-box">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                />
              ) : (
                <div className="avatar-initials-placeholder" style={{ background: user?.avatar_color || '#5BC5A7' }}>
                  {initials}
                </div>
              )}
            </div>
            <div className="profile-avatar-upload">
              <span className="avatar-upload-lbl">Change your avatar</span>
              <div className="avatar-upload-input-wrap">
                <input 
                  type="file" 
                  id="profile-avatar-input" 
                  style={{ display: 'none' }} 
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="profile-file-btn"
                  onClick={() => document.getElementById('profile-avatar-input').click()}
                >
                  Choose File
                </button>
                {!avatarFile && <span className="profile-file-txt">No file chosen</span>}
              </div>
            </div>
          </div>

          {/* Middle: Name, Email, Phone, Password fields */}
          <div className="profile-middle">
            {/* Name */}
            <div className="account-detail-field">
              <span className="account-detail-lbl">Your name</span>
              {editingName ? (
                <div className="edit-input-group">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="profile-inline-input"
                    required
                  />
                  <div className="edit-btn-row">
                    <button type="button" className="btn btn-teal btn-sm" onClick={() => handleFieldSave('name', name, setEditingName)}>Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => { setName(user?.name || ''); setEditingName(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="account-detail-val-row">
                  <span className="account-detail-val">{user?.name}</span>
                  <button type="button" className="edit-link" onClick={() => setEditingName(true)}>Edit</button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="account-detail-field">
              <span className="account-detail-lbl">Your email address</span>
              {editingEmail ? (
                <div className="edit-input-group">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="profile-inline-input"
                    required
                  />
                  <div className="edit-btn-row">
                    <button type="button" className="btn btn-teal btn-sm" onClick={() => handleFieldSave('email', email, setEditingEmail)}>Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEmail(user?.email || ''); setEditingEmail(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="account-detail-val-row">
                  <span className="account-detail-val">{user?.email}</span>
                  <button type="button" className="edit-link" onClick={() => setEditingEmail(true)}>Edit</button>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="account-detail-field">
              <span className="account-detail-lbl">Your phone number</span>
              {editingPhone ? (
                <div className="edit-input-group">
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="profile-inline-input"
                  />
                  <div className="edit-btn-row">
                    <button type="button" className="btn btn-teal btn-sm" onClick={() => handleFieldSave('phone_number', phone, setEditingPhone)}>Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => { setPhone(user?.phone_number || ''); setEditingPhone(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="account-detail-val-row">
                  <span className="account-detail-val">{user?.phone_number || 'None'}</span>
                  <button type="button" className="edit-link" onClick={() => setEditingPhone(true)}>Edit</button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="account-detail-field">
              <span className="account-detail-lbl">Your password</span>
              {editingPassword ? (
                <div className="edit-input-group">
                  <input 
                    type="password" 
                    value={password} 
                    placeholder="New password" 
                    onChange={e => setPassword(e.target.value)} 
                    className="profile-inline-input"
                    required
                  />
                  <div className="edit-btn-row">
                    <button type="button" className="btn btn-teal btn-sm" onClick={handlePasswordSave}>Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => { setPassword(''); setEditingPassword(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="account-detail-val-row">
                  <span className="account-detail-val">**********</span>
                  <button type="button" className="edit-link" onClick={() => setEditingPassword(true)}>Edit</button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preferences, Google connection, Ad and Save */}
          <div className="profile-right">
            <form onSubmit={handleSaveDropdowns} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="dropdown-field">
                <span className="dropdown-lbl">Your default currency</span>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="settings-dropdown">
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>

              <div className="dropdown-field">
                <span className="dropdown-lbl">Your time zone</span>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="settings-dropdown">
                  <option value="(GMT+05:30) Chennai">(GMT+05:30) Chennai</option>
                  <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                  <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                  <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                  <option value="(GMT+01:00) Central European Time">(GMT+01:00) Central European Time</option>
                </select>
              </div>

              <div className="dropdown-field">
                <span className="dropdown-lbl">Language</span>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="settings-dropdown">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div className="google-conn-box">
                <span className="google-conn-text">You are connected with Google.</span>
                <button type="button" className="disconnect-btn">Disconnect your external accounts</button>
              </div>

              {/* Splitwise Pro promo ad */}
              <div className="pro-ad-box">
                <div className="pro-ad-header">
                  <span className="pro-ad-title">GET SPLITWISE PRO!</span>
                </div>
                <p className="pro-ad-body">
                  Subscribe to Splitwise Pro for charts, search, an ad-free experience, and more!
                </p>
                <button type="button" className="pro-ad-btn" onClick={() => navigate('/subscriptions/new')}>Get Splitwise Pro!</button>
              </div>

              <button type="submit" className="settings-save-btn">Save</button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 2: NOTIFICATIONS */}
      <div className="profile-section">
        <h2 className="profile-section-title">Notifications</h2>
        <form onSubmit={handleSaveNotifications}>
          <div className="notifications-grid">
            {/* Column 1: Groups and Friends */}
            <div className="notifications-col">
              <span className="notifications-col-title">Groups and friends</span>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.groupAdd} 
                  onChange={e => setNotifications(prev => ({ ...prev, groupAdd: e.target.checked }))}
                />
                <span className="checkbox-text">When someone adds me to a group</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.friendAdd} 
                  onChange={e => setNotifications(prev => ({ ...prev, friendAdd: e.target.checked }))}
                />
                <span className="checkbox-text">When someone adds me as a friend</span>
              </label>
            </div>

            {/* Column 2: Expenses */}
            <div className="notifications-col">
              <span className="notifications-col-title">Expenses</span>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.expenseAdd} 
                  onChange={e => setNotifications(prev => ({ ...prev, expenseAdd: e.target.checked }))}
                />
                <span className="checkbox-text">When an expense is added</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.expenseEdit} 
                  onChange={e => setNotifications(prev => ({ ...prev, expenseEdit: e.target.checked }))}
                />
                <span className="checkbox-text">When an expense is edited/deleted</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.expenseComment} 
                  onChange={e => setNotifications(prev => ({ ...prev, expenseComment: e.target.checked }))}
                />
                <span className="checkbox-text">When someone comments on an expense</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.expenseDue} 
                  onChange={e => setNotifications(prev => ({ ...prev, expenseDue: e.target.checked }))}
                />
                <span className="checkbox-text">When an expense is due</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.payMe} 
                  onChange={e => setNotifications(prev => ({ ...prev, payMe: e.target.checked }))}
                />
                <span className="checkbox-text">When someone pays me</span>
              </label>
            </div>

            {/* Column 3: News and Updates */}
            <div className="notifications-col">
              <span className="notifications-col-title">News and updates</span>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.monthlySummary} 
                  onChange={e => setNotifications(prev => ({ ...prev, monthlySummary: e.target.checked }))}
                />
                <span className="checkbox-text">Monthly summary of my activity</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.newsUpdates} 
                  onChange={e => setNotifications(prev => ({ ...prev, newsUpdates: e.target.checked }))}
                />
                <span className="checkbox-text">Major Splitwise news and updates</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={notifications.tips} 
                  onChange={e => setNotifications(prev => ({ ...prev, tips: e.target.checked }))}
                />
                <span className="checkbox-text">Updates and tips to get the most out of Splitwise</span>
              </label>
            </div>
          </div>
          <button type="submit" className="settings-save-btn" style={{ marginTop: 24 }}>Save</button>
        </form>
      </div>

      {/* SECTION 3: PRIVACY & SECURITY */}
      <div className="profile-section">
        <h2 className="profile-section-title">Privacy & Security</h2>
        
        <div className="privacy-tabs-row">
          <button 
            type="button" 
            className={`privacy-tab ${activePrivacyTab === 'apps' ? 'active' : ''}`}
            onClick={() => setActivePrivacyTab('apps')}
          >
            Your apps
          </button>
          <button 
            type="button" 
            className={`privacy-tab ${activePrivacyTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActivePrivacyTab('visits')}
          >
            Recent visits
          </button>
          <button 
            type="button" 
            className={`privacy-tab ${activePrivacyTab === 'logout' ? 'active' : ''}`}
            onClick={() => setActivePrivacyTab('logout')}
          >
            Log out on all devices
          </button>
          <button 
            type="button" 
            className={`privacy-tab ${activePrivacyTab === 'blocklist' ? 'active' : ''}`}
            onClick={() => setActivePrivacyTab('blocklist')}
          >
            Manage your blocklist
          </button>
        </div>

        <form onSubmit={handleSavePrivacy} style={{ marginTop: 20 }}>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={allowSuggestFriend} 
              onChange={e => setAllowSuggestFriend(e.target.checked)} 
            />
            <span className="checkbox-text">
              Allow Splitwise to suggest me as a friend to other users
            </span>
          </label>
          <p className="privacy-subtext">
            Splitwise will only recommend you to users who already have your email address or phone number in their phone's contact book.
          </p>
          <button type="submit" className="settings-save-btn" style={{ marginTop: 24 }}>Save</button>
        </form>
      </div>

      {/* SECTION 4: ADVANCED FEATURES */}
      <div className="profile-section" style={{ borderBottom: 'none' }}>
        <h2 className="profile-section-title">Advanced features</h2>
        <p className="advanced-subtext">
          Most users don't need these features - but here they are in case you do!
        </p>

        <form onSubmit={handleSaveAdvanced}>
          <div className="advanced-btn-row">
            <button type="button" className="btn-pro-green" onClick={() => navigate('/subscriptions/new')}>Get Splitwise Pro!</button>
            <button type="button" className="btn-merge-gray">Merge with another account</button>
            <button type="button" className="btn-close-red">Close your account</button>
          </div>
          <button type="submit" className="settings-save-btn" style={{ marginTop: 24 }}>Save</button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="profile-footer">
        <div className="footer-made-in">Made with ♥ in Providence, RI, USA</div>
        <div className="footer-copyright">Copyright © 2026 Splitwise, Inc. All rights reserved.</div>
        <div className="footer-links">
          <span className="footer-link">About</span> • 
          <span className="footer-link">Jobs</span> • 
          <span className="footer-link">Calculators</span> • 
          <span className="footer-link">Blog</span> • 
          <span className="footer-link">Terms</span> • 
          <span className="footer-link">Press</span> • 
          <span className="footer-link">API</span> • 
          <span className="footer-link">Contact us</span>
        </div>
      </footer>

    </div>
  );
}
