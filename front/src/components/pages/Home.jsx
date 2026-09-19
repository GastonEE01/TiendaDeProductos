import React from "react";
import HeroSplit from "../../assets/sections/HeroSection";
import Specification from "../../assets/sections/Specification"; // 💡 Asegurate de que empiece con mayúscula la 'S'
import LifeCycle from "../../assets/sections/LifeCycle";
import Footer from "../../assets/sections/Footer";

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        {/* 1. Sección de Bienvenida (Fondo Oscuro por el invertColor) */}
        <HeroSplit hasBgColor invertColor />

        {/* 2. Características Técnicas (Fondo Blanco de tres columnas) */}
        <Specification className="illustration-section-01" />

        {/* 3. Ciclo de Vida del pedido (Tarjetas Grises de seguimiento) */}
        <LifeCycle className="illustration-section-01" />

        <Footer className="illustration-section-01" />
      </React.Fragment>
    );
  }
}

export default Home;
