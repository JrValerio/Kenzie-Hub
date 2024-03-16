import { DefaultTemplate } from "./components/DefaultTemplate/DefaultTemplate";
import { RouterMain } from "./routers/RouterMain/RouterMain";
import { Toasts } from "./components/Toasts/Toasts";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthContext";
import { Spinner } from "react-loading-io";

function App() {
  const { loading } = useContext(AuthContext);
  const spinnerCfg = { left: "46%", transform: "translateY(146%)" };

  return (
    <>
      <DefaultTemplate>
        {loading ? <Spinner style={spinnerCfg} /> : <RouterMain />}
      </DefaultTemplate>
      <Toasts />
    </>
  );
}

export default App;
