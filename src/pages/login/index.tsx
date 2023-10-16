import { useCallback, useState } from "react";

import "./index.css";
import { useLoginContext } from "../../context/login";
import { UserList } from "../../const";

const LoginPage = () => {
  const [username, setUsername] = useState("");

  const { login } = useLoginContext();

  const handleClick = useCallback(
    (name: string) => {
      // find the user
      const user = UserList.find((item) => item.username === name);
      if (user) {
        login(user);
      } else {
        alert(`The ${name} does not exist!`);
      }
    },
    [login]
  );

  return (
    <section className="login">
      <p className="login-header">Login</p>
      <input
        className="login-input"
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button className="login-button" onClick={() => handleClick(username)}>
        SUBMIT
      </button>
    </section>
  );
};

export default LoginPage;
