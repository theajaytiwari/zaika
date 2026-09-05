import AuthPage from './AuthPage';

function FoodPartnerRegisterPage() {
  return (
    <AuthPage
      role="Food Partner"
      action="Grow your"
      title="Register"

       apiEndpoint="https://zaika-lm4j.onrender.com/api/auth/food-partner/register"
        redirectTo="/FoodHome"
      subtitle="Create your partner profile to manage menu updates, orders, and delivery opportunities with ease."
            fields={[
        { label: 'Restaurant name', name: 'restaurantName', placeholder: 'Green Bowl Kitchen' },
        { label: 'Owner name', name: 'ownerName', placeholder: 'Priya Shah' },
        { label: 'Business email', name: 'email', type: 'email', placeholder: 'hello@greenbowl.com' },
        { label: 'Address', name: 'address', placeholder: '123 MG Road, Bhopal' },
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

export default FoodPartnerRegisterPage;
