import { signOut as firebaseSingOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types/auth";

interface AuthContextProps {
  authState: AuthState;
  signWithGoogle?: () => Promise<void>;
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const Authprovider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      //MONITORA AUTENTICAÇÃO
      firebaseAuth,
      (user) => {
        if (user) {
          //SE TIVER USUÁRIO
          setAuthState({
            user: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          //SE NÃO TIVER USUÁRIO
          setAuthState({
            user: null,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        //SE DER ERRO
        setAuthState({
          user: null,
          error: error.message,
          loading: false,
        });
      },
    );
    return () => unsubscribe();
    //APOS EXECUTAR PARAR DE MONITORAR
  }, []);

  const signWithGoogle = async (): Promise<void> => {
    //FUNÇÃO DE LOGIN COM GOOGLE
    setAuthState((prevState) => ({ ...prevState, loading: true })); //DEFINE QUE ESTÁ CARREGANDO
    try {
      //TENTA FAZER LOGIN
      await signInWithPopup(firebaseAuth, googleAuthProvider); //ABRE O POPUP DO GOOGLE
    } catch (error) {
      //SE DER ERRO
      const messageError = error instanceof Error ? error.message : "Erro ao tentar logar com o Google";
      //PEGA A MENSAGEM DE ERRO OU COLOCA UMA PADRÃO
      setAuthState((prevState) => ({
        //ATUALIZA O ESTADO COM O ERRO
        ...prevState, //PEGA O ESTADO ANTERIOR SEM ALTERAR
        loading: false, //DEFINE QUE NÃO ESTÁ MAIS CARREGANDO
        error: messageError, //DEFINE A MENSAGEM DE ERRO
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    //FUNÇÃO DE LOGOUT
    try {
      await firebaseSingOut(firebaseAuth);
      //FAZ LOGOUT
    } catch (error) {
      //SE DER ERRO AO FAZER LOGOUT REGISTRA O ERRO
      const messageError = error instanceof Error ? error.message : "Erro ao tentar logar com o Google";

      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
        error: messageError,
      }));
    }
  };

  return <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
};
