export default function Breadcrumb() {
  return (
    <nav aria-label="breadcrumb" className="bg-light w-100 px-4 align-self-start">
      <ol className="breadcrumb py-3">
        <li className="breadcrumb-item">
          <a href="#">Acceuil</a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Library
        </li>
      </ol>
    </nav>
  );
}
