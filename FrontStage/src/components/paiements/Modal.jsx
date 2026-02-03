// import axios from "axios";
import axios from "axios";
import { useState, useEffect } from "react";
import { HOST_API } from "../../Global";

export default function Modal({ isOpenModal, setOpenModal, loader }) {
  const [paiement, setPaiement] = useState({});
  const [clients, setClients] = useState([]);
  const [recettes, setRecettes] = useState([]);
  const [montant, setMontant] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchRecettes();
  }, []);

  async function fetchClients() {
    const res = await axios.get(`${HOST_API}/clients/`);
    setClients(res.data);
  }

  async function fetchRecettes() {
    const res = await axios.get(`${HOST_API}/recettes/`);
    setRecettes(res.data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(paiement);
    axios.post(`${HOST_API}/paiements/`, paiement).then(() => {
      setOpenModal(false);
      loader();
    });
  }

  function handleInput(e) {
    if (e.target.id === "recette") {
      const montant_a_payer = recettes.filter((r) => r.id == e.target.value)[0]?.montant;
      setMontant(montant_a_payer);
      setPaiement((old) => ({
        ...old,
        montant_a_payer,
      }));
    }

    setPaiement((old) => ({
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
                <div className="mb-3">
                  <label htmlFor="client">Client</label>
                  <select className="form-control" id="client" onChange={handleInput}>
                    <option value=""></option>
                    {clients.map(({ id, nom }) => (
                      <option value={id} key={id}>
                        {nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="recette">Recette</label>
                  <select className="form-control" id="recette" onChange={handleInput}>
                    <option value=""></option>
                    {recettes.map(({ nom_recette, id }) => (
                      <option value={id} key={id}>
                        {nom_recette}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="date_paiement">Date</label>
                  <input type="date" className="form-control" id="date_paiement" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="montant_a_payer">Montant à payer</label>
                  <input type="text" className="form-control" defaultValue={montant} disabled id="montant_a_payer" />
                </div>

                <div>
                  <button type="submit" className="btn btn-dark mb-1">
                    Enregistrer
                  </button>
                  <button type="submit" className="btn btn-outline-danger" onClick={() => setOpenModal(false)}>
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
