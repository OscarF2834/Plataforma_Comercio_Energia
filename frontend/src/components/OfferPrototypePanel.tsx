import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import type { EnergyOffer } from '../patterns/singleton/energy-api.service';
import { OfferPrototype } from '../patterns/prototype/OfferPrototype';

export default function OfferPrototypePanel({
  onSystemChanged,
}: {
  onSystemChanged?: () => void;
}) {
  const [templates, setTemplates] = useState<EnergyOffer[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [localClone, setLocalClone] = useState<EnergyOffer | null>(null);
  const [producerName, setProducerName] = useState('');
  const [totalKwh, setTotalKwh] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const api = EnergyApiService.getInstance();

  const loadTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPrototypeTemplates();
      setTemplates(data);
      setSelectedType((prev) => (prev && data.some((t) => t.energyType === prev) ? prev : data[0]?.energyType ?? ''));
    } catch {
      setError('No se pudieron cargar las plantillas Prototype. Revisa que el backend este activo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Clona la plantilla con el patron Prototype ejecutado en el FRONTEND (TS).
  const handleCloneLocal = () => {
    const template = templates.find((t) => t.energyType === selectedType);
    if (!template) return;
    try {
      const clone = OfferPrototype.from(template).copy();
      const clonedOffer = clone.getOffer();
      setLocalClone(clonedOffer);
      setProducerName(clonedOffer.producerName);
      setTotalKwh(String(clonedOffer.totalKwh));
      setPricePerKwh(String(clonedOffer.pricePerKwh));
      setError('');
    } catch {
      setError('No se pudo clonar la plantilla en el frontend.');
    }
  };

  // Publica: el BACKEND (PHP) clona su propia plantilla con el patron Prototype.
  const handlePublish = async () => {
    if (!producerName.trim()) {
      setError('Ingresa el nombre del productor antes de publicar.');
      return;
    }
    const qty = parseFloat(totalKwh);
    const price = parseFloat(pricePerKwh);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }
    setPublishing(true);
    setError('');
    try {
      const result = await api.createOfferFromTemplate({
        energyType: selectedType,
        producerName: producerName.trim(),
        totalKwh: qty,
        pricePerKwh: Number.isFinite(price) && price >= 0 ? price : undefined,
      });
      alert(`Oferta #${result.id} creada como clon de la plantilla ${result.energyType}.`);
      onSystemChanged?.();
      handleCloneLocal();
    } catch {
      setError('No se pudo publicar el clon. Revisa los datos.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSelectTemplate = (type: string) => {
    setSelectedType(type);
    setLocalClone(null);
  };

  const template = templates.find((t) => t.energyType === selectedType);

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Plantillas de Oferta — Patron Prototype</h2>
      <p style={styles.subtitle}>
        Cada plantilla es un <strong>prototipo de oferta</strong>. Al clonarla se crea una{' '}
        <strong>copia independiente</strong> (nuevo id, kWh disponibles = total, sin compartir referencia con el
        original). Se usa en el <strong>Frontend (TypeScript)</strong> al clonar localmente y en el{' '}
        <strong>Backend (PHP)</strong> al publicar el clon.
      </p>

      <p style={styles.sourceLabel}>Plantillas registradas en el PrototypeRegistry (backend):</p>
      <div style={styles.templateGrid}>
        {templates.map((t) => (
          <div
            key={t.energyType}
            onClick={() => handleSelectTemplate(t.energyType ?? '')}
            style={{
              ...styles.templateCard,
              ...(t.energyType === selectedType ? styles.templateActive : {}),
            }}
          >
            <h3 style={styles.templateTitle}>{getTypeName(t.energyType ?? '')}</h3>
            <p style={styles.templateDetail}>
              {t.totalKwh} kWh por defecto · ${t.pricePerKwh} COP/kWh
            </p>
            <p style={styles.templateDesc}>{t.description}</p>
            {t.energyType === selectedType && <span style={styles.check}>Seleccionada</span>}
          </div>
        ))}
      </div>

      {loading && <p style={styles.hint}>Cargando plantillas...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {template && (
        <div style={styles.cloneBox}>
          <p style={styles.cloneIntro}>
            <strong>Origen:</strong> prototipo «{getTypeName(template.energyType ?? '')}» (id:{' '}
            {String(template.id)} · {template.totalKwh} kWh · ${template.pricePerKwh} COP/kWh)
          </p>
          <div style={styles.actions}>
            <button onClick={handleCloneLocal} style={styles.localButton}>
              Clonar en el frontend (TypeScript)
            </button>
          </div>

          {localClone && (
            <div style={styles.cloneResult}>
              <p style={styles.cloneResultTitle}>Clon local creado con OfferPrototype.copy()</p>
              <div style={styles.cloneMeta}>
                <span style={styles.metaItem}>id: {String(localClone.id)}</span>
                <span style={styles.metaItem}>kWh disponibles: {localClone.availableKwh}</span>
                <span style={styles.metaItem}>total: {localClone.totalKwh}</span>
                <span style={styles.metaItem}>precio: ${localClone.pricePerKwh}</span>
              </div>
              <p style={styles.sourceTag}>
                Resultado clonado con el patron: <strong>Frontend (TypeScript)</strong>
              </p>
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Productor:
                  <input
                    type="text"
                    placeholder="Nombre del productor"
                    value={producerName}
                    onChange={(e) => setProducerName(e.target.value)}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Cantidad (kWh):
                  <input
                    type="number"
                    min="1"
                    placeholder="kWh"
                    value={totalKwh}
                    onChange={(e) => setTotalKwh(e.target.value)}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Precio por kWh (COP):
                  <input
                    type="number"
                    min="0"
                    placeholder="COP"
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              <button onClick={handlePublish} disabled={publishing} style={styles.publishButton}>
                {publishing ? 'Publicando clon...' : 'Publicar clon (Prototype en backend)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getTypeName(type: string): string {
  switch (type) {
    case 'solar':
      return 'Energia Solar';
    case 'wind':
      return 'Energia Eolica';
    case 'hydro':
      return 'Energia Hidraulica';
    default:
      return type;
  }
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#888',
    fontSize: '0.85rem',
  },
  sourceLabel: {
    margin: '0 0 10px 0',
    color: '#666',
    fontSize: '0.85rem',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  templateCard: {
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '14px',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
  },
  templateActive: {
    borderColor: '#8e44ad',
    backgroundColor: '#f6eefb',
  },
  templateTitle: {
    margin: '0 0 6px 0',
    fontSize: '1rem',
    color: '#0f3460',
  },
  templateDetail: {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: '#333',
  },
  templateDesc: {
    margin: '6px 0 0 0',
    fontSize: '0.75rem',
    color: '#666',
  },
  check: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '3px 10px',
    borderRadius: '999px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  cloneBox: {
    border: '1px solid #e5d5f2',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fdf8ff',
  },
  cloneIntro: {
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
    color: '#333',
  },
  actions: {
    marginBottom: '12px',
  },
  localButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #8e44ad',
    backgroundColor: '#fff',
    color: '#8e44ad',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  cloneResult: {
    borderTop: '1px dashed #d9c3ec',
    paddingTop: '14px',
    marginTop: '14px',
  },
  cloneResultTitle: {
    margin: '0 0 8px 0',
    fontSize: '0.9rem',
    color: '#8e44ad',
    fontWeight: 'bold',
  },
  cloneMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px',
  },
  metaItem: {
    backgroundColor: '#efe4f9',
    color: '#6c3483',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  sourceTag: {
    margin: '0 0 12px 0',
    color: '#666',
    fontSize: '0.85rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.9rem',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
  },
  publishButton: {
    padding: '12px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#8e44ad',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fdecea',
    padding: '10px',
    borderRadius: '8px',
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
  },
  hint: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: '0.85rem',
  },
};