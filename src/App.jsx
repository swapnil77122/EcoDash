// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import routes from "./routes";
import "./index.css";


const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4">
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
