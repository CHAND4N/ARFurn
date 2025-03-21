import React from "react";
import bannerImg from "../../assets/banner.png";
import Products from "./Products";

const ShopPage = () => {
  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div
        className="w-full h-[400px] bg-cover bg-center flex items-center justify-center text-white text-center px-4"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          Shop Our Products
        </h1>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4">
        <Products headline="What's Your Choice?" />
      </div>
    </div>
  );
};

export default ShopPage;
