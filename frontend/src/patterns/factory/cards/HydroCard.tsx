import type { EnergySource } from '../types';

export default function HydroCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <img className="energy-source-image" src="/images/hydro-energy.svg" alt="Agua limpia fluyendo entre montañas" />
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Hidraulica</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#e9f9f0',
  border: '2px solid #2ecc71',
  color: '#1c6b3f',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#1e8b4f' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
