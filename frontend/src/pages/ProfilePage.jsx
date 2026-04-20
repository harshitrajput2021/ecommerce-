import { useState, useEffect } from 'react';
import { usersApi } from '../api/users';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    usersApi
      .getProfile()
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((err) => setFetchError(err.message ?? 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileSubmitting(true);

    usersApi
      .updateProfile({ name, email })
      .then(() => setProfileSuccess(true))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 409) {
          setProfileError('Email is already in use by another account.');
        } else if (status === 400) {
          const msg = err?.response?.data?.message ?? 'Validation error. Please check your input.';
          setProfileError(msg);
        } else {
          setProfileError(err.message ?? 'Failed to update profile.');
        }
      })
      .finally(() => setProfileSubmitting(false));
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordSubmitting(true);

    usersApi
      .changePassword({ currentPassword, newPassword })
      .then(() => {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 400) {
          setPasswordError('Current password is incorrect.');
        } else {
          setPasswordError(err.message ?? 'Failed to change password.');
        }
      })
      .finally(() => setPasswordSubmitting(false));
  }

  if (loading) return <p className="page-shell">Loading profile...</p>;
  if (fetchError) return <p className="page-shell danger">Error: {fetchError}</p>;

  return (
    <div className="page-shell" style={{ maxWidth: '760px' }}>
      <header className="page-header">
        <p className="page-kicker">Account Settings</p>
        <h1 className="page-title">Profile</h1>
      </header>

      <section className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Personal Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {profileError && <p className="danger">{profileError}</p>}
          {profileSuccess && <p className="success">Profile updated successfully.</p>}
          <button type="submit" disabled={profileSubmitting} className="primary-btn">
            {profileSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="field-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="danger">{passwordError}</p>}
          {passwordSuccess && <p className="success">Password changed successfully.</p>}
          <button type="submit" disabled={passwordSubmitting} className="ghost-btn">
            {passwordSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
