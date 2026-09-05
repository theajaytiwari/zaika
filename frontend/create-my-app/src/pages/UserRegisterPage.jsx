import AuthPage from './AuthPage';


function UserRegisterPage() {
  

  return (
    <AuthPage

      role="User"
      action="Create your"
      title="Register"

      apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/register`}
      redirectTo="/UserDataHome"
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

export default UserRegisterPage;
