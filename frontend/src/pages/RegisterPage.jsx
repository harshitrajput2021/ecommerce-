import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth'; // to be created in task 4.3

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the field error when the user starts typing again
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 400 && data?.fieldErrors) {
        setFieldErrors(data.fieldErrors);
      } else if (status === 409) {
        setGeneralError(data?.message || 'An account with this email already exists.');
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-kicker">ecommerce website</p>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join and start building your curated cart.</p>

        {generalError && <p className="auth-error" role="alert">{generalError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
            {fieldErrors.name && <span className="field-error" role="alert">{fieldErrors.name}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
            {fieldErrors.email && <span className="field-error" role="alert">{fieldErrors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
            {fieldErrors.password && <span className="field-error" role="alert">{fieldErrors.password}</span>}
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

