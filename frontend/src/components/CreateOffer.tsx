import { useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import EnergyCatalog from './EnergyCatalog';

interface Props {
  onOfferCreated: () => void;
  selectedEnergyType?: string | null;
  onSelectEnergyType?: (type: string | null) => void;
}

export default function CreateOffer({ onOfferCreated, selectedEnergyType, onSelectEnergyType }: Props) {
  const [producerName, setProducerName] = useState('');
  const [totalKwh, setTotalKwh] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const api = EnergyApiService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createOffer({
        producerName,
        totalKwh: parseFloat(totalKwh),
        availableKwh: 0,
        pricePerKwh: parseFloat(pricePerKwh),
        description,
        energyType: selectedEnergyType || undefined,
      });
      setProducerName('');
      setTotalKwh('');
      setPricePerKwh('');
      setDescription('');
      onSelectEnergyType?.(null);
      onOfferCreated();
    } catch (error) {
      console.error('Error al crear oferta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Publicar Excedente de Energia</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.catalogWrapper}>
          <EnergyCatalog
            selectedEnergyType={selectedEnergyType}
            onSelect={onSelectEnergyType ?? (() => {})}
          />
        </div>
        <input
          type="text"
          placeholder="Nombre del productor"
          value={producerName}
          onChange={(e) => setProducerName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Cantidad total (kWh)"
          value={totalKwh}
          onChange={(e) => setTotalKwh(e.target.value)}
          required
          min="0.1"
          step="0.1"
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Precio por kWh (COP)"
          value={pricePerKwh}
          onChange={(e) => setPricePerKwh(e.target.value)}
          required
          min="1"
          style={styles.input}
        />
        <textarea
          placeholder="Descripcion (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Publicando...' : 'Publicar Oferta'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 16px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  catalogWrapper: {
    paddingBottom: '16px',
    marginBottom: '4px',
    borderBottom: '1px solid #e8e8e8',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    minHeight: '60px',
    resize: 'vertical',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
