// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import Layout from "./components/layout/Layout";
import React from "react"; // Required for createElement
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={React.createElement(Component)} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
