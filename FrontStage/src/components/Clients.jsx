import { BiSearchAlt2 } from "react-icons/bi";
import { BiTrashAlt } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import Modal from "./client/Modal";
import EditModal from "./client/EditModal";
import axios from "axios";
import { HOST_API } from "../Global";
import RootPage from "./RootPage";
import TitlePage from "./TitlePage";

export default function Clients() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // Nouveau state pour les clients filtrés
  const [searchQuery, setSearchQuery] = useState(""); // Nouveau state pour la recherche

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Appliquer le filtre dès que le `searchQuery` change
    const filtered = clients.filter((client) =>
      client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.adresse.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]); // Refiltrer chaque fois que la recherche ou les clients changent

  async function fetchClients() {
    const res = await axios.get(`${HOST_API}/clients/`);
    const recette = await axios.get(`${HOST_API}/recettes/`);

    const clientsWithRecettes = lierRecettesEtPersonnes(recette.data, res.data);
    setClients(clientsWithRecettes);
    setFilteredClients(clientsWithRecettes); // Initialiser les clients filtrés
  }

  function handleDelete(client) {
    axios.delete(`${HOST_API}/clients/${client.id}/`).then(fetchClients);
  }

  function handleEdit(client) {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:8000/pdf', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'liste_clients_fianarantsoa.pdf');
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Mettre à jour le texte de recherche
  };

  return (
    <RootPage>
      <div className="d-flex justify-content-between">
        <TitlePage className="fs-2">GESTION DE CLIENTS</TitlePage>
        <form>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <BiSearchAlt2 />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom ou adresse"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </form>
      </div>
      <div className="d-flex  float-end mb-3">
        {role === "r" && (
          <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Ajouter un client
          </button>
        )}
        <Modal isOpenModal={isOpenModal} setOpenModal={setOpenModal} loader={fetchClients} />
        <EditModal isOpenModal={isEditModalOpen} setOpenModal={setIsEditModalOpen} loader={fetchClients} client={selectedClient} />
      </div>
      <div className="d-flex  float-end mb-3">
        {role === "r" && (
          <button className="btn btn-success" onClick={handleDownloadPDF}>
            Generer un pdf
          </button>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col">Adresse</th>
            <th scope="col">Tel</th>
            <th scope="col">Secteur</th>
            {role === "r" && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client, i) => (
            <tr key={i}>
              <td>{client.id}</td>
              <td>{client.nom}</td>
              <td>{client.adresse}</td>
              <td>{client.telephone}</td>
              <td>{client.recette}</td>
              {role === "r" && (
                <td className="d-flex justify-content-between gap-1">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(client)}>
                    <BiTrashAlt />
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(client)}>
                    <FiEdit2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </RootPage>
  );
}

const lierRecettesEtPersonnes = (recettes, personnes) => {
  // Créer un dictionnaire de recettes par ID pour un accès rapide
  const recettesMap = recettes.reduce((acc, recette) => {
    acc[recette.id] = recette.nom_recette;
    return acc;
  }, {});

  // Lier les personnes aux recettes avec le nom de la recette
  return personnes.map(personne => {
    const recetteNom = recettesMap[personne.recette];
    return {
      ...personne,
      recette: recetteNom // Remplacer l'ID de recette par le nom de la recette
    };
  });
};
