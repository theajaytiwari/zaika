import '../styles/theme.css';
import '../styles/auth.css';
import axios from "axios";
import { useState } from "react";
import { useNavigate  } from 'react-router-dom';


function AuthPage({
  role,
  action,
  title,
  subtitle,
  fields,
  showRememberMe,
  rememberLabel,
  forgotPasswordText,
  primaryButtonLabel,
  footerText,
  footerLinkLabel,
  footerLink,
  footerLinkText,
  apiEndpoint,
  redirectTo,
  switchLinks = [],
}) {
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      apiEndpoint,
      formData,
      {
        withCredentials: true
      }
    );

    console.log(response.data);

    navigate(redirectTo);

  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className="auth-shell">
      <div className="auth-surface">
        <div className="auth-visual">
          <div className="brand-badge">{role}</div>

          <div className="auth-caption">
            <h1>
              {action}
              <span>{role}</span>
            </h1>
            <p>{subtitle}</p>
          </div>

          <ul className="feature-list">
            <li>Simple onboarding with a clean daily workflow.</li>
            <li>Create an account in minutes and stay organized.</li>
            <li>Designed for smooth access on mobile and desktop.</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-kicker">{role} {action}</span>
            <h2>{title}</h2>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <label key={field.name} className="field-group">
                <span>{field.label}</span>
                <input
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                  setFormData({
            ...formData,
            [field.name]: e.target.value
        })
    }
/>
              </label>
            ))}

            {showRememberMe && (
              <div className="inline-options">
                <label className="check-toggle">
                  <input type="checkbox" />
                  <span>{rememberLabel}</span>
                </label>

                <a href="#" className="link-button">
                  {forgotPasswordText}
                </a>
              </div>
            )}

            <button type="submit" className="primary-btn">
              {primaryButtonLabel}
            </button>

            {footerText && (
              <p className="support-copy">
                {footerText}
              </p>
            )}
          </form>

          {switchLinks.length > 0 && (
            <div className="auth-type-links">
              {switchLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className={`type-link ${link.active ? 'active' : ''}`}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <p className="auth-switch">
            {footerLinkLabel}{' '}
            <a href={footerLink}>{footerLinkText}</a>
          </p>
        </div>
      </div>
    </div>
  );

};
export function UserRegisterPage() {
  return (
    <AuthPage
      role="User"
      action="Create your"
      title="Register"
      subtitle="Join with your personal account to discover meals, favorites, and seamless ordering experiences."
      fields={[
        { label: 'Full name', name: 'fullName', placeholder: 'Alex Morgan' },
        { label: 'Email address', name: 'email', type: 'email', placeholder: 'alex@email.com' },
        { label: 'Phone number', name: 'phoneNumber', type: 'tel', placeholder: '+1 (555) 234-9876' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a strong password' },
      ]}
      showRememberMe={false}
      primaryButtonLabel="Create account"
      footerText="By continuing, you agree to our terms and privacy policy."
      footerLinkLabel="Already have an account?"
      footerLink="/user/login"
      footerLinkText="Log in"
      switchLinks={[
        { label: 'Register as normal user', to: '/user/register', active: true },
        { label: 'Register as food partner', to: '/food-partner/register', active: false },
      ]}
    />
  );
}

export function UserLoginPage() {
  return (
    <AuthPage
      role="User"
      action="Welcome back to"
      title="Login"
      subtitle="Access your saved preferences, recent orders, and favorite dining moments in one place."
      fields={[
        { label: 'Email address', name: 'email', type: 'email', placeholder: 'alex@email.com' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
      ]}
      showRememberMe={true}
      rememberLabel="Remember me"
      forgotPasswordText="Forgot?"
      primaryButtonLabel="Log in"
      footerLinkLabel="New here?"
      footerLink="/user/register"
      footerLinkText="Create account"
      switchLinks={[
        { label: 'Login as normal user', to: '/user/login', active: true },
        { label: 'Login as food partner', to: '/food-partner/login', active: false },
      ]}
    />
  );
}

export function FoodPartnerRegisterPage() {
  return (
    <AuthPage
      role="Food Partner"
      action="Grow your"
      title="Register"
      subtitle="Create your partner profile to manage menu updates, orders, and delivery opportunities with ease."
      fields={[
        { label: 'Restaurant name', name: 'restaurantName', placeholder: 'Green Bowl Kitchen' },
        { label: 'Owner name', name: 'ownerName', placeholder: 'Priya Shah' },
        { label: 'Business email', name: 'email', type: 'email', placeholder: 'hello@greenbowl.com' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a secure password' },
      ]}
      showRememberMe={false}
      primaryButtonLabel="Create partner account"
      footerText="Perfect for restaurants, cafes, and cloud kitchens looking to expand reach."
      footerLinkLabel="Already partnered with us?"
      footerLink="/food-partner/login"
      footerLinkText="Log in"
      switchLinks={[
        { label: 'Register as normal user', to: '/user/register', active: false },
        { label: 'Register as food partner', to: '/food-partner/register', active: true },
      ]}
    />
  );
}

export function FoodPartnerLoginPage() {
  return (
    <AuthPage
      role="Food Partner"
      action="Manage your"
      title="Login"
      subtitle="Review your menu, track orders, and stay connected with customers through a simple dashboard."
      fields={[
        { label: 'Business email', name: 'email', type: 'email', placeholder: 'hello@greenbowl.com' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
      ]}
      showRememberMe={true}
      rememberLabel="Keep me signed in"
      forgotPasswordText="Reset"
      primaryButtonLabel="Log in to dashboard"
      footerLinkLabel="Need an account?"
      footerLink="/food-partner/register"
      footerLinkText="Register"
      switchLinks={[
        { label: 'Login as normal user', to: '/user/login', active: false },
        { label: 'Login as food partner', to: '/food-partner/login', active: true },
      ]}
    />
  );
}

export default AuthPage;
