import { useEffect } from "react";
import { useNavigate } from "react-router";
import ButtonGoogle from "../components/ButtonGoogle";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { signWithGoogle, authState } = useAuth();

  const handleLogin = async () => {
    try {
      await signWithGoogle?.();
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate("/dashboard");
    }
  }, [authState.user, authState.loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl border border-gray-700">
        <header>
          <h1 className="text-center text-3xl font-extrabold text-primary-500">
            DevBills
          </h1>
          <p className="text-center mt-2 text-sm">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </header>

        <main className="mt-8 py-4 px-4 shadow-md rounded-lg sm:px-10 space-y-6 ">
          <section className="text-center ">
            <h2 className="text-lg">Faça login para continuar</h2>
            <p className="text-sm mt-1">
              Acesse sua conta para começar a gerenciar suas finanças
            </p>
          </section>

          <ButtonGoogle onClick={handleLogin} isLoading={false} />

          {authState.error && (
            <p className="text-red-600/80 text-sm text-center mt-4">
              {authState.error} Erro no sistema, tente novmente.
            </p>
          )}

          <footer className="text-center text-xs text-gray-400 mt-6">
            <p>
              Ao fazer login, você concorda com nossos termos de uso e política
              de privacidade.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
export default Login;
