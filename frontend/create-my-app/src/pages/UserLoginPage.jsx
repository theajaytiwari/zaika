import AuthPage from './AuthPage';
import { getApiUrl } from '../api/config';

function UserLoginPage() {
  return (
    <AuthPage
      role="User"
      action="Welcome back to"
      title="Login"

       apiEndpoint={getApiUrl('/auth/user/login')}
       redirectTo="/UserDataHome"
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

export default UserLoginPage;
