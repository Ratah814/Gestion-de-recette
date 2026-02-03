import { BiSearchAlt2 } from "react-icons/bi";
import { BiTrashAlt } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import Modal from "./recettes/Modal";
import ModifRecette from "./recettes/ModifRecette";
import RootPage from "./RootPage";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOST_API } from "../Global";
import TitlePage from "./TitlePage";

export default function Recettes() {
  const [recettes, setRecettes] = useState([]);
  const [filteredRecettes, setFilteredRecettes] = useState([]); // État pour les recettes filtrées
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenModalModif, setOpenModalModif] = useState(false);
  const [selectedRecette, setSelectedRecette] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // État pour la recherche

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchRecettes();
  }, []);

  useEffect(() => {
    // Filtrer les recettes à chaque modification de searchQuery
    const filtered = recettes.filter((recette) =>
      recette.nom_recette.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecettes(filtered); // Mettre à jour les recettes filtrées
  }, [searchQuery, recettes]); // Refait le filtrage lorsque searchQuery ou recettes changent

  async function fetchRecettes() {
    const res = await axios.get(`${HOST_API}/recettes/`);
    setRecettes(res.data);
    setFilteredRecettes(res.data); // Initialiser filteredRecettes
  }

  function handleDelete(recette) {
    axios.delete(`${HOST_API}/recettes/${recette.id}/`).then(fetchRecettes);
  }

  function handleEdit(recette) {
    setSelectedRecette(recette);
    setOpenModalModif(true);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Mettre à jour la recherche
  };

  return (
    <RootPage>
      <div className="d-flex justify-content-between">
        <TitlePage>GESTION DE RECETTES</TitlePage>
        <form>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <BiSearchAlt2 />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom de recette"
              value={searchQuery}
              onChange={handleSearch} // Gérer le changement de la barre de recherche
              aria-label="Search"
              aria-describedby="basic-addon1"
            />
          </div>
        </form>
      </div>
      <div className="d-flex float-end mb-3">
        {role === "r" && (
          <button className="btn btn-primary" style={{ width: 140 }} onClick={() => setOpenModal(true)}>
            Ajouter une recette
          </button>
        )}
        <Modal isOpenModal={isOpenModal} setOpenModal={setOpenModal} loader={fetchRecettes} />
        <ModifRecette isOpenModal={isOpenModalModif} setOpenModal={setOpenModalModif} loader={fetchRecettes} old={selectedRecette} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col">Montant</th>
            <th scope="col">État</th>
            <th scope="col">Date</th>
            {role === "r" && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody>
          {filteredRecettes.map((recette, i) => (
            <tr key={i}>
              <td>{recette.id}</td>
              <td>{recette.nom_recette}</td>
              <td>{recette.montant}</td>
              <td>{recette.etat}</td>
              <td>{recette.date}</td>
              {role === "r" && (
                <td className="d-flex justify-content-between gap-1">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(recette)}>
                    <BiTrashAlt />
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(recette)}>
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
