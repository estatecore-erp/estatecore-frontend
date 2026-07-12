import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm mx-auto w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
