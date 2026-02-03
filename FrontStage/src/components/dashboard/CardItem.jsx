export default function cardItem({ name = "Card's Title", value, icon }) {
  return (
    <div className="d-flex w-100 align-items-center bg-light rounded">
      <p className="px-4">{icon}</p>
      <div className="p-4">
        <h3>{name.toLocaleUpperCase()}</h3>
        <p className="fs-lg mb-0">{value}1</p>
      </div>
    </div>
  );
}
