import type { EnergySource } from '../types';

export default function SolarCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '2rem' }}>☀️</div>
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Solar</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#fdf3e3',
  border: '2px solid #f39c12',
  color: '#7a5200',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#8a5a00' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
