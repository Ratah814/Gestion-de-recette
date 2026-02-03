import Breadcrumb from "./Breadcrumb";
import Sidenav from "./Sidenav";

export default function RootPage({ children }) {
  return (
    <div className="d-flex w-100">
      <Sidenav />
      <div className="w-100">
        <Breadcrumb />
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
}
