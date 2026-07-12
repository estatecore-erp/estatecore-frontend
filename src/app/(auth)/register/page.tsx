import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm mx-auto w-full px-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
