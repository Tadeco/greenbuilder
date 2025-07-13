import React from 'react';
import WizardInventarioGEE from './WizardInventarioGEE';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #a5d6a7 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
    }}>
      <h1 style={{
        color: '#2e7d32',
        fontWeight: 800,
        fontSize: '2.5rem',
        marginBottom: 8,
        textAlign: 'center',
        textShadow: '0 2px 8px #fff8',
      }}>
        Inventário de <span style={{ color: '#fbc02d', textDecoration: 'underline' }}>Gases de Efeito Estufa (GEE)</span>
      </h1>
      <p style={{
        color: '#388e3c',
        fontSize: '1.15rem',
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 600,
        textShadow: '0 1px 4px #fff8',
      }}>
        Ferramenta completa para inventário e cálculo de emissões, seguindo o GHG Protocol brasileiro (CETESB/FGV). Foco em sustentabilidade corporativa.
      </p>
      <div style={{ width: '100%', maxWidth: 800 }}>
        <WizardInventarioGEE />
      </div>
      <footer style={{ marginTop: 40, color: '#388e3c', fontSize: 14, opacity: 0.7 }}>
        © {new Date().getFullYear()} Inventário GEE • Sustentabilidade e Responsabilidade Ambiental
      </footer>
    </div>
  );
}

export default App;
