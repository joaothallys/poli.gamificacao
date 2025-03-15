import type { NextPage } from "next";
import React, { useEffect, useState, useCallback } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import Image from "next/image";
import userService from "~/services/userService";

interface Product {
  id: number;
  name: string;
  price: string;
  link_img: string;
}

const Shop: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [purchaseMessage, setPurchaseMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "123456";
  const customerId = 1;

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
      console.error("Erro ao obter produtos:", error);
      setError("Falha ao carregar os produtos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserBalance = useCallback(async () => {
    try {
      const response = await userService.getCustomerTotalPoints(customerId, token);
      setUserBalance(response.total_points);
    } catch (error) {
      console.error("Erro ao obter saldo do usuário:", error);
      setError("Falha ao carregar o saldo do usuário.");
    }
  }, [customerId, token]);

  useEffect(() => {
    fetchAllProducts();
    fetchUserBalance();
  }, [fetchAllProducts, fetchUserBalance]);

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
    handleCloseModal();
  };

  const handlePurchase = async (product: Product) => {
    const priceNum = parseFloat(product.price.replace("R$", "").replace(",", "."));
    if (userBalance < priceNum) return;
    try {
      setPurchaseMessage("Processando compra...");
      const response = await userService.postTransaction(customerId, 0, product.id, token);
      if (response.status === 200 || 202) {
        setPurchaseMessage("");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setPurchaseMessage("Erro ao processar a compra. Tente novamente.");
    }
  };

  const getRemainingBalance = (product: Product) =>
    (userBalance - parseFloat(product.price.replace("R$", "").replace(",", "."))).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex w-full">
        <LeftBar selectedTab="Shop" />
        <div className="flex flex-col w-full px-6 py-10 sm:px-10 sm:ml-64 lg:ml-64">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-700">Carregando produtos...</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && (
            <div className="max-w-[1000px] mx-auto w-full mb-8">
              <h2 className="text-3xl font-extrabold text-[#0000C8] mb-4 text-center">
                Loja de Recompensas
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Seu Saldo: <span className="font-bold text-[#0000C8]">{userBalance.toFixed(2)}</span>
                </p>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0000C8] text-sm"
                    disabled
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Products Grid */}
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto w-full">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center"
                    >
                      <div
                        className="cursor-pointer mb-4"
                        onClick={() => handleProductClick(product)}
                      >
                        <Image
                          src={product.link_img}
                          alt={product.name}
                          className="h-48 w-48 object-cover rounded-lg"
                          width={192}
                          height={192}
                          loading="lazy"
                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        {product.name}
                      </h3>
                      <p className="text-[#0000C8] text-xl font-bold mb-4">{product.price}</p>
                      <button
                        className="w-full py-2 bg-[#0000C8] text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                        onClick={() => handleProductClick(product)}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
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
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedProduct.name}</h3>
                <p className="text-[#0000C8] text-xl font-extrabold mb-4">{selectedProduct.price}</p>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <p>Seu Saldo: <span className="font-semibold">{userBalance.toFixed(2)}</span></p>
                  <p>Valor do Item: <span className="font-semibold">{selectedProduct.price}</span></p>
                  <p>Saldo Restante: <span className="font-semibold">{getRemainingBalance(selectedProduct)}</span></p>
                </div>
                {userBalance < parseFloat(selectedProduct.price.replace("R$", "").replace(",", ".")) ? (
                  <p className="text-red-500 font-semibold mb-4">Saldo insuficiente</p>
                ) : purchaseMessage ? (
                  <p className={`font-semibold mb-4 ${purchaseMessage.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
                    {purchaseMessage}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 font-semibold rounded-full transition-colors ${
                    userBalance >= parseFloat(selectedProduct.price.replace("R$", "").replace(",", "."))
                      ? "bg-[#0000C8] text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => handlePurchase(selectedProduct)}
                  disabled={userBalance < parseFloat(selectedProduct.price.replace("R$", "").replace(",", "."))}
                >
                  Comprar Agora
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

      {/* Success Modal */}
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
              Sua solicitação foi enviada para análise. Confira seu email para mais detalhes.
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