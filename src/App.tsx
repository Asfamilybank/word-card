import "./App.css";
import Footer from "./components/Footer";
import { useLoginContext } from "./context/login";
import CardPage from "./pages/card";
import LoginPage from "./pages/login";

function App() {
  const { isLogin } = useLoginContext();

  return (
    <main className="app">
      <section className="app-main">
        {isLogin ? <CardPage /> : <LoginPage />}
      </section>
      <Footer />
    </main>
  );
}

export default App;
