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
  description: string;
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
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserBalance = useCallback(async () => {
    try {
      const response = await userService.getCustomerTotalPoints(customerId, token);
      setUserBalance(response.total_points);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      setError("Failed to load user balance.");
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
    const priceNum = parseFloat(product.price);
    if (userBalance < priceNum) return;
    try {
      setPurchaseMessage("Processing purchase...");
      const response = await userService.postTransaction(customerId, 0, product.id, token);
      if (response.status === 200 || response.status === 202) {
        setPurchaseMessage("");
        setShowSuccessModal(true);
        await fetchUserBalance(); // Refresh balance after purchase
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      setPurchaseMessage("Failed to process purchase. Please try again.");
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

  // Group products by description
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
      <div className="flex w-full">
        <LeftBar selectedTab="Shop" />
        <div className="flex flex-col w-full px-6 py-10 sm:px-10 sm:ml-64 lg:ml-64">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-700">Loading products...</p>
              </div>
            </div>
          )}

          {/* Main Content */}
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

              {/* Products Sections */}
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedProducts).map(([description, products]) => (
                    <div key={description}>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{description}</h3>
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
                            <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
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
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                <p className="text-[#0000C8] text-xl font-extrabold mb-4">{formatPrice(selectedProduct.price)}</p>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <p>Seu saldo: <span className="font-semibold">{formatPrice(userBalance)}</span></p>
                  <p>Preço do item: <span className="font-semibold">{formatPrice(selectedProduct.price)}</span></p>
                  <p>Saldo restante: <span className="font-semibold">{formatPrice(getRemainingBalance(selectedProduct))}</span></p>
                </div>
                {userBalance < parseFloat(selectedProduct.price) ? (
                  <p className="text-red-500 font-semibold mb-4">Insufficient balance</p>
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
              Sua solicitação foi enviada para análise. Verifique seu e-mail para mais detalhes.
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