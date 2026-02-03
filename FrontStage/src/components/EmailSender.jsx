import { useState } from "react";
import axios from "axios";

export default function EmailSender() {
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [destinataire, setDestinataire] = useState("");

  const envoyerEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/envoyer_email/", {
        sujet,
        message,
        destinataire,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };

  return (
    <div className="card p-4">
      <h2>📧 Envoyer un Email</h2>
      <form onSubmit={envoyerEmail}>
        <input type="email" placeholder="Destinataire" onChange={(e) => setDestinataire(e.target.value)} required />
        <input type="text" placeholder="Sujet" onChange={(e) => setSujet(e.target.value)} required />
        <textarea placeholder="Message" onChange={(e) => setMessage(e.target.value)} required />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}
