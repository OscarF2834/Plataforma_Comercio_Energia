import { useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';

interface Props {
  onOfferCreated: () => void;
}

export default function CreateOffer({ onOfferCreated }: Props) {
  const [producerName, setProducerName] = useState('');
  const [totalKwh, setTotalKwh] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'solar' | 'wind'>('solar');
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
        type,
      });

      setProducerName('');
      setTotalKwh('');
      setPricePerKwh('');
      setDescription('');
      setType('solar');

      onOfferCreated();
    } catch (error) {
      console.error('Error al crear oferta:', error);
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        Publicar Excedente de Energía
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          placeholder="Nombre del productor"
          value={producerName}
          onChange={(e) => setProducerName(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'solar' | 'wind')}
          style={styles.input}
        >
          <option value="solar">
            Energía Solar
          </option>

          <option value="wind">
            Energía Eólica
          </option>
        </select>

        <input
          type="number"
          placeholder="Cantidad total (kWh)"
          value={totalKwh}
          onChange={(e) => setTotalKwh(e.target.value)}
          required
          min="1"
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
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? 'Publicando...'
            : 'Publicar Oferta'}
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
    backgroundColor: '#fff',
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