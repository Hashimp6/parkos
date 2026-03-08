import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import { CompanyProvider } from "./context/CompanyContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CompanyProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </CompanyProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;