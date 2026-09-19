import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6"; // 🚀 Tus React Icons

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#0b1329", // 🌌 El azul medianoche oscuro de tu .invert-color
        padding: "40px 24px",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", // Una línea finita divisoria
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* 🔤 Texto de derechos autorales */}
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
          © {new Date().getFullYear()} MercadoExpress. Desarrollado por{" "}
          <strong style={{ color: "#f8fafc" }}>Gastón Estévez</strong>.
        </p>

        {/* 🔗 Contenedor de redes sociales */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="https://github.com/GastonEE01"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#94a3b8", transition: "color 0.2s" }}
          >
            <FaGithub
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
            />
          </a>
          <a
            href="https://linkedin.com/in/gastonestevez01"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#94a3b8", transition: "color 0.2s" }}
          >
            <FaLinkedin
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
            />
          </a>
          <a
            href="mailto:estevezgaston01-email@gmail.com"
            style={{ color: "#94a3b8", transition: "color 0.2s" }}
          >
            <FaEnvelope
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
