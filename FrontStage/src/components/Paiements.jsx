import { BiSearchAlt2 } from "react-icons/bi";
import { BiEdit } from "react-icons/bi"; // Icône de modification
import RootPage from "./RootPage";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOST_API } from "../Global";
import TitlePage from "./TitlePage";
import Modal from "./paiements/Modal";
import RapportFinancier from "./RapportFinancier"; // Importer le composant RapportFinancier
import EditModal from "./paiements/EditModal"; // Importer le composant EditModal

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]); // État pour les paiements filtrés
  const [isOpenModal, setOpenModal] = useState(false);
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Gérer l'affichage du modal de modification
  const [currentPaiementId, setCurrentPaiementId] = useState(null); // ID du paiement à modifier
  const [searchQuery, setSearchQuery] = useState(""); // État pour la recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [itemsPerPage] = useState(5); // Nombre d'éléments par page

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchPaiements();
  }, []);

  useEffect(() => {
    // Filtrer les paiements à chaque modification de searchQuery
    const filtered = paiements.filter((paiement) => 
      paiement.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      paiement.recette.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPaiements(filtered); // Mettre à jour les paiements filtrés
  }, [searchQuery, paiements]); // Refait le filtrage lorsque searchQuery ou paiements changent

  async function fetchPaiements() {
    const res = await axios.get(`${HOST_API}/paiements/`);
    const client = await axios.get(`${HOST_API}/clients/`);
    const recette = await axios.get(`${HOST_API}/recettes/`);
    setPaiements(() =>
      lierRecettesEtPersonnes(recette.data, client.data, res.data)
    );
    setFilteredPaiements(res.data); // Initialiser filteredPaiements
  }

  const handleDownloadQuittance = async (paiementId) => {
    try {
      const response = await axios.get(`http://localhost:8000/quittance/${paiementId}/`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `quittance_${paiementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  function handleDelete(paiement) {
    console.log(paiement);
    axios.delete(`${HOST_API}/paiements/${paiement.id}/`).then(fetchPaiements);
  }

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPaiements.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPaiements.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleEditClick = (paiementId) => {
    setCurrentPaiementId(paiementId);
    setEditModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Mettre à jour la recherche
  };

  // Calcul du montant total à payer
  const totalMontantPayer = filteredPaiements.reduce((acc, paiement) => acc + parseFloat(paiement.montant_a_payer || 0), 0);

  // Calcul du nombre total de recettes distinctes
  const recettesDistinctes = new Set(filteredPaiements.map(paiement => paiement.recette));
  const totalRecettes = recettesDistinctes.size;

  return (
    <RootPage>
      <TitlePage>Liste des paiements</TitlePage>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <BiSearchAlt2 />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par client ou recette"
            value={searchQuery}
            onChange={handleSearch} // Gérer le changement de la barre de recherche
            aria-label="Search"
            aria-describedby="basic-addon1"
          />
        </div>
      </form>

      <div className="d-flex float-end mb-3">
        {role == "p" && 
          <button className="btn btn-primary" style={{ width: 140 }} onClick={() => setOpenModal(true)}>
            Ajouter un paiement
          </button>}
        
        {/* Ajouter un bouton pour afficher le composant RapportFinancier */}
        {role == "r" &&
          <button className="btn btn-success" style={{ width: 140 }} onClick={() => setShowRapportModal(true)}>
            📄Rapport Financier
          </button>}
        
        {/* Modal pour afficher RapportFinancier */}
        {showRapportModal && (
          <div className="modal" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Générer Rapport Financier</h5>
                  <button type="button" className="close" onClick={() => setShowRapportModal(false)}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <RapportFinancier />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Modal isOpenModal={isOpenModal} setOpenModal={setOpenModal} loader={fetchPaiements} />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Client</th>
            <th scope="col">Recette</th>
            <th scope="col">Montant à payer</th>
            <th scope="col">Date</th>
            {role == "p" && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((paiement, i) => (
            <tr key={i}>
              <td>{indexOfFirstItem + i + 1}</td>
              <td>{paiement.client}</td>
              <td>{paiement.recette}</td>
              <td>{paiement.montant_a_payer}</td>
              <td>{(paiement.date_paiement?.split('T')[0])}</td>
              {role == "p" && 
              <td className="d-flex justify-content-between gap-1">
                <button className="btn-btn-success btn-sm" onClick={() => handleDownloadQuittance(paiement.id)}>
                  🧾 Quittance
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(paiement.id)}>
                  <BiEdit />
                </button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Montant total et nombre de recettes sous forme de boutons, centrés en bas de la pagination */}
    

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button
                onClick={() => paginate(number)}
                className={`page-link ${currentPage === number ? "active" : ""}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Afficher le modal de modification */}
      <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setEditModalOpen}
        paiementId={currentPaiementId}
        fetchPaiements={fetchPaiements}
      />
    </RootPage>
  );
}

const lierRecettesEtPersonnes = (recettes, clients, personnes) => {
  const recettesMap = recettes.reduce((acc, recette) => {
    acc[recette.id] = recette.nom_recette;
    return acc;
  }, {});

  const clientsMap = clients.reduce((acc, client) => {
    acc[client.id] = client.nom;
    return acc;
  }, {});

  return personnes.map(personne => {
    const recetteNom = recettesMap[personne.recette];
    const clientNom = clientsMap[personne.client];
    return {
      ...personne,
      recette: recetteNom,
      client: clientNom
    };
  });
};
