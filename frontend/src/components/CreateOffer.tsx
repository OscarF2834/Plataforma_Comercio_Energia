import { useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import { EnergyOfferBuilder } from '../patterns/builder/EnergyOfferBuilder';
import { OfferDirector } from '../patterns/builder/OfferDirector';
import EnergyCatalog from './EnergyCatalog';

interface Props {
  onOfferCreated: () => void;
  selectedEnergyType?: string | null;
  onSelectEnergyType?: (type: string | null) => void;
}

const STEPS = [
  { step: 1, label: 'Productor' },
  { step: 2, label: 'Tipo energia' },
  { step: 3, label: 'Cantidad' },
  { step: 4, label: 'Precio' },
  { step: 5, label: 'Descripcion' },
  { step: 6, label: 'Construir' },
];

export default function CreateOffer({ onOfferCreated, selectedEnergyType, onSelectEnergyType }: Props) {
  const [step, setStep] = useState(1);
  const [producerName, setProducerName] = useState('');
  const [totalKwh, setTotalKwh] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState<'' | 'custom' | 'express'>('');

  const api = EnergyApiService.getInstance();

  const qty = parseFloat(totalKwh);
  const price = parseFloat(pricePerKwh);

  const stepValid: Record<number, boolean> = {
    1: producerName.trim().length > 0,
    2: !!selectedEnergyType,
    3: Number.isFinite(qty) && qty > 0,
    4: Number.isFinite(price) && price >= 0,
    5: true,
    6: true,
  };

  const resetAll = () => {
    setProducerName('');
    setTotalKwh('');
    setPricePerKwh('');
    setDescription('');
    setError('');
    setStep(1);
    onSelectEnergyType?.(null);
  };

  const buildCustomOffer = () =>
    new OfferDirector(new EnergyOfferBuilder()).buildFromRequest({
      producerName: producerName.trim(),
      totalKwh: qty,
      pricePerKwh: price,
      energyType: selectedEnergyType!,
      description,
    });

  const handlePublish = async () => {
    if (!stepValid[1] || !stepValid[2] || !stepValid[3] || !stepValid[4]) {
      setError('Completa todos los pasos para construir la oferta.');
      return;
    }
    setPublishing('custom');
    setError('');
    try {
      // El Builder construye la oferta con los datos del asistente
      const offer = buildCustomOffer();
      const result = await api.createOffer(offer);
      alert(`Oferta #${result.id} publicada correctamente.`);
      resetAll();
      onOfferCreated();
    } catch {
      setError('No se pudo publicar la oferta. Revisa los datos.');
    } finally {
      setPublishing('');
    }
  };

  const handlePublishExpress = async () => {
    if (!stepValid[1] || !stepValid[2] || !stepValid[3]) {
      setError('Necesitas productor, tipo de energia y cantidad para la oferta expres.');
      return;
    }
    setPublishing('express');
    setError('');
    try {
      // El Director del backend completa el precio con ConfigService
      const result = await api.createExpressOffer({
        producerName: producerName.trim(),
        totalKwh: qty,
        energyType: selectedEnergyType!,
      });
      alert(`Oferta expres #${result.id} publicada ($${result.pricePerKwh} COP/kWh por defecto).`);
      resetAll();
      onOfferCreated();
    } catch {
      setError('No se pudo publicar la oferta expres. Revisa los datos.');
    } finally {
      setPublishing('');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Publicar Excedente de Energia</h2>
      <p style={styles.subtitle}>
        La oferta se construye con el patron <strong>Builder</strong> (Director + EnergyOfferBuilder).
      </p>

      <div style={styles.stepsBar}>
        {STEPS.map((s) => {
          const done = s.step < step;
          const active = s.step === step;
          return (
            <div key={s.step} style={{ ...styles.stepPill, ...(active ? styles.stepActive : {}), ...(done ? styles.stepDone : {}) }}>
              {done ? '✓' : s.step}
            </div>
          );
        })}
      </div>

      <div style={styles.stepContent}>
        {step === 1 && (
          <label style={styles.label}>
            <strong>Paso 1 · Nombre del productor</strong>
            <input
              type="text"
              placeholder="Ej: Juan Perez"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        )}

        {step === 2 && (
          <div>
            <p style={styles.label}>
              <strong>Paso 2 · Tipo de energia (clasificada con Factory Method)</strong>
            </p>
            <EnergyCatalog selectedEnergyType={selectedEnergyType} onSelect={onSelectEnergyType ?? (() => {})} />
          </div>
        )}

        {step === 3 && (
          <label style={styles.label}>
            <strong>Paso 3 · Cantidad total (kWh)</strong>
            <input
              type="number"
              placeholder="Ej: 15"
              value={totalKwh}
              onChange={(e) => setTotalKwh(e.target.value)}
              required
              min="0.1"
              step="0.1"
              style={styles.input}
            />
          </label>
        )}

        {step === 4 && (
          <label style={styles.label}>
            <strong>Paso 4 · Precio por kWh (COP)</strong>
            <input
              type="number"
              placeholder="Ej: 500"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              required
              min="1"
              style={styles.input}
            />
          </label>
        )}

        {step === 5 && (
          <label style={styles.label}>
            <strong>Paso 5 · Descripcion (opcional)</strong>
            <textarea
              placeholder="Ej: Excedente de paneles solares"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </label>
        )}

        {step === 6 && (
          <div>
            <p style={styles.label}>
              <strong>Paso 6 · Construir y publicar la oferta</strong>
            </p>
            <p style={styles.hint}>
              El Builder entrega la oferta construida con los datos de los pasos anteriores, o el Director genera la
              variante <code>buildExpressOffer()</code> con el precio por defecto del mercado.
            </p>
            <div style={styles.publishRow}>
              <button
                onClick={handlePublish}
                disabled={publishing !== '' || !stepValid[1] || !stepValid[2] || !stepValid[3] || !stepValid[4]}
                style={styles.button}
              >
                {publishing === 'custom' ? 'Publicando...' : 'Construir y publicar oferta'}
              </button>
              <button
                onClick={handlePublishExpress}
                disabled={publishing !== '' || !stepValid[1] || !stepValid[2] || !stepValid[3]}
                style={styles.expressButton}
              >
                {publishing === 'express' ? 'Publicando...' : 'Publicar oferta expres'}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.navRow}>
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={styles.backButton}>
          Atras
        </button>
        {step < 6 && (
          <button
            onClick={() => stepValid[step] && setStep((s) => s + 1)}
            disabled={!stepValid[step]}
            style={styles.button}
          >
            Siguiente
          </button>
        )}
        {step === 6 && (
          <button onClick={resetAll} style={styles.backButton}>
            Reiniciar
          </button>
        )}
      </div>
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
    margin: '0 0 4px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#888',
    fontSize: '0.85rem',
  },
  stepsBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  stepPill: {
    flex: 1,
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: '8px',
    backgroundColor: '#eef1f5',
    color: '#889',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  stepActive: {
    backgroundColor: '#0f3460',
    color: '#fff',
  },
  stepDone: {
    backgroundColor: '#d4f0e4',
    color: '#16a06a',
  },
  stepContent: {
    marginBottom: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.95rem',
    color: '#333',
  },
  hint: {
    fontSize: '0.8rem',
    color: '#888',
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
  publishRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
  expressButton: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16c784',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fdecea',
    padding: '10px',
    borderRadius: '8px',
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
  },
  navRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  backButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#555',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};