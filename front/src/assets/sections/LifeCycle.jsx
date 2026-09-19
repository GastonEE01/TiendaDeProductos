import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import { FaBolt, FaCreditCard, FaCircleCheck } from "react-icons/fa6"; // 🚀 Nuevos íconos de proceso

class LifeCycle extends React.Component {
  render() {
    const { className, topOuterDivider, bottomOuterDivider, topDivider, bottomDivider, hasBgColor, invertColor, pushLeft, ...props } = this.props;

    const outerClasses = classNames('news section', topOuterDivider && 'has-top-divider', bottomOuterDivider && 'has-bottom-divider', hasBgColor && 'has-bg-color', invertColor && 'invert-color', className);
    const innerClasses = classNames('news-inner section-inner', topDivider && 'has-top-divider', bottomDivider && 'has-bottom-divider');
    const tilesClasses = classNames('tiles-wrap', pushLeft && 'push-left');

    const sectionHeader = {
      title: '¿Cómo funciona el circuito de tu pedido?',
      paragraph: 'Desde el momento en que confirmás el carrito hasta que el paquete llega a tus manos, el sistema coordina cada paso de forma segura.'
    };

    return (
      <section {...props} className={outerClasses}>
        <div className="container">
          <div className={innerClasses}>
            <SectionHeader data={sectionHeader} className="center-content reveal-from-bottom" />
            <div className={tilesClasses}>

              {/* TARJETA 1 */}
              <div className="tiles-item reveal-from-bottom">
                {/* 🚀 CORREGIDO: Le agregamos textAlign: 'center' para centrar el icono y los textos */}
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    {/* 🚀 RECTIFICADO: Tarjeta de crédito para pago aprobado */}
                    <FaCreditCard color='#2563eb' size={45} />
                  </div>
                  <div className="news-item-content">
                    <h3 className="news-item-title h4 mt-0 mb-8">1. Pago Verificado</h3>
                    <p className="m-0 text-sm">
                      Una vez que el cliente completa el pago a través de la pasarela, el sistema procesa la transacción de forma inmediata y asegura el stock de los productos comprados.
                    </p>
                  </div>
                </div>
              </div>

              {/* TARJETA 2 */}
              <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    <FaBolt color='#2563eb' size={45} />
                  </div>
                  <div className="news-item-content">
                    <h3 className="news-item-title h4 mt-0 mb-8">2. Notificación y Despacho</h3>
                    <p className="m-0 text-sm">
                      Al vendedor le suena una alerta automática en su panel con los datos de entrega. Prepara el paquete, lo lleva al correo y marca el pedido como "En camino".
                    </p>
                  </div>
                </div>
              </div>

              {/* TARJETA 3 */}
              <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
                <div className="tiles-item-inner has-shadow" style={{ textAlign: 'center', padding: '30px' }}>
                  <div className="mb-16">
                    {/* 🚀 RECTIFICADO: Tilde de éxito para entrega garantizada */}
                    <FaCircleCheck color='#2563eb' size={45} />
                  </div>
                  <div className="news-item-content">
                    <h3 className="news-item-title h4 mt-0 mb-8">3. Entrega Garantizada</h3>
                    <p className="m-0 text-sm">
                      El comprador hace el seguimiento desde su pantalla y, cuando el repartidor llega a su casa, presiona el botón de recibido para finalizar la venta con éxito.
                    </p>
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

LifeCycle.propTypes = SectionTilesProps.types;
LifeCycle.defaultProps = SectionTilesProps.defaults;

export default LifeCycle;
