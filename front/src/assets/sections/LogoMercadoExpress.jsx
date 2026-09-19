import React from 'react';
import { FaBoltLightning } from 'react-icons/fa6'; // Un rayo moderno y veloz

export const LogoMercadoExpress = () => {
  return (
    <a href="/" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      textDecoration: 'none' 
    }}>
      {/* ⚡ El isotipo: Círculo azul con el rayo neón adentro */}
      <div style={{
        backgroundColor: 'rgba(240, 242, 248, 0.1)',
        padding: '8px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(37, 99, 235, 0.2)'
      }}>
        <FaBoltLightning size={25} color="#2563eb" />
      </div>

      {/* 🔤 El logotipo: Texto con peso visual */}
      <span style={{
        color: '#f8fafc',
        fontWeight: 800,
        fontSize: '3.75rem',
        letterSpacing: '-0.03em',
        fontFamily: 'Inter, sans-serif'
      }}>
        Mercado<span style={{ color: '#2563eb' }}>Express</span>
      </span>
    </a>
  );
};
