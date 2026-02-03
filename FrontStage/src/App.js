import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import Registration from "./components/Registration";
import "./App.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./components/Clients";
import Recettes from "./components/Recettes";
import Paiements from "./components/Paiements";
import Rapport from "./components/Rapport";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("Accueil");
  const [notifications, setNotifications] = useState([]); // Notifications
  const navigate = useNavigate();

  // Fonction de connexion pour admin ou pharmacien
  const handleLogin = (role) => {
    setAuthenticated(true);
    setCurrentTitle("Accueil");
    if (role === "admin") {
      setIsAdmin(true);
      navigate("/home");
    } else {
      setIsAdmin(false);
      navigate("/home");
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setAuthenticated(false);
    setIsAdmin(false);
    navigate("/login"); // Redirection vers la page de connexion
  };

  // Ajout de notification quand une nouvelle pharmacie est ajoutée
  const onNewPharmacyAdded = (pharmacyName) => {
    setNotifications((prevNotifications) => [
      { id: `pharmacy-${Date.now()}`, type: "pharmacie", message: `${pharmacyName} vient de s'inscrire.`, read: false },
      ...prevNotifications,
    ]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTitleChange = (title) => {
    setCurrentTitle(title);
  };

  // Mise à jour du titre de la page via useEffect
  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="content-container">
        <Routes>
          {/* Routes pour la connexion */}
          <Route path="/login" element={<Login onLogin={() => handleLogin("pharmacien")} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={() => handleLogin("admin")} />} />

          {/* Route pour l'inscription d'une nouvelle pharmacie */}
          <Route path="/registration" element={<Registration onNewPharmacyAdded={onNewPharmacyAdded} />} />

          {/* Route pour l'inscription d'une nouvelle pharmacie */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Users />} />
          <Route path="/recettes" element={<Recettes />} />
          <Route path="/paiements" element={<Paiements />} />
          <Route path="/rapport" element={<Rapport />} />

          

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? "/home" : "/home") : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
