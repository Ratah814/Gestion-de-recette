import { useState, useEffect } from "react";
import axios from "axios";
import { HOST_API } from "../../Global";

export default function EditModal({ isOpenModal, setOpenModal, loader, client }) {
  const [recettes, setRecettes] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    recette: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // État pour l'erreur
  const [successMessage, setSuccessMessage] = useState(""); // État pour le succès

  useEffect(() => {
    fetchRecettes();
  }, []);

  async function fetchRecettes() {
    const res = await axios.get(`${HOST_API}/recettes/`);
    setRecettes(res.data);
  }

  useEffect(() => {
    if (client) {
      setFormData({
        nom: client.nom || "",
        adresse: client.adresse || "",
        telephone: client.telephone || "",
        recette: client.recette || "",
      });
    }
  }, [client]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si tous les champs sont remplis
    if (!formData.nom || !formData.adresse || !formData.telephone || !formData.recette) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setSuccessMessage(""); // Réinitialiser le message de succès
      return;
    }

    try {
      // Envoi de la requête PUT pour mettre à jour le client
      await axios.put(`${HOST_API}/clients/${client.id}/`, formData);
      setSuccessMessage("Client modifié avec succès!");
      setErrorMessage(""); // Réinitialiser le message d'erreur
      setOpenModal(false);
      loader(); // Recharger la liste des clients
    } catch (error) {
      console.error("Erreur lors de la modification:", error.response ? error.response.data : error.message);
      setErrorMessage("Erreur lors de la modification du client.");
      setSuccessMessage(""); // Réinitialiser le message de succès
    }
  };

  if (!isOpenModal) return null;

  return (
    <div
      className="position-absolute d-flex justify-content-center align-items-center text-start start-0 top-0 w-100 h-100"
      style={{ background: "#444444ae" }}
    >
      <div className="rounded bg-white w-25">
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center pb-4">
            <h1 className="modal-title fs-5">Modifier client</h1>
            <button type="button" className="btn btn-close" onClick={() => setOpenModal(false)}></button>
          </div>
          <div>
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
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  id="nom"
                  defaultValue={client.nom}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="adresse">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  id="adresse"
                  defaultValue={client.adresse}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telephone">Tel</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telephone"
                  defaultValue={client.telephone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="recette">Recette</label>
                <select
                  className="form-control"
                  id="recette"
                  defaultValue={client.recette}
                  onChange={handleChange}
                >
                  {recettes.map(({ nom_recette, id }) => (
                    <option value={id} key={id}>
                      {nom_recette}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button type="submit" className="btn btn-dark mb-1">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setOpenModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
