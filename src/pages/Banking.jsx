import { useDispatch, useSelector } from "react-redux";
import AccountCard from "../components/AccountCard";
import BarChartComponent from "../components/BarChartComponent";

import TransactionsTable from "../components/TransactionsTable";
import { useState } from "react";
import TransferModal from "../components/tools/TransferModal";
import { loginUser } from "../redux/slices/authSlice";
import { useEffect } from "react";
import RetiroModal from "../components/tools/RetiroModal";
import DepositModal from "../components/tools/DepositModal";

const Banking = () => {
  const user = useSelector((state) => state.auth.user);
  const date = new Date();
  const showTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [isModalOpen3, setModalOpen3] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const totalAmountUsers = users.reduce((total, user) => {
    return total + parseFloat(user.saldo || 0);
  }, 0);

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
        <AccountCard
          accountName="S. Total en Sistema"
          balance={totalAmountUsers}
        />
      </div>
      <div className="actions__card">
        <button onClick={() => setModalOpen3(true)}>
          <span>Deposito</span>
        </button>
        <button onClick={() => setModalOpen2(true)}>
          <span>Retirar</span>
        </button>
        <button onClick={() => setModalOpen(true)}>
          <span>Transferencia</span>
        </button>
        <button type="button" onClick={toggleGraph}>
          {showGraph ? (
            <span>
              Ocultar Grafica
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000"
              >
                <path d="m280-400 200-200 200 200H280Z" />
              </svg>
            </span>
          ) : (
            <span>
              Mostrar Grafica
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#000"
              >
                <path d="M480-360 280-560h400L480-360Z" />
              </svg>
            </span>
          )}
        </button>
      </div>
      <BarChartComponent showGraph={showGraph}  user={user} users={users}/>
      <TransactionsTable user={user} users={users} />
      <TransferModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <RetiroModal isOpen={isModalOpen2} onClose={() => setModalOpen2(false)} />
      <DepositModal
        isOpen={isModalOpen3}
        onClose={() => setModalOpen3(false)}
      />
    </div>
  );
};

export default Banking;
