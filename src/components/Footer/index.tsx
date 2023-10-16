import { useCallback } from "react";
import "./index.css";
import { useLoginContext } from "../../context/login";
import useLocalStorage from "../../hooks/useLocalStorage";
import { defaultCardList } from "../../pages/card";

const Footer = () => {
  const [_, setList] = useLocalStorage("list");
  const { logout } = useLoginContext();

  const handleClick = useCallback(() => {
    logout();
    setList(defaultCardList);
  }, [logout, setList]);

  return (
    <div className="footer">
      <button onClick={handleClick}>Logout and Reset</button>
      <p>唐港钞</p>
      <p>+86 186 1683 1197</p>
      <p>gangchao.tang@gmail.com</p>
    </div>
  );
};

export default Footer;
