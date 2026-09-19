import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import heroImage from '../images/heroImage.jpeg';
import {LogoMercadoExpress}  from '../sections/LogoMercadoExpress'

class HeroSection extends React.Component {
  render() {
    const { className, topOuterDivider, bottomOuterDivider, hasBgColor, invertColor, invertMobile, invertDesktop, alignTop, ...props } = this.props;

    const outerClasses = classNames('hero section', topOuterDivider && 'has-top-divider', bottomOuterDivider && 'has-bottom-divider', hasBgColor && 'has-bg-color', invertColor && 'invert-color', className);
    const innerClasses = classNames('hero-inner section-inner', this.props.topDivider && 'has-top-divider', this.props.bottomDivider && 'has-bottom-divider');
    const splitClasses = classNames('split-wrap', invertMobile && 'invert-mobile', invertDesktop && 'invert-desktop', alignTop && 'align-top');

    return (
      <section {...props} className={outerClasses}>
        <div className="container">
          <div className={innerClasses}>
            <div className={splitClasses}>
              <div className="split-item">
                <div className="hero-content split-item-content center-content-mobile reveal-from-top">
                  <LogoMercadoExpress/>
                  <p className="mt-0 mb-32">
                    Una plataforma moderna que conecta compradores invitados con vendedores en tiempo real. Procesamiento de pagos seguro y flujos automatizados.
                  </p>
                  <ButtonGroup>
                    {/* 🚀 RECTIFICADO: Apunta a tu catálogo del cliente */}
                    <Button tag="a" color="primary" href="/client" wideMobile>
                      Comprar como Invitado
                    </Button>
                    {/* 🚀 RECTIFICADO: Apunta a tu login del admin */}
                    <Button tag="a" color="dark" href="/login" wideMobile>
                      Panel de Vendedor
                    </Button>                    
                  </ButtonGroup>
                </div>
                <div className="hero-figure split-item-image split-item-image-fill illustration-element-01 reveal-from-bottom">
                  <div>
                    <Image src={heroImage} alt="Hero" width={528} height={396} />
                  </div>
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
