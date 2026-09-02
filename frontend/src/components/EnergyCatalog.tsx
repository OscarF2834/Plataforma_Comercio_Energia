import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import energyCardFactory from '../patterns/factory/EnergyCardFactory';
import type { EnergySource } from '../patterns/factory/types';

interface Props {
  selectedEnergyType?: string | null;
  onSelect: (type: string | null) => void;
}

export default function EnergyCatalog({ selectedEnergyType, onSelect }: Props) {
  const [sources, setSources] = useState<EnergySource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();

  useEffect(() => {
    api.getSourceCatalog()
      .then((data) => {
        setSources(data);
        setError('');
      })
      .catch(() => setError('No se pudo cargar el catalogo de fuentes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p style={styles.label}>
        Selecciona el tipo de energia (tarjeta creada por la <strong>factory method</strong>):
      </p>
      {loading && <p>Cargando catalogo...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && (
        <div style={styles.grid}>
          {sources.map((source) => {
            const Card = energyCardFactory.create(source.type);
            const active = selectedEnergyType === source.type;
            return (
              <div
                key={source.type}
                onClick={() => onSelect(active ? null : source.type)}
                style={styles.cardButton(active)}
                title={active ? 'Clic para deseleccionar' : `Seleccionar ${source.name}`}
              >
                {active && <span style={styles.check}>Seleccionado</span>}
                <Card source={source} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, any> = {
  label: {
    margin: '0 0 12px 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  error: {
    color: '#c0392b',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  cardButton: (active: boolean): React.CSSProperties => ({
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    outline: active ? '3px solid #0f3460' : '3px solid transparent',
    boxShadow: active ? '0 4px 12px rgba(15,52,96,0.25)' : '0 2px 6px rgba(0,0,0,0.08)',
    opacity: active ? 1 : 0.85,
  }),
  check: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 2,
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
};
