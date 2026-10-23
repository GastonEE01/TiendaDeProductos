import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa6"; // 🚀 Tus React Icons
import { isTauri } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import toast from "react-hot-toast";

/** @param {{ className?: string }} props */
export const Footer = ({ className }) => {
  const handleExternalLinkClick = async (event) => {
    if (!isTauri()) return;

    event.preventDefault();
    const url = event.currentTarget.href;

    try {
      await openUrl(url);
    } catch (error) {
      console.error("No se pudo abrir el enlace externo:", error);
      toast.error(
        "No se pudo abrir el enlace. Verificá la configuración de aplicaciones predeterminadas.",
      );
    }
  };

  return (
    <footer
      className={className}
      style={{
        backgroundColor: "#0B1120",
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
        <p style={{ margin: 0, color: "#FFFFFF", fontSize: "0.95rem" }}>
          © {new Date().getFullYear()} Nexus Shop. Desarrollado por{" "}
          <strong style={{ color: "#FFFFFF" }}>Gastón Estévez</strong>.
        </p>

        {/* 🔗 Contenedor de redes sociales */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="https://github.com/GastonEE01"
            target="_blank"
            rel="noreferrer"
            onClick={handleExternalLinkClick}
            style={{ color: "#FFFFFF", transition: "color 0.2s" }}
          >
            <FaGithub
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            />
          </a>
          <a
            href="https://linkedin.com/in/gastonestevez01"
            target="_blank"
            rel="noreferrer"
            onClick={handleExternalLinkClick}
            style={{ color: "#FFFFFF", transition: "color 0.2s" }}
          >
            <FaLinkedin
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            />
          </a>
          <a
            href="mailto:estevezgaston01-email@gmail.com"
            onClick={handleExternalLinkClick}
            style={{ color: "#FFFFFF", transition: "color 0.2s" }}
          >
            <FaEnvelope
              size={22}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
