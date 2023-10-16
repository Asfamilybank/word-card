import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { IUser } from "../../const";

// define login context
interface ILoginContext {
  isLogin: boolean;
  user: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
}

// create a login context
const LoginContext = createContext<ILoginContext>(null as any);

// provide hook to access login context
export const useLoginContext = () => useContext(LoginContext);

// login context provider
const LoginContextRoot = ({ children }: PropsWithChildren) => {
  const [isLogin, setIsLogin] = useState(false);
  const user = useRef<ILoginContext["user"]>(null);

  const login = useCallback<ILoginContext["login"]>((value) => {
    setIsLogin(true);
    user.current = value;
  }, []);

  const logout = useCallback<ILoginContext["logout"]>(() => {
    setIsLogin(false);
    user.current = null;
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLogin, user: user.current, login, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextRoot;
