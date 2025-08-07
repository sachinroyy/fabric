import React from "react";

const BrandSlider = () => {
  const brands = [
    { name: "Versace", img: "/images/varcas.png" },
    { name: "Zara", img: "/images/zara.png" },
    { name: "Gucci", img: "/images/gucci.png" },
    { name: "Prada", img: "/images/prada.png" },
    { name: "Calvin Klein", img: "/images/k.png" },
  ];

  return (
    <div className="bg-black overflow-hidden py-5">
      <div className="flex animate-scroll">
        {brands.concat(brands).map((brand, index) => (
          <div key={index} className="flex-shrink-0 mx-8">
            <img src={brand.img} alt={brand.name} className="h-12 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSlider;
