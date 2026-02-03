import React, { useState } from "react";

export default function RapportFinancier() {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur

  const handleDownload = () => {
    // Vérifier que les dates sont valides
    if (!dateDebut || !dateFin) {
      setErrorMessage("Veuillez sélectionner les deux dates.");
      return;
    }

    if (new Date(dateDebut) > new Date(dateFin)) {
      setErrorMessage("La date de début doit être une date antérieure à la date de fin!");
      return;
    }

    setErrorMessage(""); // Réinitialiser le message d'erreur

    const url = `http://localhost:8000/rapport-financier-pdf/?date_debut=${dateDebut}&date_fin=${dateFin}`;
    window.open(url, "_blank"); // Ouvre et télécharge directement le PDF
  };

  return (
    <div className="container">
      <h2 className="mb-4">Télécharger le Rapport Financier</h2>

      <div className="row">
        <div className="col-md-4">
          <label>Date de début:</label>
          <input
            type="date"
            className="form-control"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label>Date de fin:</label>
          <input
            type="date"
            className="form-control"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <button className="btn btn-primary mt-4" onClick={handleDownload}>
            Télécharger le PDF
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger mt-3">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
