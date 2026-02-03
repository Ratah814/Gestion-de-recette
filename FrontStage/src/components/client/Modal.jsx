import axios from "axios";
import { useState, useEffect } from "react";
import { HOST_API } from "../../Global";

export default function Modal({ isOpenModal, setOpenModal, loader }) {
  const [recettes, setRecettes] = useState([]);
  const [client, setClient] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
  const [formError, setFormError] = useState(""); // Message d'erreur pour validation du formulaire

  useEffect(() => {
    fetchRecettes();
  }, []);

  async function fetchRecettes() {
    try {
      const res = await axios.get(`${HOST_API}/recettes/`);
      setRecettes(res.data);
    } catch (error) {
      setErrorMessage("Erreur de chargement des recettes.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Vérifier si tous les champs sont remplis
    if (!client.nom || !client.adresse || !client.telephone || !client.recette) {
      setFormError("Veuillez remplir tous les champs.");
      setSuccessMessage(""); // Réinitialiser le message de succès
      return;
    }

    // Si tous les champs sont remplis, envoyer les données
    axios
      .post(`${HOST_API}/clients/`, client)
      .then(() => {
        setSuccessMessage("Client ajouté avec succès!");
        setErrorMessage(""); // Réinitialiser l'erreur en cas de succès
        setFormError(""); // Réinitialiser l'erreur de validation
        setOpenModal(false);
        loader();
      })
      .catch(() => {
        setErrorMessage("Erreur lors de l'ajout du client.");
        setSuccessMessage(""); // Réinitialiser le succès en cas d'erreur
      });
  }

  function handleInput(e) {
    setClient((old) => ({
      ...old,
      [e.target.id]: e.target.value,
    }));
  }

  if (!isOpenModal) {
    return <></>;
  }

  return (
    <>
      <div className="position-absolute d-flex justify-content-center align-items-center text-start start-0 top-0 w-100 h-100" style={{ background: "#444444ae" }}>
        <div className="rounded bg-white w-25">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center pb-4">
              <h1 className="modal-title fs-5">Nouveau client</h1>
              <button type="button" className="btn btn-close" onClick={() => setOpenModal(false)}></button>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                {/* Message de validation des champs */}
                {formError && <div className="alert alert-warning">{formError}</div>}
                {/* Message de succès */}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {/* Message d'erreur */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="mb-3">
                  <label htmlFor="nom">Nom</label>
                  <input type="text" className="form-control" id="nom" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="adresse">Adresse</label>
                  <input type="text" className="form-control" id="adresse" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="telephone">Tel</label>
                  <input type="tel" className="form-control" id="telephone" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="recette">Recette</label>
                  <select className="form-control" id="recette" onChange={handleInput}>
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
                  <button type="button" className="btn btn-outline-danger" onClick={() => setOpenModal(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
