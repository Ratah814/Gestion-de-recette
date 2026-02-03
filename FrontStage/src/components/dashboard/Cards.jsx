import { BiCreditCard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FcStatistics } from "react-icons/fc";
import axios from "axios";
import CardItem from "./CardItem";
import { useEffect, useState } from "react";
import { HOST_API } from "../../Global";

export default function Cards() {
  const [data, setData] = useState({ paiements: [] });

  useEffect(() => {
    axios.get(`${HOST_API}/clients/`).then((clients) =>
      setData((old) => ({
        ...old,
        clientCount: clients.data.length,
      }))
    );

    axios.get(`${HOST_API}/recettes/`).then((recettes) =>
      setData((old) => ({
        ...old,
        totalRecette: recettes.data.reduce((acc, cur) => {
          return (acc += parseFloat(cur.montant));
        }, 0),
      }))
    );

    // axios.g
  }, []);
  return (
    <div className="d-flex gap-3">
      <CardItem name="Total recette" value={data.totalRecette} icon={<FcStatistics size={75} color="blue" />} />
      <CardItem name="Nombre de clients" value={data.clientCount} icon={<FaUsers size={75} color="#2200FF" />} />
      <CardItem name="Paiements réussis" icon={<BiCreditCard size={75} color="#2200FF" />} />
    </div>
  );
}
