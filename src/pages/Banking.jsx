import { useSelector } from "react-redux";
import AccountCard from "../components/AccountCard";
import BarChartComponent from "../components/BarChartComponent";

import TransactionsTable from "../components/TransactionsTable";

const Banking = () => {
  const user = useSelector((state) => state.auth.user);
  const date = new Date();
  const showTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return (
    <div className="banking">
      <div className="dataUser">
        <h1>Bienvenido {user.name}</h1>
        <h6>
          {user.email} - Ultima Conexion: {showTime}
        </h6>
      </div>

      <div className="banking-overview">
        <AccountCard accountName="Disponible" balance={user.saldo} />
        <AccountCard accountName="Ahorrado (Mes)" balance={user.ahorrado} />
      </div>
      <BarChartComponent />
      <TransactionsTable />
    </div>
  );
};

export default Banking;
