import React, { useEffect, useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

const RetiroModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const handleTransfer = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const parsedAmount = parseFloat(amount);
    currentUser.saldo = parseFloat(currentUser.saldo);

    if (currentUser.saldo < parsedAmount) {
      alert("Saldo insuficiente.");
      return;
    }
    currentUser.saldo -= parsedAmount;
    currentUser.transactions = [
      ...(currentUser.transactions || []),
      {
        amount: -amount,
        recipient: currentUser.email,
        email: currentUser.email,
        currentAmount: currentUser.saldo,
        date: format(new Date(), "dd/MM/yyyy HH:mm"),
      },
    ];

    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) return currentUser;
      return user;
    });

    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    dispatch(
      loginUser({
        token: localStorage.getItem("authToken"),
        user: currentUser,
      })
    );
    setAmount("");
    onClose();
    alert("Retiro realizado con éxito.");
  };

  if (!isOpen) return null;
  const handleRestart = () => {
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="transfer-modal">
        <h3>Retirar Dinero</h3>
        <label>
          Monto a retirar:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <div className="modal-actions">
          <button onClick={handleTransfer}>Retirar</button>
          <button onClick={handleRestart}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default RetiroModal;
