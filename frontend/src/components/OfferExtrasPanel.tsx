import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import offerPricingService from '../patterns/decorator/OfferPricingService';
import type { ExtraInfo, ExtrasQuote } from '../patterns/decorator/OfferPricingService';

// El panel muestra el Patron Decorator en dos capas: el calculo local en
// TypeScript (src/patterns/decorator) y la verificacion contra el mismo
// calculo en PHP (backend). La oferta base se envuelve con decoradores.
export default function OfferExtrasPanel() {
  const [kwh, setKwh] = useState('20');
  const [pricePerKwh, setPricePerKwh] = useState('500');
  const [selected, setSelected] = useState<string[]>(['green']);
  const [extrasInfo, setExtrasInfo] = useState<ExtraInfo[]>([]);
  const [localQuote, setLocalQuote] = useState<ExtrasQuote | null>(null);
  const [backendQuote, setBackendQuote] = useState<ExtrasQuote | null>(null);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();
  const catalog = offerPricingService.getExtrasCatalog();

  useEffect(() => {
    api
      .getExtrasCatalog()
      .then(setExtrasInfo)
      .catch(() => setError('No se pudo consultar el catalogo de extras del backend.'));
  }, []);

  useEffect(() => {
    const kwhValue = parseFloat(kwh);
    const priceValue = parseFloat(pricePerKwh);
    if (!Number.isFinite(kwhValue) || !Number.isFinite(priceValue) || kwhValue <= 0 || priceValue < 0) {
      setLocalQuote(null);
      return;
    }
    try {
      setLocalQuote(offerPricingService.quote(kwhValue, priceValue, selected));
      setError('');
    } catch (e) {
      setLocalQuote(null);
      setError((e as Error).message);
    }
  }, [kwh, pricePerKwh, selected]);

  const toggleExtra = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleBackendQuote = async () => {
    try {
      const quote = await api.quoteWithExtras({
        kwh: parseFloat(kwh),
        pricePerKwh: parseFloat(pricePerKwh),
        extras: selected,
      });
      setBackendQuote(quote);
    } catch {
      setError('No se pudo cotizar en el backend.');
    }
  };

  const sameTotal =
    localQuote && backendQuote && Math.abs(localQuote.total - backendQuote.total) < 0.01;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Extras de oferta (Decorator)</h2>
      <p style={styles.subtitle}>
        Una <strong>BasicOffer</strong> se envuelve con decoradores (certificacion, seguro, entrega
        prioritaria). Cada decorador agrega su extra sin modificar la oferta base: {selected.length}{' '}
        decorador(es) activos.
      </p>

      <div style={styles.selectors}>
        <div style={styles.selector}>
          <label style={styles.label}>Energia (kWh)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.selector}>
          <label style={styles.label}>Precio por kWh</label>
          <input
            type="number"
            min="0"
            step="10"
            value={pricePerKwh}
            onChange={(e) => setPricePerKwh(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.extrasList}>
        {catalog.map((extra) => (
          <label key={extra.key} style={styles.extraItem}>
            <input
              type="checkbox"
              checked={selected.includes(extra.key)}
              onChange={() => toggleExtra(extra.key)}
            />
            <span>
              <strong>{extra.name}</strong> — {extra.description}{' '}
              <em>({extra.rule})</em>
            </span>
          </label>
        ))}
      </div>

      <div style={styles.actions}>
        <button onClick={handleBackendQuote} style={styles.primaryButton}>
          Cotizar en el backend
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {localQuote && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>{localQuote.description}</h3>
          <div style={styles.lines}>
            <div style={styles.line}>
              <span>Subtotal base</span>
              <span style={styles.lineValue}>${localQuote.basePrice.toLocaleString()}</span>
            </div>
            {localQuote.adjustments.map((adj) => (
              <div key={adj.label} style={styles.line}>
                <span>{adj.label}</span>
                <span style={styles.lineValue}>+${adj.amount.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ ...styles.line, ...styles.totalLine }}>
              <span>Total</span>
              <span style={styles.totalValue}>${localQuote.total.toLocaleString()}</span>
            </div>
          </div>

          {backendQuote && (
            <p style={sameTotal ? styles.matchOk : styles.matchWarn}>
              {sameTotal
                ? 'El Decorator del backend (PHP) coincide con el calculo del frontend (TypeScript).'
                : `El backend informo $${backendQuote.total.toLocaleString()}.`}
            </p>
          )}
        </div>
      )}

      {extrasInfo.length > 0 && (
        <p style={styles.combos}>
          <strong>Extras soportados por el backend:</strong>{' '}
          {extrasInfo.map((e) => e.name).join(' · ')}
        </p>
      )}
    </div>
  );
}

const styles: Record<string, any> = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: { margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '1.3rem' },
  subtitle: { margin: '0 0 16px 0', color: '#666', fontSize: '0.9rem', lineHeight: 1.5 },
  selectors: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  },
  selector: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' },
  extrasList: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  extraItem: { display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.9rem', color: '#1a1a2e' },
  actions: { marginTop: '16px' },
  primaryButton: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  error: { color: '#c0392b', margin: '12px 0 0 0' },
  result: {
    marginTop: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  resultTitle: { margin: '0 0 12px 0', color: '#0f3460', fontSize: '1.05rem' },
  lines: { display: 'flex', flexDirection: 'column', gap: '6px' },
  line: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#1a1a2e' },
  lineValue: { fontWeight: 'bold' },
  totalLine: { borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '4px', fontSize: '1rem' },
  totalValue: { fontWeight: 'bold', color: '#0f3460' },
  matchOk: { margin: '12px 0 0 0', color: '#16c784', fontSize: '0.85rem', fontWeight: 'bold' },
  matchWarn: { margin: '12px 0 0 0', color: '#c0392b', fontSize: '0.85rem' },
  combos: { margin: '16px 0 0 0', fontSize: '0.78rem', color: '#888', lineHeight: 1.6 },
};
