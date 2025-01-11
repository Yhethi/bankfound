import { useEffect, useRef, useState } from "react";

const TransactionsTable = ({ user, users }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  useEffect(() => {
    if (user?.transactions && users) {
      const transactions = user.transactions.map((element) => {
        const recipient = users.find((u) => u.email === element.email);
        return {
          user: {
            id: recipient?.id || null,
            name: recipient?.name || "",
            email: recipient?.email || "",
            saldo: recipient?.saldo || 0,
            currentAmount: recipient?.currentAmount || 0,
            transaction: element,
          },
        };
      });
      const reversedTransactions = [...transactions].reverse();
      setAllTransactions(reversedTransactions);
      setFilteredData(reversedTransactions);
    }
  }, [user, users]);

  useEffect(() => {
    if (allTransactions.length === 0) return;
    const lowerQuery = searchQuery.toLowerCase();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;
    let filtered;
    if (!startDate && !endDate && searchQuery.length === 0) {
      filtered = allTransactions;
    }
    if (searchQuery.length > 0) {
      filtered = allTransactions.filter((item) => {
        const userValues = Object.values(item.user || {});
        const transactionValues = Object.values(item.user.transaction || {});
        const combinedValues = [...userValues, ...transactionValues];
        return combinedValues.some((value) => {
          return value?.toString().toLowerCase().includes(lowerQuery);
        });
      });
    }
    if (startDate || endDate) {
      filtered = allTransactions.filter((item) => {
        const itemDate = new Date(
          item.user.transaction.date
            .split(" ")[0]
            .split("/")
            .reverse()
            .join("-")
        ).getTime();

        return (!start || itemDate >= start) && (!end || itemDate <= end);
      });
    }
    setFilteredData(filtered || allTransactions);
  }, [searchQuery, startDate, endDate, allTransactions]);

  return (
    <>
      <div className="table__search">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="search__dates">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha Inicio"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha Fin"
          />
        </div>
      </div>
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Saldo</th>
              <th>Transacción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((user, index) => (
                <tr key={index}>
                  <td>{user.user.id}</td>
                  <td>{user.user.name}</td>
                  <td>{user.user.email}</td>
                  <td>{user.user.transaction.currentAmount} Bs.</td>
                  <td
                    style={{
                      color: user.user.transaction.amount < 0 ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {user.user.transaction.amount > 0 ? "+" : ""}
                    {user.user.transaction.amount} Bs.
                  </td>
                  <td>{user.user.transaction.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay operaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr;
        </button>
        {[...Array(totalPages).keys()].map((_, idx) => (
          <button
            key={idx}
            className={`pagination-number ${
              currentPage === idx + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &rarr;
        </button>
      </div>
    </>
  );
};

export default TransactionsTable;
