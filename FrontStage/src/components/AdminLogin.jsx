import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour appeler l'API admin
  const loginAdmin = async (username, password) => {
    try {
      console.log('Tentative de connexion en tant qu\'admin avec:', username);
      const response = await fetch('http://192.168.209.25:4000/api/admin/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: username, password }),
      });

      if (!response.ok) throw new Error('Identifiants incorrects');
      const data = await response.json();
      console.log('Réponse de l\'API admin:', data);
      if (data && data.admin) {
        return { role: 'admin', data: data.admin }; // Retourne les données de l'admin
      }
      throw new Error('Accès non autorisé');
    } catch (error) {
      console.error('Erreur de connexion admin:', error.message);
      throw new Error(error.message || 'Une erreur s\'est produite');
    }
  };

  // Fonction de gestion de la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Début du processus de connexion');
      const userData = await loginAdmin(credentials.username, credentials.password);
      if (userData) {
        console.log('Connexion admin réussie');
        onLogin(credentials.username); // Passe les informations de connexion
        navigate('/home'); // Redirige vers le tableau de bord admin
      }
    } catch (error) {
      setError(error.message || 'Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  // Fonction pour gérer les changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  };

  // Fonction pour rediriger vers la page de login
  const handleBackToLogin = () => {
    navigate('/login'); // Redirige vers la page de login
  };

  return (
    <div className="admin-login-page">
      {/* Flèche de retour */}
      <button className="back-button" onClick={handleBackToLogin}>← Retour</button>
      
      <div className="admin-login-container">
        <div className="admin-login-form">
          {/* Logo agrandi */}
          <img src="/logos.jpg" alt="Logo du site" className="logo" />
          <form onSubmit={handleLogin}>
            <div>
              <label>Nom d'utilisateur ou Téléphone :</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Entrer le nom d'utilisateur ou le téléphone"
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Entrer le mot de passe"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
