export const consolidateTransactions = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.length) {
    alert("No hay usuarios ni transacciones para consolidar.");
    return;
  }

  const allTransactions = users.flatMap((user) => {
    return user.transactions.map((transaction) => ({
      user: {
        id: user.id || null,
        name: user.name || "",
        email: user.email || "",
        saldo: user.saldo || 0,
      },
      transaction,
    }));
  });

  const sortedTransactions = allTransactions.sort((a, b) => {
    const [dayA, monthA, yearA, hourA, minuteA] =
      a.transaction.date.split(/[:/\s]/);
    const [dayB, monthB, yearB, hourB, minuteB] =
      b.transaction.date.split(/[:/\s]/);
    const dateA = new Date(yearA, monthA - 1, dayA, hourA, minuteA);
    const dateB = new Date(yearB, monthB - 1, dayB, hourB, minuteB);
    return dateA - dateB;
  });

  localStorage.setItem(
    "globalTransactions",
    JSON.stringify(sortedTransactions)
  );
};
