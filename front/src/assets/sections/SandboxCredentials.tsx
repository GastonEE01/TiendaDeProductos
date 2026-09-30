import { useState } from "react";
import { FaLock, FaCopy, FaCheck, FaEnvelope } from "react-icons/fa6";

export const SandboxCredentials = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const credentials = {
    comprador: "comprador_prueba_unlam@testuser.com", 
    tarjeta: "5031 7557 3453 0604",
    vence: "11/30",
    cvv: "123",
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      style={{
        backgroundColor: "#111827",
        padding: "60px 24px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <FaLock color="#2563eb" size={18} />
          <h4
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Entorno de Laboratorio (Sandbox)
          </h4>
        </div>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.9rem",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}
        >
          Para simular compras automáticas seguras en internet sin usar dinero
          real, por favor abre la web en una
          <strong style={{ color: "#f8fafc" }}> pestaña de incógnito</strong> y
          utiliza las siguientes credenciales de prueba:
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              color: "#38bdf8",
              fontSize: "0.8rem",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "flex-start", 
              gap: "8px",
              textAlign: "left", 
              lineHeight: "1.4",
            }}
          >
            <FaEnvelope
              color="#38bdf8"
              size={14}
              style={{ marginTop: "2px" }}
            />

            <span>
              Nota: Si ingresás tu correo real, recibirás los comprobantes HTML
              oficiales en tu bandeja de entrada.
            </span>
          </span>
        </div>

        {/* Contenedor de las credenciales */}
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Fila del Mail */}
          <div
            style={{
              display: "flex",
              justifyContent: "between",
              alignItems: "center",
              backgroundColor: "#0f172a",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.03)",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                Usuario Comprador
              </span>
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                }}
              >
                {credentials.comprador}
              </span>
            </div>
            <button
              onClick={() => handleCopy(credentials.comprador, "mail")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: copiedField === "mail" ? "#10b981" : "#94a3b8",
                transition: "color 0.2s",
              }}
            >
              {copiedField === "mail" ? (
                <FaCheck size={14} />
              ) : (
                <FaCopy size={14} />
              )}
            </button>
          </div>

          {/* Fila de Tarjeta, Vence y CVV */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {/* Tarjeta */}
            <div
              style={{
                display: "flex",
                justifyContent: "between",
                alignItems: "center",
                backgroundColor: "#0f172a",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.03)",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    display: "block",
                    textTransform: "uppercase",
                  }}
                >
                  N° Tarjeta
                </span>
                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  {credentials.tarjeta}
                </span>
              </div>
              <button
                onClick={() => handleCopy(credentials.tarjeta, "card")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copiedField === "card" ? "#10b981" : "#94a3b8",
                }}
              >
                {copiedField === "card" ? (
                  <FaCheck size={14} />
                ) : (
                  <FaCopy size={14} />
                )}
              </button>
            </div>

            {/* Vence */}
            <div
              style={{
                backgroundColor: "#0f172a",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                Vence
              </span>
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                }}
              >
                {credentials.vence}
              </span>
            </div>

            {/* CVV */}
            <div
              style={{
                backgroundColor: "#0f172a",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                CVV
              </span>
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                }}
              >
                {credentials.cvv}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SandboxCredentials;
