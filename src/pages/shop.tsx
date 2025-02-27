import type { NextPage } from "next";
import React from "react";

import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";

const products = [
  { id: 1, name: "Produto 1", price: "R$ 29,99", image: "/path/to/product1.jpg" },
  { id: 2, name: "Produto 2", price: "R$ 49,99", image: "/path/to/product2.jpg" },
  { id: 3, name: "Produto 3", price: "R$ 19,99", image: "/path/to/product3.jpg" },
  { id: 4, name: "Produto 4", price: "R$ 39,99", image: "/path/to/product4.jpg" },
  { id: 5, name: "Produto 5", price: "R$ 59,99", image: "/path/to/product5.jpg" },
  { id: 6, name: "Produto 6", price: "R$ 24,99", image: "/path/to/product6.jpg" }
];

const Shop: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar />
      <div className="flex w-full">
        <LeftBar selectedTab="Shop" />
        <div className="flex flex-col items-center justify-center w-full px-10 py-10 ml-20">
          <h2 className="mb-6 text-3xl font-bold text-[#0000C8]">Loja de Recompensas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1000px] w-full">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
                <img src={product.image} alt={product.name} className="h-40 w-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-bold text-gray-700">{product.name}</h3>
                <p className="text-[#0000C8] text-lg font-bold">{product.price}</p>
                <button className="mt-3 px-4 py-2 bg-[#0000C8] text-white font-bold rounded-full shadow-md hover:bg-blue-700">
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomBar selectedTab="Shop" />
    </div>
  );
};

export default Shop;
