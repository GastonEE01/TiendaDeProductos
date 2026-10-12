import React from "react";
import classNames from "classnames";
import { SectionSplitProps } from "../../utils/SectionProps";
import ButtonGroup from "../elements/ButtonGroup";
import Button from "../elements/Button";
import Image from "../elements/Image";
import heroImage from "../images/heroImage.png";
import { LogoNexusShopHex } from "./LogoNexusShopHex";
import { LuMonitorDown } from "react-icons/lu";

class HeroSection extends React.Component {
  render() {
    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      hasBgColor,
      invertColor,
      invertMobile,
      invertDesktop,
      alignTop,
      ...props
    } = this.props;

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
      this.props.topDivider && "has-top-divider",
      this.props.bottomDivider && "has-bottom-divider",
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
                className="split-item"
                style={{
                  gridTemplateColumns: "1fr 1.2fr",
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
                    <Button tag="a" color="primary" href="/client" wideMobile>
                      Comprar como Invitado
                    </Button>
                    <Button tag="a" color="dark" href="/login" wideMobile>
                      Panel de Vendedor
                    </Button>

                    <a
                      href="/NexusShop-Setup.exe"
                      download="NexusShop-Setup.exe"
                      className="btn-download-pc"
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#0066ff",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <LuMonitorDown size={20} />
                      Descargar para Windows
                    </a>

                  </ButtonGroup>
                </div>
                <div className="hero-figure split-item-image split-item-image-fill illustration-element-01 reveal-from-bottom">
                  <Image
                    src={heroImage}
                    alt="MercadoExpress Catálogo"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "16px",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

HeroSection.propTypes = SectionSplitProps.types;
HeroSection.defaultProps = SectionSplitProps.defaults;

export default HeroSection;
