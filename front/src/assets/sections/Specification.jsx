import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import { FaBell, FaUserCheck, FaTruck } from "react-icons/fa6"; // 🚀 Icono de camión inyectado

class Specification extends React.Component {
  render() {
    const { className, topOuterDivider, bottomOuterDivider, topDivider, bottomDivider, hasBgColor, invertColor, pushLeft, ...props } = this.props;

    const outerClasses = classNames('features-tiles section', topOuterDivider && 'has-top-divider', bottomOuterDivider && 'has-bottom-divider', hasBgColor && 'has-bg-color', invertColor && 'invert-color', className);
    const innerClasses = classNames('features-tiles-inner section-inner', topDivider && 'has-top-divider', bottomDivider && 'has-bottom-divider');
    const tilesClasses = classNames('tiles-wrap', pushLeft && 'push-left');

    const sectionHeader = {
      title: 'La Forma más Simple de Comprar y Vender Online',
      paragraph: 'Una plataforma diseñada para eliminar las vueltas. Sin registros eternos para los compradores y con control absoluto para los comercios.'
    };

    return (
      <section {...props} className={outerClasses}>
        <div className="container">
          <div className={innerClasses}>
            <SectionHeader data={sectionHeader} className="center-content reveal-from-bottom" />
            <div className={tilesClasses}>

              {/* COLUMNA 1 */}
              <div className="tiles-item reveal-from-bottom">
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    <FaUserCheck color='#2563eb' size={45} />
                  </div>
                  <h3 className="h4 mt-0 mb-8">Compra Directa como Invitado</h3>
                  <p className="text-sm m-0">
                    Los compradores no necesitan crearse una cuenta ni recordar contraseñas. Eligen sus prendas, cargan sus datos de envío en el carrito y pagan de forma directa.
                  </p>
                </div>
              </div>

              {/* COLUMNA 2 */}
              <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    {/* 🚀 RECTIFICADO: Ícono de camión para logística */}
                    <FaTruck color='#2563eb' size={45} />
                  </div>
                  <h3 className="h4 mt-0 mb-8">Logística y Envíos Claros</h3>
                  <p className="text-sm m-0">
                    Flexibilidad en las entregas. El sistema permite al cliente elegir entre retirar su paquete de forma presencial por el local o coordinar un envío directo a su domicilio.
                  </p>
                </div>
              </div>

              {/* COLUMNA 3 */}
              <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    <FaBell color='#2563eb' size={45} />
                  </div>
                  <h3 className="h4 mt-0 mb-8">Control Total para Comercios</h3>
                  <p className="text-sm m-0">
                    Cada vendedor cuenta con un panel privado donde recibe alertas automáticas en el instante exacto en que se concreta una venta, permitiéndole preparar el despacho de inmediato.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}

Specification.propTypes = SectionTilesProps.types;
Specification.defaultProps = SectionTilesProps.defaults;

export default Specification;
