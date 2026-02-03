import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = ({ onNewPharmacyAdded }) => {
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  const generateMatricule = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    setMatricule(generateMatricule());
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Le mot de passe ne correspond pas.');
      setLoading(false);
      setError(true);
      return;
    }

    if (!name || !prenom || !adresse || !email || !phone || !password || !confirmPassword) {
      toast.error('Veuillez remplir correctement tous les champs.');
      setLoading(false);
      setError(true);
      return;
    }

    if (phone.length !== 10) {
      setPhoneError('Le numéro de téléphone doit comporter exactement 10 chiffres.');
      setLoading(false);
      setError(true);
      return;
    } else {
      setPhoneError('');
    }

    const pharmacieData = { nom: name, prenom, adresse, email, telephone: phone, matricule, password };

    try {
      toast.success('Inscription réussie !');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Une erreur est survenue, veuillez réessayer.');
      setLoading(false);
      setError(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const lengthValid = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    setIsPasswordValid(lengthValid && hasNumber && hasSpecialChar);
    setPasswordStrength(lengthValid ? (value.length >= 12 ? 'Perfect' : value.length >= 10 ? 'Excellent' : 'Good') : '');
  };

  return (
    <div className="registration-page">
      <ToastContainer />
      <div className="registration-container">
        <form onSubmit={handleRegistration}>
          <h2>Veuillez créer un compte</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" required />
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" required />
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" required />
          {phoneError && <p className="error-message">{phoneError}</p>}
          <input type="password" value={password} onChange={handlePasswordChange} placeholder="Mot de passe" required />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer le mot de passe" required />
          <input type="text" value={matricule} readOnly />
          <button type="submit">Créer un compte</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;