import React, { useEffect, useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

const DepositModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  //   const [email, setEmail] = useState("test@gmail.com");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const handleTransfer = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const recipient = users.find((u) => u.email === email);
    const parsedAmount = parseFloat(amount);

    if (!recipient) {
      alert("El usuario no existe.");
      return;
    }
    currentUser.saldo = parseFloat(currentUser.saldo);
    if (recipient.email === currentUser.email) {
      currentUser.saldo += parsedAmount;
      currentUser.saldo = currentUser.saldo.toFixed(2);
      currentUser.transactions = [
        ...(currentUser.transactions || []),
        {
          amount: parsedAmount,
          recipient: email,
          email,
          currentAmount: currentUser.saldo,
          date: format(new Date(), "dd/MM/yyyy HH:mm"),
        },
      ];
    } else {
      currentUser.transactions = [
        ...(currentUser.transactions || []),
        {
          amount: parsedAmount,
          recipient: email,
          email,
          currentAmount: recipient.saldo,
          date: format(new Date(), "dd/MM/yyyy HH:mm"),
        },
      ];
    }

    recipient.saldo = parseFloat(recipient.saldo) + parsedAmount;
    recipient.transactions = [
      ...(recipient.transactions || []),
      {
        amount: parsedAmount,
        sender: currentUser.email,
        email: currentUser.email,
        currentAmount: recipient.saldo,
        date: format(new Date(), "dd/MM/yyyy HH:mm"),
      },
    ];

    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) return currentUser;
      if (user.email === email) return recipient;
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
    setEmail("");
    setAmount("");
    onClose();
    alert("Deposito realizado con éxito.");
  };

  if (!isOpen) return null;
  const handleRestart = () => {
    setEmail("");
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="transfer-modal">
        <h3>Depositar Dinero</h3>
        <label>
          Email del receptor:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Monto a depositar:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <div className="modal-actions">
          <button onClick={handleTransfer}>Transferir</button>
          <button onClick={handleRestart}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;