import React, { useEffect, useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { generateReference } from "../../js/generateReference";
import { consolidateTransactions } from "../../js/consolidateTransactions";

const RetiroModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const userNow = useSelector((state) => state.auth.user) || [];
  const isAdmin = userNow.email === "admin@gmail.com";
  useEffect(() => {
    if (!isAdmin) {
      setEmail(userNow.email);
    }
  }, []);

  const handleTransfer = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const recipient = users.find((u) => u.email === email);
    const parsedAmount = parseFloat(amount);
    const reference = generateReference();

    if (!recipient) {
      alert("El usuario no existe.");
      return;
    }

    if (recipient.saldo < parsedAmount) {
      alert("Saldo insuficiente.");
      return;
    }

    recipient.saldo = parseFloat(recipient.saldo);
    recipient.saldo -= parsedAmount;
    recipient.saldo = recipient.saldo.toFixed(2);
    const mode = "Retiro";

    if (recipient.email === currentUser.email) {
      currentUser.saldo = parseFloat(currentUser.saldo);
      currentUser.saldo -= parsedAmount;
      currentUser.saldo = currentUser.saldo.toFixed(2);
      currentUser.transactions = [
        ...(currentUser.transactions || []),
        {
          amount: -parsedAmount,
          sender: currentUser.email,
          recipient: currentUser.email,
          email,
          currentAmount: currentUser.saldo,
          mode,
          reference,
          date: format(new Date(), "dd/MM/yyyy HH:mm"),
        },
      ];
    } else {
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
    }

    recipient.transactions = [
      ...(recipient.transactions || []),
      {
        amount: -parsedAmount,
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
    consolidateTransactions();
    alert("Retiro realizado con éxito.");
  };

  if (!isOpen) return null;
  const handleRestart = () => {
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
        {isAdmin ? (
          <>
            <h3>Retirar Dinero</h3>
            <label>
              Email del usuario:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </>
        ) : (
          <></>
        )}
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
