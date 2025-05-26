import type { NextPage } from "next";
import React, { useEffect, useState, useCallback } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import Image from "next/image";
import userService from "~/services/userService";
import { Product, TransactionResponse } from "~/types/interfaces";

const Shop: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [purchaseMessage, setPurchaseMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionResponse["data"] | null>(null);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCustomerId(parsedData?.first_account ?? null);
        setUserUuid(parsedData?.user_uuid ?? null);
        if (!parsedData?.first_account) {
          setError("ID do cliente não encontrado. Faça login novamente.");
        }
        if (!parsedData?.user_uuid) {
          setError("UUID do usuário não encontrado. Faça login novamente.");
        }
      } catch (error) {
        setError("Erro ao carregar dados do usuário. Tente novamente.");
      }
    } else {
      setError("Nenhum dado de usuário encontrado. Faça login.");
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let page = 1;
      let lastPage = 1;
      let allProducts: Product[] = [];
      do {
        const response = await userService.getProducts(20, page, token);
        allProducts = [...allProducts, ...response.data];
        lastPage = response.last_page;
        page++;
      } while (page <= lastPage);
      setProducts(allProducts);
    } catch (error) {
      setError("Falha ao carregar produtos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserBalance = useCallback(async () => {
    if (!customerId) {
      console.warn("customerId não disponível para buscar saldo");
      return;
    }
    try {
      const response = await userService.getCustomerTotalPoints(customerId, token);
      setUserBalance(response.current_points);
    } catch (error) {
      setError("Falha ao carregar saldo do usuário.");
    }
  }, [customerId, token]);

  useEffect(() => {
    fetchAllProducts();
    if (customerId) {
      fetchUserBalance();
    }
  }, [fetchAllProducts, fetchUserBalance, customerId]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setPurchaseMessage("");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setPurchaseMessage("");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTransactionData(null);
    handleCloseModal();
  };

  const handlePurchase = async (product: Product) => {
    if (!customerId || !userUuid) {
      setPurchaseMessage("Erro: ID do cliente ou UUID do usuário não disponível.");
      return;
    }
    const priceNum = parseFloat(product.price);
    if (isNaN(priceNum)) {
      setPurchaseMessage("Erro: Preço do produto inválido.");
      return;
    }
    if (userBalance < priceNum) {
      setPurchaseMessage("Saldo insuficiente para realizar a compra.");
      return;
    }
    try {
      setPurchaseMessage("Processando compra...");
      const response = await userService.postTransaction(customerId, 0, product.id, token, userUuid);
      if (response.status === 200 || 202) {
        const transaction = response.data as TransactionResponse["data"];
        setTransactionData(transaction);
        setPurchaseMessage("");
        setShowSuccessModal(true);
        await fetchUserBalance();
      } else {
        setPurchaseMessage(`Falha ao processar a compra. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao processar compra:", error);
      setPurchaseMessage("Falha ao processar compra. Tente novamente.");
    }
  };

  const getRemainingBalance = (product: Product) =>
    (userBalance - parseFloat(product.price)).toFixed(2);

  const formatPrice = (value: number | string): string => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return `P$ ${numericValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const groupedProducts = products.reduce((acc: Record<string, Product[]>, product) => {
    const desc = product.description || "Outros";
    if (!acc[desc]) {
      acc[desc] = [];
    }
    acc[desc].push(product);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex w-full flex-col md:flex-row">
        <LeftBar selectedTab="Shop" />
        <div className="flex flex-col w-full px-2 py-6 sm:px-4 md:px-10 md:py-10 md:ml-64 lg:ml-64">
          {isLoading && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-700">Carregando produtos...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="max-w-[1000px] mx-auto w-full mb-8">
              <h2 className="text-3xl font-extrabold text-[#0000C8] mb-4 text-center">
                Loja de recompensas
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Seu saldo: <span className="font-bold text-[#0000C8]">{formatPrice(userBalance)}</span>
                </p>
              </div>

              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedProducts).map(([description, products]) => (
                    <div key={description}>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{description}</h3>
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-full md:max-w-[1000px] mx-auto w-full">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white p-3 sm:p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center min-h-[320px] sm:min-h-[400px]"
                          >
                            <div
                              className="cursor-pointer mb-4 flex items-center justify-center h-36 w-36 sm:h-48 sm:w-48"
                              onClick={() => handleProductClick(product)}
                            >
                              <Image
                                src={product.link_img}
                                alt={product.name}
                                className="h-full w-full object-contain rounded-lg"
                                width={192}
                                height={192}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 text-center mb-2 line-clamp-2 h-14">
                              {product.name}
                            </h4>
                            <p className="text-[#0000C8] text-xl font-bold mb-4">{formatPrice(product.price)}</p>
                            <button
                              className="w-full py-2 bg-[#0000C8] text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                              onClick={() => handleProductClick(product)}
                            >
                              Ver detalhes
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && !showSuccessModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl flex flex-col md:flex-row shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-t-none">
              <Image
                src={selectedProduct.link_img}
                alt={selectedProduct.name}
                className="rounded-lg object-contain max-h-[450px]"
                width={450}
                height={450}
                quality={100}
                priority
              />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                <p className="text-[#0000C8] text-xl font-extrabold mb-4">{formatPrice(selectedProduct.price)}</p>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <p>Seu saldo: <span className="font-semibold">{formatPrice(userBalance)}</span></p>
                  <p>Preço do item: <span className="font-semibold">{formatPrice(selectedProduct.price)}</span></p>
                  <p>Saldo restante: <span className="font-semibold">{formatPrice(getRemainingBalance(selectedProduct))}</span></p>
                </div>
                {userBalance < parseFloat(selectedProduct.price) ? (
                  <p className="text-red-500 font-semibold mb-4">Saldo insuficiente</p>
                ) : purchaseMessage ? (
                  <p className={`font-semibold mb-4 ${purchaseMessage.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
                    {purchaseMessage}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 font-semibold rounded-full transition-colors ${userBalance >= parseFloat(selectedProduct.price)
                    ? "bg-[#0000C8] text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  onClick={() => handlePurchase(selectedProduct)}
                  disabled={userBalance < parseFloat(selectedProduct.price)}
                >
                  Comprar agora
                </button>
                <button
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
                  onClick={handleCloseModal}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleCloseSuccessModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-green-500 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Compra Solicitada!</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {transactionData
                ? `Sua compra de "${transactionData.product_name}" foi solicitada com sucesso! Status: ${transactionData.transaction_status}. Verifique seu e-mail para mais detalhes.`
                : "Sua solicitação foi enviada para análise. Verifique seu e-mail para mais detalhes."}
            </p>
            <button
              className="w-full py-3 bg-[#0000C8] text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              onClick={handleCloseSuccessModal}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <BottomBar selectedTab="Shop" />
    </div>
  );
};

export default Shop;