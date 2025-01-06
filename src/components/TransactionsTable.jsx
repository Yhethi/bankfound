const TransactionsTable = () => {
  const users = Array.from({ length: 100 }, (_, i) => ({
    user: {
      id: i + 1,
      name: `User${i + 1}`,
      email: `user${i + 1}@example.com`,
      saldo: Math.floor(Math.random() * 10000),
      ahorrado: Math.floor(Math.random() * 5000),
    },
  }));
  return (
    <div class="table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Saldo</th>
            <th>Ahorrado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.user.id}</td>
              <td>{user.user.name}</td>
              <td>{user.user.email}</td>
              <td>${user.user.saldo}</td>
              <td>${user.user.ahorrado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
