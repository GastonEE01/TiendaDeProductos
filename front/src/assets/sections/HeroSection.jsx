import React from "react";
import classNames from "classnames";
import { SectionSplitProps } from "../../utils/SectionProps";
import ButtonGroup from "../elements/ButtonGroup";
//import Button from "../elements/Button";
import { LogoNexusShopHex } from "./LogoNexusShopHex";
import { HeroProductCarousel } from "./HeroProductCarousel";
import { LuMonitorDown, LuSmartphone } from "react-icons/lu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";

export const HeroSection = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  topDivider,
  bottomDivider,
  ...props
} = {}) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installHelpOpen, setInstallHelpOpen] = useState(false);

  // 2. SEGUNDO: Declarar los efectos (useEffect)
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // 3. TERCERO: Funciones auxiliares o handlers
  const handleMobileInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
      }
      return;
    }
    setInstallHelpOpen(true);
  };

  const outerClasses = classNames(
    "hero section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className,
  );
  const innerClasses = classNames(
    "hero-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider",
  );
  const splitClasses = classNames(
    "split-wrap",
    invertMobile && "invert-mobile",
    invertDesktop && "invert-desktop",
    alignTop && "align-top",
  );

  return (
    <section {...props} className={outerClasses}>
      <div
        className="container"
        style={{ width: "min(1280px, calc(100% - 48px))" }}
      >
        <div className={innerClasses}>
          <div className={splitClasses}>
            <div
              className="split-item hero-split"
              style={{
                gap: "40px",
                alignItems: "center",
              }}
            >
              <div className="hero-content split-item-content center-content-mobile reveal-from-top">
                <LogoNexusShopHex
                  size={{ xs: 38, sm: 50 }}
                  fontSize={{ xs: "1.5rem", sm: "2rem" }}
                />

                <p className="mt-0 mb-32">
                  Una plataforma moderna que conecta compradores invitados con
                  vendedores en tiempo real. Procesamiento de pagos seguro y
                  flujos automatizados.
                </p>
                <ButtonGroup>
                  <Button
                    href="/client"
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      backgroundColor: "#00e5ff",
                      color: "#0B1120",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 18px rgba(0, 229, 255, 0.2)",
                      "&:hover": {
                        backgroundColor: "#7dd3fc",
                        boxShadow: "0 6px 22px rgba(0, 229, 255, 0.3)",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #00e5ff",
                        outlineOffset: "3px",
                      },
                    }}
                  >
                    Comprar como Invitado
                  </Button>
                  <Button
                    href="/login"
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      backgroundColor: "#00e5ff",
                      color: "#0B1120",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 18px rgba(0, 229, 255, 0.2)",
                      "&:hover": {
                        backgroundColor: "#7dd3fc",
                        boxShadow: "0 6px 22px rgba(0, 229, 255, 0.3)",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #00e5ff",
                        outlineOffset: "3px",
                      },
                    }}
                  >
                    Iniciar sesión o crear cuenta
                  </Button>

                  <a
                    href="https://github.com/GastonEE01/TiendaDeProductos/releases/download/v0.1.0/Nexus.Shop_0.1.3_x64-setup.zip"
                    download="NexusShop-Setup.exe"
                    className="btn-download-pc hero-install-button"
                  >
                    <LuMonitorDown size={20} />
                    Descargar para Windows
                  </a>
                  <Button
                    variant="contained"
                    className="hero-install-button"
                    startIcon={<LuSmartphone size={20} />}
                    onClick={handleMobileInstall}
                    sx={{
                      padding: "12px 24px",
                      backgroundColor: "#111a2d",
                      color: "#e0f2fe",
                      border: "1px solid rgba(125, 211, 252, 0.35)",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1d4ed8",
                        borderColor: "#00e5ff",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Instalar en el celular
                  </Button>
                </ButtonGroup>
              </div>
              <Dialog
                open={installHelpOpen}
                onClose={() => setInstallHelpOpen(false)}
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: "#12211B",
                      color: "#F4F6F2",
                      border: "1px solid #2A3B33",
                      borderRadius: 3,
                      maxWidth: 440,
                    },
                  },
                }}
              >
                <DialogTitle
                  sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}
                >
                  Instalar Finova en tu celular
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: "#2A3B33" }}>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    1. Abrí esta página en el navegador de tu celular.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    2. Tocá el botón <b>Compartir</b> (iPhone: ícono de cuadrado
                    con flecha) o el <b>menú ⋮</b> (Android).
                  </Typography>
                  <Typography variant="body1">
                    3. Elegí <b>&quot;Agregar a pantalla de inicio&quot;</b>{" "}
                    (iPhone) o <b>&quot;Instalar aplicación&quot;</b> (Android).
                    Listo: Finova queda como una app.
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button
                    onClick={() => setInstallHelpOpen(false)}
                    variant="outlined"
                    sx={{
                      borderColor: "#2A3B33",
                      color: "#F4F6F2",
                      textTransform: "none",
                      "&:hover": { borderColor: "#3AA586" },
                    }}
                  >
                    Entendido
                  </Button>
                </DialogActions>
              </Dialog>

              <div className="hero-figure split-item-image split-item-image-fill illustration-element-01 reveal-from-bottom">
                <HeroProductCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = SectionSplitProps.types;
HeroSection.defaultProps = SectionSplitProps.defaults;

export default HeroSection;
