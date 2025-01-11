import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

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

  const exportToExcel = () => {
    if (!paginatedData || paginatedData.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Saldo",
      "Transacción",
      "Modo",
      "Fecha",
    ];

    const dataToExport = paginatedData.map((data) => ({
      ID: data.user.id,
      Nombre: data.user.name,
      Email: data.user.email,
      Saldo:
        user.email === "admin@gmail.com" ||
        user.email === data.user.transaction.email ||
        user.email === data.user.transaction.sender
          ? `${data.user.transaction.currentAmount} Bs.`
          : "",
      Transacción:
        (data.user.transaction.amount > 0 ? "+" : "") +
        `${data.user.transaction.amount} Bs.`,
      Modo: data.user.transaction.mode,
      Fecha: data.user.transaction.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");

    const dateNow = format(new Date(), "d/M/yy_HH:mm");

    XLSX.writeFile(workbook, user.email + "_" + dateNow + ".xlsx");
  };

  return (
    <>
      <div className="table__search">
        <input
          type="text"
          placeholder="Buscar..."
          className="search_input"
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
          {/* <button onClick={exportToExcel} className="export-button">
            Exportar a Excel
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFF"
            >
              <path d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
            </svg>
          </button> */}
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
              <th>Modo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={index}>
                  <td>{data.user.id}</td>
                  <td>{data.user.name}</td>
                  <td>{data.user.email}</td>
                  <td>
                    {user.email === "admin@gmail.com" ||
                    user.email === data.user.transaction.email ||
                    user.email === data.user.transaction.sender
                      ? `${data.user.transaction.currentAmount} Bs.`
                      : ""}
                  </td>
                  <td
                    style={{
                      color: data.user.transaction.amount < 0 ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {data.user.transaction.amount > 0 ? "+" : ""}
                    {data.user.transaction.amount} Bs.
                  </td>
                  <td>{data.user.transaction.mode}</td>
                  <td>{data.user.transaction.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
