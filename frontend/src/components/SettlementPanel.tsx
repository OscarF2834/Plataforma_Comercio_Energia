import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import settlementService from '../patterns/bridge/SettlementService';
import type { EnergyBillResult } from '../patterns/bridge/EnergyBill';

// El panel mueve los dos ejes del Bridge por separado: el perfil
// (abstraccion) y la moneda (implementor). El mismo par de selectores
// recorre el producto cartesiano sin condicionales ni clases nuevas.
export default function SettlementPanel() {
  const [profile, setProfile] = useState('residential');
  const [currency, setCurrency] = useState('COP');
  const [kwh, setKwh] = useState('50');
  const [pricePerKwh, setPricePerKwh] = useState('500');
  const [localBill, setLocalBill] = useState<EnergyBillResult | null>(null);
  const [backendBill, setBackendBill] = useState<EnergyBillResult | null>(null);
  const [combinations, setCombinations] = useState<string[]>([]);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();
  const profiles = settlementService.getProfiles();
  const currencies = settlementService.getCurrencies();

  useEffect(() => {
    api
      .getSettlementMatrix()
      .then((matrix) => setCombinations(matrix.combinations))
      .catch(() => setError('No se pudo consultar la matriz de liquidaciones del backend.'));
  }, []);

  useEffect(() => {
    const kwhValue = parseFloat(kwh);
    const priceValue = parseFloat(pricePerKwh);
    if (!Number.isFinite(kwhValue) || !Number.isFinite(priceValue)) {
      setLocalBill(null);
      return;
    }

    // Bridge en el FRONTEND: el cliente conecta EnergyBill + CurrencyBridge.
    try {
      setLocalBill(settlementService.quote(profile, currency, { kwh: kwhValue, pricePerKwh: priceValue }));
      setError('');
    } catch (e) {
      setLocalBill(null);
      setError((e as Error).message);
    }
  }, [profile, currency, kwh, pricePerKwh]);

  const handleEmit = async () => {
    try {
      // Bridge en el BACKEND: mismas clases en PHP, mismo resultado.
      const bill = await api.quoteSettlement({
        profile,
        currency,
        kwh: parseFloat(kwh),
        pricePerKwh: parseFloat(pricePerKwh),
      });
      setBackendBill(bill);
    } catch {
      setError('No se pudo emitir la liquidacion en el backend.');
    }
  };

  const sameTotal =
    localBill && backendBill && Math.abs(localBill.total - backendBill.total) < 0.01;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Liquidaciones (Bridge)</h2>
      <p style={styles.subtitle}>
        El perfil de liquidacion (<strong>abstraccion</strong>) y la moneda (<strong>implementor</strong>)
        son dos jerarquias independientes: {combinations.length || profiles.length * currencies.length}{' '}
        combinaciones sin condicionales anidados.
      </p>

      <div style={styles.selectors}>
        <div style={styles.selector}>
          <label style={styles.label}>Perfil (abstraccion)</label>
          <select value={profile} onChange={(e) => setProfile(e.target.value)} style={styles.select}>
            {profiles.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selector}>
          <label style={styles.label}>Moneda (implementor)</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={styles.select}>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.label} (IVA {(c.taxRate * 100).toFixed(0)}%)
              </option>
            ))}
          </select>
        </div>

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

      <div style={styles.actions}>
        <button onClick={handleEmit} style={styles.primaryButton}>
          Emitir liquidacion en el backend
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {localBill && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>
            {localBill.profileName} · {localBill.currency}
          </h3>
          <p style={styles.resultDesc}>{localBill.profileDescription}</p>

          <div style={styles.lines}>
            <div style={styles.line}>
              <span>
                Subtotal ({localBill.kwh} kWh x {localBill.pricePerKwhFormatted})
              </span>
              <span style={styles.lineValue}>{localBill.subtotalFormatted}</span>
            </div>

            {localBill.adjustments.map((adj) => (
              <div key={adj.label} style={styles.line}>
                <span>{adj.label}</span>
                <span style={adj.amount < 0 ? styles.negative : styles.lineValue}>
                  {adj.amountFormatted}
                </span>
              </div>
            ))}

            <div style={styles.line}>
              <span>Base imponible</span>
              <span style={styles.lineValue}>{localBill.baseFormatted}</span>
            </div>
            <div style={styles.line}>
              <span>Impuesto de la moneda ({(localBill.taxRate * 100).toFixed(0)}%)</span>
              <span style={styles.lineValue}>{localBill.taxFormatted}</span>
            </div>
            <div style={{ ...styles.line, ...styles.totalLine }}>
              <span>Total</span>
              <span style={styles.totalValue}>{localBill.totalFormatted}</span>
            </div>
            <div style={styles.line}>
              <span style={styles.muted}>Unidades minimas para pasarela de pago</span>
              <span style={styles.muted}>{localBill.totalMinorUnits}</span>
            </div>
          </div>

          {backendBill && (
            <p style={sameTotal ? styles.matchOk : styles.matchWarn}>
              {sameTotal
                ? 'El Bridge del backend (PHP) coincide con el calculo del frontend (TypeScript).'
                : `El backend informo ${backendBill.totalFormatted}.`}
            </p>
          )}
        </div>
      )}

      {combinations.length > 0 && (
        <p style={styles.combos}>
          <strong>Combinaciones soportadas:</strong> {combinations.join(' · ')}
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
  title: {
    margin: '0 0 8px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  selectors: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  selector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  select: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontSize: '0.9rem',
  },
  input: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
  },
  actions: {
    marginTop: '16px',
  },
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
  error: {
    color: '#c0392b',
    margin: '12px 0 0 0',
  },
  result: {
    marginTop: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  resultTitle: {
    margin: '0 0 4px 0',
    color: '#0f3460',
    fontSize: '1.05rem',
  },
  resultDesc: {
    margin: '0 0 12px 0',
    fontSize: '0.82rem',
    color: '#666',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#1a1a2e',
  },
  lineValue: {
    fontWeight: 'bold',
  },
  negative: {
    fontWeight: 'bold',
    color: '#16c784',
  },
  totalLine: {
    borderTop: '1px solid #ddd',
    paddingTop: '8px',
    marginTop: '4px',
    fontSize: '1rem',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#0f3460',
  },
  muted: {
    color: '#888',
    fontSize: '0.78rem',
  },
  matchOk: {
    margin: '12px 0 0 0',
    color: '#16c784',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  matchWarn: {
    margin: '12px 0 0 0',
    color: '#c0392b',
    fontSize: '0.85rem',
  },
  combos: {
    margin: '16px 0 0 0',
    fontSize: '0.78rem',
    color: '#888',
    lineHeight: 1.6,
  },
};
