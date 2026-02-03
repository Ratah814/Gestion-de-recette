import React, {useEffect, useState} from "react";
import { getDashboardStats } from "./serviceDashboard";

const Dashboard = () => {
    const [stats,setStats ] = useState({ total_recette: 0, nombre_clients: 0, paiements_reussis: 0 });

    useEffect(() => {
        getDashboardStats().then((data) => setStats(data));
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                <p><strong>Total recette:</strong> {stats.total_recette}</p>
                <p><strong>Nombre de clients:</strong> {stats.nombre_clients}</p>
                <p><strong>Paiements réussis:</strong> {stats.paiements_reussis}</p>
            </div>
        </div>
    )
}
export default Dashboard