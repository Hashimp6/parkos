import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;