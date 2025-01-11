import React, { useState } from "react";

const AccountCard = ({ accountName, balance }) => {
  const [transformStyle, setTransformStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xRotation = -((y - rect.height / 2) / rect.height) * 15;
    const yRotation = ((x - rect.width / 2) / rect.width) * 15;

    setTransformStyle({
      transform: `rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-3px) scale(1.01)`,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({ transform: "rotateX(0) rotateY(0)" });
  };

  return (
    <div className="d-flex-center">
      <div
        className="account-card"
        style={transformStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-content">
          <p>Bs. {balance}</p>
          <h2>{accountName}</h2>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
