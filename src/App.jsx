import { DefaultTemplate } from "./components/DefaultTemplate/DefaultTemplate";
import { RouterMain } from "./routers/RouterMain/RouterMain";
import { Toasts } from "./components/Toasts/Toasts";
import { Spinner } from "react-loading-io";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { loading } = useAuth();
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
