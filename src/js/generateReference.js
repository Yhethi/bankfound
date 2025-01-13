export const generateReference = () => {
  const transactions = JSON.parse(localStorage.getItem("globalTransactions"));
  if (transactions === null) {
    return "000000000001";
  } else {
    const lastTransaction = transactions[transactions.length - 1];
    const lastReference = lastTransaction?.transaction.reference;
    return lastReference
      ? (parseInt(lastReference, 10) + 1).toString().padStart(12, "0")
      : "000000000001";
  }
};
