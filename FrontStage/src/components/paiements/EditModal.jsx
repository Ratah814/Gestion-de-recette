import React, { useState, useEffect } from "react";
import axios from "axios";
import { HOST_API } from "../../Global";

const EditModal = ({ isOpen, setIsOpen, paiementId, fetchPaiements }) => {
  const [paiement, setPaiement] = useState({
    montant_a_payer: "",
    date_paiement: "",
    client: "",
    recette: "",
  });
  const [clients, setClients] = useState([]);
  const [recettes, setRecettes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès

  useEffect(() => {
    if (paiementId) {
      // Récupérer les détails du paiement
      axios.get(`${HOST_API}/paiements/${paiementId}/`).then((response) => {
        setPaiement(response.data);
      });
    }

    // Récupérer les listes de clients et recettes
    axios.get(`${HOST_API}/clients/`).then((response) => setClients(response.data));
    axios.get(`${HOST_API}/recettes/`).then((response) => setRecettes(response.data));
  }, [paiementId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mettre à jour le paiement
    axios
      .put(`${HOST_API}/paiements/${paiementId}/`, paiement)
      .then(() => {
        setSuccessMessage("Paiement modifié avec succès!"); // Message de succès
        setErrorMessage(""); // Réinitialiser l'erreur
        fetchPaiements(); // Recharger les paiements après la modification
        setIsOpen(false); // Fermer le modal
      })
      .catch((error) => {
        console.error("Erreur de mise à jour:", error);
        setErrorMessage("Erreur lors de la modification du paiement."); // Message d'erreur
        setSuccessMessage(""); // Réinitialiser le succès
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaiement((prevPaiement) => ({
      ...prevPaiement,
      [name]: value,
    }));
  };

  return (
    isOpen && (
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier Paiement</h5>
              <button
                type="button"
                className="close"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Message d'erreur */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* Message de succès */}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="montant_a_payer" className="form-label">
                    Montant à payer
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="montant_a_payer"
                    name="montant_a_payer"
                    value={paiement.montant_a_payer}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="date_paiement" className="form-label">
                    Date de paiement
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date_paiement"
                    name="date_paiement"
                    value={paiement.date_paiement || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="client" className="form-label">
                    Client
                  </label>
                  <select
                    className="form-control"
                    id="client"
                    name="client"
                    value={paiement.client}
                    onChange={handleChange}
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="recette" className="form-label">
                    Recette
                  </label>
                  <select
                    className="form-control"
                    id="recette"
                    name="recette"
                    value={paiement.recette}
                    onChange={handleChange}
                  >
                    {recettes.map((recette) => (
                      <option key={recette.id} value={recette.id}>
                        {recette.nom_recette}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  Sauvegarder
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default EditModal;
