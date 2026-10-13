import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import headphonesImage from "../images/hero-products/headphones.jpg";
import sneakersImage from "../images/hero-products/sneakers.jpg";
import shirtImage from "../images/hero-products/shirt.jpg";
import pantsImage from "../images/hero-products/pants.jpg";

const featuredProducts = [
  {
    name: "Auriculares Gamer Pro",
    category: "Gaming",
    image: headphonesImage,
    imageAlt: "Auriculares negros con micrófono",
  },
  {
    name: "Zapatillas urbanas",
    category: "Calzado",
    image: sneakersImage,
    imageAlt: "Zapatilla deportiva blanca",
  },
  {
    name: "Remera deportiva",
    category: "Indumentaria",
    image: shirtImage,
    imageAlt: "Remera negra de manga corta",
  },
  {
    name: "Pantalón deportivo",
    category: "Indumentaria",
    image: pantsImage,
    imageAlt: "Pantalón deportivo negro",
  },
];

export const HeroProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeProduct = featuredProducts[activeIndex];

  const showPrevious = () => setActiveIndex((index) => Math.max(0, index - 1));
  const showNext = () =>
    setActiveIndex((index) => Math.min(featuredProducts.length - 1, index + 1));

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;

        if (startX === null || endX === undefined) {
          return;
        }

        const swipeDistance = endX - startX;
        if (swipeDistance > 45) {
          showPrevious();
        } else if (swipeDistance < -45) {
          showNext();
        }
      }}
    >
      <div className="hero-carousel-heading">
        <span>Productos destacados</span>
        <span aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(featuredProducts.length).padStart(2, "0")}
        </span>
      </div>

      <article
        className="hero-carousel-card"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="hero-carousel-image-frame">
          <img
            key={activeProduct.image}
            src={activeProduct.image}
            alt={activeProduct.imageAlt}
            className="hero-carousel-image"
          />
        </div>
        <div className="hero-carousel-product-info">
          <span className="hero-carousel-category">{activeProduct.category}</span>
          <h2>{activeProduct.name}</h2>
          <p>Descubrí más productos en nuestra tienda.</p>
        </div>
      </article>

      <div className="hero-carousel-controls">
        <button
          type="button"
          className="hero-carousel-arrow"
          aria-label="Producto anterior"
          onClick={showPrevious}
          disabled={activeIndex === 0}
        >
          <FaChevronLeft aria-hidden="true" />
        </button>

        <div className="hero-carousel-dots" aria-label="Elegir producto">
          {featuredProducts.map((product, index) => (
            <button
              key={product.name}
              type="button"
              className={`hero-carousel-dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Mostrar ${product.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="hero-carousel-arrow"
          aria-label="Siguiente producto"
          onClick={showNext}
          disabled={activeIndex === featuredProducts.length - 1}
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
