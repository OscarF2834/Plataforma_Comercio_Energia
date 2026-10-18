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
  { step: 2, label: 'Fuente' },
  { step: 3, label: 'Cantidad' },
  { step: 4, label: 'Precio opcional' },
  { step: 5, label: 'Descripción' },
  { step: 6, label: 'Revisar' },
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

  const handleEnergyTypeSelected = (type: string | null) => {
    onSelectEnergyType?.(type);
  };

  const stepValid: Record<number, boolean> = {
    1: producerName.trim().length > 0,
    2: !!selectedEnergyType,
    3: Number.isFinite(qty) && qty > 0,
    4: true,
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
    if (
      !stepValid[1] ||
      !stepValid[2] ||
      !stepValid[3] ||
      !Number.isFinite(price) ||
      price < 0
    ) {
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
    <div className="panel offer-wizard" style={styles.card}>
      <h2 style={styles.title}>Publica tu energía</h2>
      <p style={styles.subtitle}>
        Cuéntanos qué energía quieres compartir. Te guiaremos paso a paso.
      </p>

      <nav className="wizard-steps" aria-label="Pasos para publicar tu energía" style={styles.stepsBar}>
        {STEPS.map((s) => {
          const done = s.step < step;
          const active = s.step === step;
          return (
            <div
              key={s.step}
              aria-current={active ? 'step' : undefined}
              aria-label={`Paso ${s.step}: ${s.label}${done ? ', completado' : active ? ', actual' : ''}`}
              style={{ ...styles.stepPill, ...(active ? styles.stepActive : {}), ...(done ? styles.stepDone : {}) }}
            >
              <span className="wizard-step-number">{done ? '✓' : s.step}</span>
              <span className="wizard-step-label">{s.label}</span>
            </div>
          );
        })}
      </nav>
      <p className="wizard-current-step" aria-live="polite">
        Paso {step} de {STEPS.length} · {STEPS[step - 1].label}
      </p>
      <div
        className="wizard-progress"
        role="progressbar"
        aria-label="Progreso de publicación"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step}
      >
        <span style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>

      <div style={styles.stepContent}>
        {step === 1 && (
          <label style={styles.label}>
            <strong>¿Quién publica la oferta?</strong>
            <input
              type="text"
              placeholder="Nombre de la persona o comunidad"
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
              <strong>¿De dónde viene tu energía?</strong>
            </p>
            <EnergyCatalog selectedEnergyType={selectedEnergyType} onSelect={handleEnergyTypeSelected} />
          </div>
        )}

        {step === 3 && (
          <label style={styles.label}>
            <strong>¿Cuánta energía tienes disponible?</strong>
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
            <span className="field-hint">Indica la cantidad en kilovatios-hora (kWh).</span>
          </label>
        )}

        {step === 4 && (
          <label style={styles.label}>
            <strong>¿A qué precio quieres ofrecerla? (opcional)</strong>
            <input
              type="number"
              placeholder="Ej: 500"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              min="1"
              style={styles.input}
            />
            <span className="field-hint">
              Precio por cada kWh en pesos colombianos (COP). Puedes dejarlo vacío para elegir el precio sugerido al final.
            </span>
          </label>
        )}

        {step === 5 && (
          <label style={styles.label}>
            <strong>Agrega un detalle para quienes compran (opcional)</strong>
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
              <strong>Revisa tu oferta antes de publicarla</strong>
            </p>
            <dl className="offer-review">
              <div><dt>Publicada por</dt><dd>{producerName}</dd></div>
              <div><dt>Fuente de energía</dt><dd>{getEnergyTypeName(selectedEnergyType ?? '')}</dd></div>
              <div><dt>Cantidad disponible</dt><dd>{totalKwh} kWh</dd></div>
              <div><dt>Precio por kWh</dt><dd>{pricePerKwh ? `$${pricePerKwh} COP` : 'La plataforma calculará un precio sugerido'}</dd></div>
              {description.trim() && <div><dt>Detalle</dt><dd>{description}</dd></div>}
            </dl>
            <p className="field-hint">Podrás volver atrás para cambiar cualquier dato.</p>
            <div style={styles.publishRow}>
              <button
                onClick={handlePublish}
                disabled={publishing !== '' || !stepValid[1] || !stepValid[2] || !stepValid[3] || !Number.isFinite(price) || price < 0}
                style={styles.button}
              >
                {publishing === 'custom' ? 'Publicando...' : 'Publicar con mi precio'}
              </button>
              <button
                onClick={handlePublishExpress}
                disabled={publishing !== '' || !stepValid[1] || !stepValid[2] || !stepValid[3]}
                style={styles.expressButton}
              >
                {publishing === 'express' ? 'Publicando...' : 'Publicar con precio sugerido'}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p role="alert" style={styles.error}>{error}</p>}

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

function getEnergyTypeName(type: string): string {
  switch (type) {
    case 'solar':
      return 'Solar';
    case 'wind':
      return 'Eólica';
    case 'hydro':
      return 'Hidráulica';
    default:
      return type;
  }
}