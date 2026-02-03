import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Enregistrer les composants nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopRecettesChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchTopRecettes();
  }, []);

  const fetchTopRecettes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/top_recettes/");
      const data = response.data;

      // Extraire les noms des recettes et le nombre de paiements
      const labels = data.map(entry => entry.nom_recette);
      const values = data.map(entry => entry.nombre_paiements);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Nombre de paiements",
            data: values,
            backgroundColor: "rgb(30, 233, 97)",
            borderColor: "rgb(30, 233, 97)",
            borderWidth: 1,
            barThinckness: 20,
            maxBarThinckness:25, 
          }
        ]
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  return (
    <div className="card p-4" style={{ width: "900px", height: "500px"}}>
      <h2 className="text-center">💰 Nombre de Paiements par Recette</h2>
      <Bar 
        data={chartData} 
        options={{ 
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                font: {
                  size: 16 // ✅ Augmente la taille du texte des noms de recettes
                }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // ✅ Affiche uniquement des nombres entiers
              }
            }
          }
        }} 
      />
    </div>
  );
}
