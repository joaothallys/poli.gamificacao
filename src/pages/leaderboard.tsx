import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import userService from "~/services/userService";
import ReactPaginate from "react-paginate";

const Leaderboard: NextPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<number>(-1);
  const [searchCustomerId, setSearchCustomerId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{ id: number; newStatus: number } | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const roles = parsedData.roles_deprecated_id.split(",");
      if (!roles.includes("1")) {
        setHasAccess(false);
      }
    } else {
      setHasAccess(false);
    }
  }, []);

  useEffect(() => {
    if (!hasAccess) return;

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getPointTransactions(
          currentPage,
          10,
          token,
          customerId,
          statusFilter === -1 ? undefined : statusFilter
        );
        setTransactions(response.data);
        setLastPage(response.last_page || 1);
      } catch (error) {
        console.error("Erro ao obter transações:", error);
        setError("Falha ao carregar as transações. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [customerId, statusFilter, token, hasAccess, currentPage]);

  const handleStatusChange = async () => {
    if (selectedTransaction) {
      try {
        await userService.updatePointTransactionStatus(selectedTransaction.id, selectedTransaction.newStatus, token);
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === selectedTransaction.id ? { ...transaction, transaction_status: selectedTransaction.newStatus } : transaction
          )
        );
        setShowModal(false);
        setSelectedTransaction(null);
      } catch (error) {
        console.error("Erro ao atualizar status da transação:", error);
        setError("Falha ao atualizar o status da transação. Tente novamente mais tarde.");
      }
    }
  };

  const handleSearch = () => {
    if (searchCustomerId) {
      setCustomerId(Number(searchCustomerId));
      setCurrentPage(1);
    } else {
      setCustomerId(undefined);
      setCurrentPage(1);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(Number(e.target.value));
    setCurrentPage(1);
  };

  const statusNames = ["Todos", "Pendente", "Aprovado", "Negado", "Cancelado"];

  const convertPointsToReal = (points: string) => {
    const pointValue = parseFloat(points);
    const formattedValue = pointValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `P$ ${formattedValue}`;
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-8">Sem acesso</h1>
        <p className="text-gray-700">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex w-full">
        <LeftBar selectedTab="Leaderboards" />
        <div className="flex flex-col w-full px-6 py-10 sm:px-10 sm:ml-64 lg:ml-64">
          <div className="max-w-[1000px] mx-auto w-full">
            <h1 className="text-3xl font-extrabold text-[#0000C8] mb-8 text-center">
              Leaderboard de Transações
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Filtro de Status:</label>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                >
                  <option value={-1}>Todos</option>
                  <option value={0}>Pendente</option>
                  <option value={1}>Aprovado</option>
                  <option value={2}>Negado</option>
                  <option value={3}>Cancelado</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Buscar por Customer ID"
                  value={searchCustomerId}
                  onChange={(e) => setSearchCustomerId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-[#0000C8] text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-700">Carregando transações...</p>
                </div>
              </div>
            )}

            {/* Table */}
            {!isLoading && (error || transactions.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-6 text-left text-gray-700 font-semibold">Customer ID</th>
                      <th className="py-3 px-6 text-left text-gray-700 font-semibold">Produto</th>
                      <th className="py-3 px-6 text-left text-gray-700 font-semibold">Policoins</th>
                      <th className="py-3 px-6 text-left text-gray-700 font-semibold">Status</th>
                      <th className="py-3 px-6 text-left text-gray-700 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 border-b border-gray-200">{transaction.customer_id}</td>
                        <td className="py-4 px-6 border-b border-gray-200">{transaction.product_name}</td>
                        <td className="py-4 px-6 border-b border-gray-200">{convertPointsToReal(transaction.points)}</td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.transaction_status === "Pendente" || transaction.transaction_status === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : transaction.transaction_status === "Aprovado" || transaction.transaction_status === 1
                                ? "bg-green-100 text-green-800"
                                : transaction.transaction_status === "Negado" || transaction.transaction_status === 2
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {typeof transaction.transaction_status === "number"
                              ? statusNames[transaction.transaction_status + 1]
                              : transaction.transaction_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <select
                            value={transaction.transaction_status}
                            onChange={(e) => {
                              setSelectedTransaction({ id: transaction.id, newStatus: Number(e.target.value) });
                              setShowModal(true);
                            }}
                            className="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                          >
                            <option value={0}>Pendente</option>
                            <option value={1}>Aprovado</option>
                            <option value={2}>Negado</option>
                            <option value={3}>Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination with ReactPaginate */}
                <div className="mt-4">
                  <ReactPaginate
                    forcePage={currentPage - 1}
                    previousLabel="Anterior"
                    nextLabel="Próximo"
                    breakLabel="..."
                    pageCount={lastPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="flex justify-center items-center space-x-2 mt-4"
                    pageClassName="px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200"
                    activeClassName="bg-[#0000C8] text-white"
                    previousClassName="px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    nextClassName="px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    breakClassName="px-3 py-1 text-gray-700"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomBar selectedTab="Leaderboards" />

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Alteração de Status</h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja alterar o status da transação para{" "}
              <span className="font-semibold text-[#0000C8]">
                {selectedTransaction && statusNames[selectedTransaction.newStatus + 1]} {/* Ajustado para +1 */}
              </span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStatusChange}
                className="flex-1 py-2 bg-[#0000C8] text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;