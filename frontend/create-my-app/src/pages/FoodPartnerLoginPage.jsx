import AuthPage from './AuthPage';

function FoodPartnerLoginPage() {
  return (
    <AuthPage
      role="Food Partner"
      action="Manage your"
      title="Login"


      apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/auth/food-partner/login`}
      redirectTo="/FoodHome"
      
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

export default FoodPartnerLoginPage;
