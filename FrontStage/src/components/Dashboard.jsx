import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RootPage from './RootPage';
import TopRecettesChart from './RecetteChart';
import { FaUsers, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_recette: 0,
    nombre_clients: 0,
    paiements_reussis: 0,
    total_fonds_payes: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/dashboard/');
      setStats(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  };

  // Formatter les montants en MGA
  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MGA" }).format(montant);
  };

  // Formatter les nombres avec des séparateurs de milliers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <RootPage>
      <div className="container py-4">
        <h1 className="mb-4">Tableau de Bord</h1>

        <div className="row">
          {/* Total des recettes */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-primary bg-opacity-10">
                    <FaMoneyBillWave className="text-primary" size={24} />
                  </div>
                  <div className="ms-3">
                    <h6 className="card-subtitle mb-1 text-muted">Total des Recettes</h6>
                    <h2 className="card-title mb-0">
                      {formatMontant(stats.total_recette)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nombre de clients */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-success bg-opacity-10">
                    <FaUsers className="text-success" size={24} />
                  </div>
                  <div className="ms-3">
                    <h6 className="card-subtitle mb-1 text-muted">Nombre de Clients</h6>
                    <h2 className="card-title mb-0">
                      {formatNumber(stats.nombre_clients)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paiements réussis */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-info bg-opacity-10">
                    <FaCheckCircle className="text-info" size={24} />
                  </div>
                  <div className="ms-3">
                    <h6 className="card-subtitle mb-1 text-muted">Paiements Réussis</h6>
                    <h2 className="card-title mb-0">
                      {formatNumber(stats.paiements_reussis)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total de fonds */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-info bg-opacity-10">
                    <FaMoneyBillWave className="text-primary" size={24} />
                  </div>
                  <div className="ms-3">
                    <h6 className="card-subtitle mb-1 text-muted">Total de Fonds</h6>
                    <h2 className="card-title mb-0">
                      {formatMontant(stats.total_fonds_payes)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section graphique et EmailSender côte à côte */}
        <div className="row mt-4">
          {/* Graphique */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm" >
              <div className="card-body">
                <TopRecettesChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootPage>
  );
}
