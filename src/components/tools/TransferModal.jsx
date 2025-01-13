import React, { useEffect, useRef, useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { generateReference } from "../../js/generateReference";

const TransferModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const dispatch = useDispatch();

  const handleTransfer = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const recipient = users.find((u) => u.email === email);
    const parsedAmount = parseFloat(amount);
    const reference = generateReference();
    if (recipient.email === currentUser.email) {
      alert("No te puedes transferir a ti mismo.");
      return;
    }

    if (!recipient) {
      alert("El usuario no existe.");
      return;
    }

    if (parsedAmount < amount) {
      alert("Saldo insuficiente.");
      return;
    }
    currentUser.saldo = parseFloat(currentUser.saldo);
    currentUser.saldo -= parsedAmount;
    currentUser.saldo = currentUser.saldo.toFixed(2);
    recipient.saldo = parseFloat(recipient.saldo);
    recipient.saldo += parsedAmount;
    recipient.saldo = recipient.saldo.toFixed(2);

    const mode = "Transferencia";

    currentUser.transactions = [
      ...(currentUser.transactions || []),
      {
        amount: -parsedAmount,
        sender: currentUser.email,
        recipient: email,
        email,
        currentAmount: currentUser.saldo,
        mode,
        reference,
        date: format(new Date(), "dd/MM/yyyy HH:mm"),
      },
    ];
    recipient.transactions = [
      ...(recipient.transactions || []),
      {
        amount: parsedAmount,
        sender: currentUser.email,
        recipient: email,
        email,
        currentAmount: recipient.saldo,
        mode,
        reference,
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
    alert("Transferencia realizada con éxito.");
  };

  if (!isOpen) return null;
  const handleRestart = () => {
    setEmail("");
    setAmount("");
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <div className="transfer-modal">
        <h3>Transferir Dinero</h3>
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
          Monto a transferir:
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

export default TransferModal;
