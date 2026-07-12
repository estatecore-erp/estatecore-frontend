import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto w-full">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
