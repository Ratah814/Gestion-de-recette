import { FaUserCircle, FaTachometerAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidenav() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { href: "/dashboard", name: "Tableau de bords", icon: <FaTachometerAlt /> },
    { href: "/clients", name: "Gestion clients", icon: <FaUsers /> },
    { href: "/recettes", name: "Gestion Recettes", icon: <FaMoneyBillWave /> },
    { href: "/paiements", name: "Paiements", icon: <FaMoneyBillWave /> },
   /* { href: "/rapport", name: "Rapport", icon: <FaFileAlt /> },*/
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: "250px", height: "100vh" }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Menu</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {routes.map(({ href, name, icon }, i) => (
          <li className="nav-item my-1" key={i}>
            <a href={href} className={`nav-link text-white ${location.pathname === href ? "active" : ""}`} aria-current="page">
              <span className="me-2">{icon}</span>
              {name}
            </a>
          </li>
        ))}
      </ul>
      <hr />
      <a className="text-white text-decoration-none" href="#">
        <FaUserCircle size={32} />{" "}
        <span
          className="ms-3"
          onClick={() => {
            localStorage.removeItem("role");
            navigate("/");
          }}
        >
          Se déconnecter
        </span>
      </a>
    </div>
  );
}
