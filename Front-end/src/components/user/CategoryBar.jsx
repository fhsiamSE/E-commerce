import React from "react";
import { Link } from "react-router-dom";
import Meat from "../../assets/CatagoryImages/Meat.jpg";
import Beans from "../../assets/CatagoryImages/Beans.jpg";
import Fish from "../../assets/CatagoryImages/Fish.png";
import Snacks from "../../assets/CatagoryImages/Snacks.jpg";
import Drinks from "../../assets/CatagoryImages/Drinks.jpg";
import Vegetables from "../../assets/CatagoryImages/vegetables.jpg";
import spices from "../../assets/CatagoryImages/Cooking&Spices.jpg";
import Rice from "../../assets/CatagoryImages/Rice&Flour.jpg";


const categories = [
   {
    name: "Rice & Flour",
    image: Rice,
    href: "/category/rice-and-flour",
  },
  {
    name: "Meat",
    image: Meat,
    href: "/category/meat",
  },
  {
    name: "Fish",
    image: Fish,
    href: "/category/fish",
  },
  {
    name: "Vegetables",
    image: Vegetables,
    href: "/category/vegetables",
  },
  {
    name: "Beans",
    image: Beans,
    href: "/category/beans",
  },
  {
    name: "Spices & Oils",
    image: spices,
    href: "/category/spices-and-cooking",
  },
  {
    name: "Snacks",
    image: Snacks,
    href: "/category/snacks",
  },
  {
    name: "Drinks",
    image: Drinks,
    href: "/category/drinks",
  },

];

export default function CategoryBar() {
  return (
    <nav
      aria-label="Category navigation"
      className="mx-auto w-full max-w-6xl px-4 py-8"
    >
      <div className="grid grid-cols-4 justify-items-center gap-12 sm:grid-cols-3 md:grid-cols-8 md:gap-24">

        {categories.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="group flex cursor-pointer flex-col items-center focus:outline-none"
          >

            {/* Circle */}

            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-stone-100 transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-stone-400 sm:h-28 sm:w-28">

              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />

            </div>

            {/* Name */}

            <span className="mt-3 text-sm font-semibold text-stone-900 transition-colors group-hover:text-stone-600">
              {item.name}
            </span>

          </Link>
        ))}

      </div>
    </nav>
  );
}