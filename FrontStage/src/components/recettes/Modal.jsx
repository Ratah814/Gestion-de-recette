// import axios from "axios";
import axios from "axios";
import { useState } from "react";
import { HOST_API } from "../../Global";

export default function Modal({ isOpenModal, setOpenModal, loader }) {
  const [recette, setRecette] = useState({});
  function handleSubmit(e) {
    e.preventDefault();
    console.log(recette)
    axios.post(`${HOST_API}/recettes/`, recette).then(() => {
      setOpenModal(false);
      loader();
    });
  }

  function handleInput(e) {
    console.log([e.target.id], " : ", e.target.value);
    setRecette((old) => ({
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
              <h1 className="modal-title fs-5">Nouveau Recette</h1>
              <button type="button" className="btn btn-close" onClick={() => setOpenModal(false)}></button>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nom_recette">Nom recette</label>
                  <input type="text" className="form-control" id="nom_recette" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="montant">Montant</label>
                  <input type="text" className="form-control" id="montant" onChange={handleInput} />
                </div>

                <div className="mb-3">
                  <label htmlFor="etat">Etat</label>
                  <select className="form-control" id="etat" onChange={handleInput}>
                    <option value="validé">Validé</option>
                    <option value="refusé">Refusé</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="date">Date</label>
                  <input type="date" className="form-control" id="date" onChange={handleInput} />
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
