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
  const [userBalance, setUserBalance] = useState<number>(0); // Inicializa com 0
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
      setError("Falha ao carregar o saldo do usuário. Tente novamente mais tarde.");
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
    handleCloseModal(); // Also close the purchase modal
  };

  const handlePurchase = async (product: Product) => {
    const priceNum = parseFloat(product.price.replace("R$", "").replace(",", "."));
    if (userBalance < priceNum) return;

    try {
      setPurchaseMessage("Processando compra...");
      const response = await userService.postTransaction(customerId, 0, product.id, token);
      if (response.status === 200) {
        setPurchaseMessage("");
        setShowSuccessModal(true);
      } else {
        setPurchaseMessage("");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setPurchaseMessage("Erro ao processar a compra. Tente novamente.");
    }
  };

  const getRemainingBalance = (product: Product) => {
    return (userBalance - parseFloat(product.price.replace("R$", "").replace(",", "."))).toFixed(2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex w-full">
        <LeftBar selectedTab="Shop" />
        <div className="flex flex-col items-center justify-center w-full px-4 py-10 sm:px-10 sm:ml-20">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-[#0000C8]">
            Loja de Recompensas
          </h2>

          {isLoading ? (
            <p className="text-gray-600">Carregando produtos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1000px] w-full">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center transition-transform hover:scale-105"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <Image
                      src={product.link_img}
                      alt={product.name}
                      className="h-40 w-40 object-cover rounded-lg mb-4"
                      width={160}
                      height={160}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-image.jpg";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 text-center">
                    {product.name}
                  </h3>
                  <p className="text-[#0000C8] text-lg font-bold">
                    {product.price}
                  </p>
                  {/* <button
                    className="mt-3 px-4 py-2 bg-[#0000C8] text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleProductClick(product)}
                  >
                    Comprar
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedProduct && !showSuccessModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="md:w-1/2 p-4 flex items-center justify-center bg-gray-100">
              <Image
                src={selectedProduct.link_img}
                alt={selectedProduct.name}
                className="rounded-lg object-contain max-h-[400px]"
                width={400}
                height={400}
                quality={100}
                priority
              />
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-[#0000C8] text-xl font-bold mb-4">
                  {selectedProduct.price}
                </p>

                {/* Financial Info */}
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    Seu Saldo: <span className="font-bold"> {userBalance.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-600">
                    Valor do Item: <span className="font-bold">{selectedProduct.price}</span>
                  </p>
                  <p className="text-gray-600">
                    Saldo Restante: <span className="font-bold"> {getRemainingBalance(selectedProduct)}</span>
                  </p>
                </div>

                {/* Insufficient Balance Warning or Purchase Message */}
                {userBalance < parseFloat(selectedProduct.price.replace("R$", "").replace(",", ".")) ? (
                  <p className="text-red-500 font-bold mb-4">
                    Saldo insuficiente para realizar esta compra
                  </p>
                ) : purchaseMessage ? (
                  <p className={`font-bold mb-4 ${purchaseMessage.includes("Erro") ? "text-red-500" : "text-green-600"}`}>
                    {purchaseMessage}
                  </p>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  className={`px-4 py-2 font-bold rounded-full shadow-md transition-colors ${userBalance >= parseFloat(selectedProduct.price.replace("R$", "").replace(",", ".")) 
                      ? "bg-[#0000C8] text-white hover:bg-blue-700" 
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  onClick={() => handlePurchase(selectedProduct)}
                  disabled={userBalance < parseFloat(selectedProduct.price.replace("R$", "").replace(",", "."))}
                >
                  Confirmar Compra
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-colors"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseSuccessModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-6 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Solicitação Enviada!</h3>
            <p className="text-gray-600 mb-6">
              Sua solicitação foi enviada para análise! Mais informações serão enviadas para o seu email.
            </p>
            <button
              className="px-6 py-2 bg-[#0000C8] text-white font-bold rounded-full shadow-md hover:bg-blue-700 transition-colors"
              onClick={handleCloseSuccessModal}
            >
              Ok, Entendido
            </button>
          </div>
        </div>
      )}

      <BottomBar selectedTab="Shop" />
    </div>
  );
};

export default Shop;