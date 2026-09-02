import type { EnergySource } from '../types';

export default function WindCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '2rem' }}>🌬️</div>
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Eolica</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#eaf4fb',
  border: '2px solid #3498db',
  color: '#1f5a85',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#1f6fa5' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
