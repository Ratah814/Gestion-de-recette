import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour l'animation de chargement
  const navigate = useNavigate();

  // Fonction pour appeler l'API de connexion et valider le pharmacien
  const loginPharmacien = async (email, password) => {
    try {
      console.log("Tentative de connexion avec les identifiants :", email, password);

      // Validation côté frontend avant envoi des données
      if (!email || !password) {
        console.error("Erreur : Tous les champs sont requis");
        throw new Error("Tous les champs sont requis");
      }

      // Préparer la requête
      const requestPayload = { emailOrPhone: email, password };
      console.log("Données envoyées au backend :", JSON.stringify(requestPayload));

      // Effectuer la requête POST à l'API backend
      const response = await fetch("http://192.168.209.25:4000/api/comptepharmacie/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      // Log de la réponse brute du backend
      console.log("Réponse brute du backend:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du backend :", errorData);
        throw new Error(errorData.message || "Identifiants incorrects");
      }

      // Récupérer la réponse et vérifier si un utilisateur est retourné
      const data = await response.json();
      console.log("Réponse après traitement :", data);

      // Vérifier si l'utilisateur existe dans la réponse
      if (data && data.token) {
        console.log("Connexion réussie, utilisateur trouvé :", data.user);

        // Stocker le token JWT dans le localStorage
        localStorage.setItem("authToken", data.token); // Stocker le token JWT

        // Stocker l'ID utilisateur et d'autres informations utiles dans le localStorage
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.email);
        localStorage.setItem("userPhone", data.user.telephone);
        localStorage.setItem("userMatricule", data.user.matricule);
        localStorage.setItem("userPharmacyName", data.user.nomPharmacie);

        // Gérer la navigation et l'état de la connexion réussie
        return true; // Connexion réussie
      } else {
        console.error("Aucune donnée retournée pour l'utilisateur.");
        throw new Error("Utilisateur non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      throw new Error(error.message || "Une erreur s'est produite lors de la connexion");
    }
  };

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    if (e.target.email.value === "regisseur@gmail.com") {
      navigate("/clients");
      localStorage.setItem("role", "r");
      return;
    }
    if (e.target.email.value === "percepteur@gmail.com") {
      localStorage.setItem("role", "p");
      navigate("/clients");
      return;
    }
    setError("");
    setLoginSuccess(false);

    console.log("Tentative de connexion à l'application");
  };

  // Fonction pour gérer les changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  // Fonction pour gérer l'inscription
  const handleRegister = () => {
    console.log("Redirection vers la page d'inscription");
    navigate("/registration");
  };

  // Fonction pour rediriger vers la page AdminLogin avec un spinner
  const handleAdminRedirect = async () => {
    setIsLoading(true); // Afficher le spinner de chargement
    console.log("Redirection vers la page AdminLogin");
    setTimeout(() => {
      navigate("/admin-login"); // Rediriger vers la page de connexion admin
      setIsLoading(false); // Cacher le spinner après la redirection
    }, 1000); // Attendre 1 seconde pour l'animation de chargement
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className={`login-form ${loginSuccess ? "success" : ""}`}>
          <img src="/logos.jpg" alt="Logo du site" className="logo" />
          <form onSubmit={handleLogin}>
            <div>
              <label>email :</label>
              <input type="text" name="email" value={credentials.email} onChange={handleChange} placeholder="Entrer le nom d'utilisateur ou le téléphone" />
            </div>
            <div>
              <label>Mot de passe :</label>
              <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Entrer le mot de passe" />
            </div>
            {error && <p className="error-message">{error}</p>}
            {loginSuccess && <p className="success-message">Connexion réussie !</p>}
            <button type="submit" className="my-2">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
