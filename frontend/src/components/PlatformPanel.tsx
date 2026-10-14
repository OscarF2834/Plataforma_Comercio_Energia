import { useCallback, useEffect, useState } from 'react';
import platformFacade from '../patterns/facade/PlatformFacade';
import type {
  BuyResult,
  PlatformDashboard,
  SurplusAdvice,
} from '../patterns/facade/PlatformFacade';

/**
 * Cliente del patron Facade.
 *
 * Este componente NO conoce los endpoints ni los servicios
 * internos del backend (mercado, prediccion, IoT,
 * liquidaciones): solo pide operaciones de negocio de alto
 * nivel a PlatformFacade. Una sola llamada del Facade
 * coordina internamente todos los subsistemas.
 */
export default function PlatformPanel({
  onSystemChanged,
}: {
  onSystemChanged?: () => void;
}) {
  const [dashboard, setDashboard] = useState<PlatformDashboard | null>(null);
  const [advice, setAdvice] = useState<SurplusAdvice | null>(null);
  const [lastBuy, setLastBuy] = useState<BuyResult | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Formulario: publicar excedente
  const [producerName, setProducerName] = useState('');
  const [kwh, setKwh] = useState('');
  const [price, setPrice] = useState('');
  const [energyType, setEnergyType] = useState('solar');
  const [description, setDescription] = useState('');

  // Formulario: comprar energia
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [buyKwh, setBuyKwh] = useState('');
  const [profile, setProfile] = useState('residential');
  const [currency, setCurrency] = useState('COP');

  // Formulario: asesoria de excedente
  const [production, setProduction] = useState('');
  const [consumption, setConsumption] = useState('');

  // Una sola llamada del Facade trae todo el panel.
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setDashboard(await platformFacade.loadDashboard());
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handlePublish = async () => {
    const totalKwh = parseFloat(kwh);
    const pricePerKwh = parseFloat(price);

    if (!producerName.trim() || !Number.isFinite(totalKwh) || !Number.isFinite(pricePerKwh)) {
      setError('Completa productor, cantidad y precio para publicar el excedente.');
      return;
    }

    try {
      const result = await platformFacade.publishSurplus({
        producerName: producerName.trim(),
        totalKwh,
        pricePerKwh,
        energyType,
        description: description.trim(),
      });
      setMessage(`Oferta #${result.offer.id} de ${result.offer.energyType} publicada via Facade.`);
      setError('');
      setProducerName('');
      setKwh('');
      setPrice('');
      setDescription('');
      onSystemChanged?.();
      await loadDashboard();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleBuy = async () => {
    const kwhValue = parseFloat(buyKwh);

    if (selectedOfferId === null || !Number.isFinite(kwhValue) || kwhValue <= 0) {
      setError('Selecciona una oferta e indica los kWh a comprar.');
      return;
    }

    try {
      // Una sola llamada: compra en el mercado + liquidacion (Bridge).
      const result = await platformFacade.buyEnergy(selectedOfferId, kwhValue, profile, currency);
      setLastBuy(result);
      setMessage(result.message);
      setError('');
      onSystemChanged?.();
      await loadDashboard();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleAdvice = async () => {
    try {
      const result = await platformFacade.getSurplusAdvice(
        parseFloat(production) || 0,
        parseFloat(consumption) || 0
      );
      setAdvice(result);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const offers = dashboard?.offers ?? [];
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId);

  return (
    <div className="panel" style={styles.card}>
      <h2 style={styles.title}>Resumen de tu actividad energética</h2>
      <p style={styles.subtitle}>
        Consulta el estado del mercado, tus dispositivos y las operaciones recientes desde un mismo lugar.
      </p>
      <details className="technical-note">
        <summary>Acerca de este resumen</summary>
        <p>Esta vista reúne la información del mercado, los dispositivos conectados y la actividad reciente.</p>
      </details>

      {loading && <p style={styles.muted}>Cargando panel unificado...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.ok}>{message}</p>}

      {dashboard && (
        <div style={styles.dashboard}>
          <div style={styles.statCard}>
            <h3 style={styles.sectionTitle}>Mercado de excedentes</h3>
            <p style={styles.stat}>Ofertas activas: <strong>{dashboard.market.activeOffers}</strong></p>
            <p style={styles.stat}>Energia disponible: <strong>{dashboard.market.totalAvailableKwh} kWh</strong></p>
            <p style={styles.stat}>Precio promedio: <strong>{dashboard.market.avgPricePerKwh} COP/kWh</strong></p>
            <p style={styles.stat}>Transacciones: <strong>{dashboard.market.transactionCount}</strong></p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.sectionTitle}>Dispositivos conectados</h3>
            <p style={styles.stat}>Dispositivos: <strong>{dashboard.iot.totalDevices}</strong> ({dashboard.iot.onlineDevices} en linea)</p>
            <p style={styles.stat}>Potencia total: <strong>{dashboard.iot.totalPowerKw} kW</strong></p>
            <p style={styles.stat}>Energia medida: <strong>{dashboard.iot.totalEnergyKwh} kWh</strong></p>
            <p style={styles.stat}>
              Fabricantes: <strong>{Object.keys(dashboard.iot.devicesByProvider).join(', ') || '—'}</strong>
            </p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.sectionTitle}>Actividad reciente</h3>
            <p style={styles.stat}>Ofertas publicadas: <strong>{dashboard.activity.offerCount}</strong></p>
            <p style={styles.stat}>Transacciones: <strong>{dashboard.activity.transactionCount}</strong></p>
            <p style={styles.stat}>Logs registrados: <strong>{dashboard.activity.totalLogs}</strong></p>
            <ul style={styles.logList}>
              {dashboard.activity.recentLogs.map((log, index) => (
                <li key={`${log}-${index}`}>{log}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.formCard}>
          <h3 style={styles.sectionTitle}>Publicar excedente</h3>
          <label className="form-field">
            Nombre del productor
            <input
              style={styles.input}
              placeholder="Ej.: Comunidad Solar"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
            />
          </label>
          <div style={styles.row}>
            <label className="form-field">
              Cantidad disponible (kWh)
              <input
                style={styles.input}
                type="number"
                min="1"
                placeholder="Ej.: 20"
                value={kwh}
                onChange={(e) => setKwh(e.target.value)}
              />
            </label>
            <label className="form-field">
              Precio por kWh (COP)
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="Ej.: 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label className="form-field">
              Fuente de energía
              <select style={styles.select} value={energyType} onChange={(e) => setEnergyType(e.target.value)}>
                <option value="solar">Solar</option>
                <option value="wind">Eólica</option>
                <option value="hydro">Hidráulica</option>
              </select>
            </label>
          </div>
          <label className="form-field">
            Descripción (opcional)
            <input
              style={styles.input}
              placeholder="Cuéntales algo sobre tu energía"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button style={styles.button} onClick={handlePublish}>
            Publicar oferta
          </button>
        </div>

        <div style={styles.formCard}>
          <h3 style={styles.sectionTitle}>Comprar energía</h3>
          <label className="form-field">
            Oferta disponible
            <select
              style={styles.select}
              value={selectedOfferId ?? ''}
              onChange={(e) => setSelectedOfferId(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">Selecciona una oferta</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  #{offer.id} · {offer.producerName} · {offer.availableKwh} kWh · {offer.pricePerKwh} COP/kWh
                </option>
              ))}
            </select>
          </label>
          {selectedOffer && (
            <p style={styles.muted}>
              Disponible: {selectedOffer.availableKwh} kWh de {selectedOffer.producerName}
            </p>
          )}
          <div style={styles.row}>
            <label className="form-field">
              Cantidad que quieres comprar (kWh)
              <input
                style={styles.input}
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Ej.: 10"
                value={buyKwh}
                onChange={(e) => setBuyKwh(e.target.value)}
              />
            </label>
            <label className="form-field">
              Tipo de cliente
              <select style={styles.select} value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="residential">Hogar</option>
                <option value="commercial">Comercio</option>
              </select>
            </label>
            <label className="form-field">
              Moneda
              <select style={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="COP">COP · Peso colombiano</option>
                <option value="USD">USD · Dólar</option>
                <option value="EUR">EUR · Euro</option>
              </select>
            </label>
          </div>
          <button style={styles.button} onClick={handleBuy}>
            Confirmar compra
          </button>
          {lastBuy?.bill && (
            <p style={styles.muted}>
              Liquidacion {lastBuy.bill.profile} en {lastBuy.bill.currency}:{' '}
              <strong>{lastBuy.bill.totalFormatted}</strong> (total: {lastBuy.bill.total})
            </p>
          )}
        </div>
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.sectionTitle}>¿Tendrás energía de sobra?</h3>
        <div style={styles.row}>
          <label className="form-field">
            Tu producción (kWh)
            <input
              style={styles.input}
              type="number"
              min="0"
              placeholder="Ej.: 20"
              value={production}
              onChange={(e) => setProduction(e.target.value)}
            />
          </label>
          <label className="form-field">
            Tu consumo (kWh)
            <input
              style={styles.input}
              type="number"
              min="0"
              placeholder="Ej.: 12"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
            />
          </label>
          <button style={styles.button} onClick={handleAdvice}>
            Consultar mi balance
          </button>
        </div>
        {advice && (
          <div style={styles.adviceCard}>
            <p style={styles.advice}>{advice.advice}</p>
            {advice.predictions.map((prediction) => (
              <p key={prediction.period} style={styles.muted}>
                <strong style={{ color: prediction.color }}>{prediction.period}</strong>:{' '}
                prod. {prediction.productionEstimate} kWh · cons. {prediction.consumptionEstimate} kWh ·{' '}
                excedente {prediction.surplusEstimate} kWh · deficit {prediction.deficitEstimate} kWh
              </p>
            ))}
          </div>
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
    border: '2px solid #0f3460',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#0f3460',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#555',
    fontSize: '0.9rem',
  },
  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: '8px',
    padding: '14px',
    border: '1px solid #dde4ee',
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    color: '#0f3460',
  },
  stat: {
    margin: '4px 0',
    fontSize: '0.9rem',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  formCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: '8px',
    padding: '14px',
    border: '1px solid #dde4ee',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '8px',
    margin: '8px 0',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #c9d3e0',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  },
  select: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #c9d3e0',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '8px',
    padding: '9px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  muted: {
    margin: '6px 0',
    fontSize: '0.85rem',
    color: '#666',
  },
  error: {
    color: '#b00020',
    fontSize: '0.9rem',
  },
  ok: {
    color: '#1c6b3f',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  logList: {
    margin: '6px 0 0 0',
    paddingLeft: '18px',
    fontSize: '0.8rem',
    color: '#666',
    maxHeight: '90px',
    overflowY: 'auto',
  },
  adviceCard: {
    marginTop: '10px',
    backgroundColor: '#eef6ff',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #bcd7f5',
  },
  advice: {
    margin: '0 0 6px 0',
    fontWeight: 'bold',
    color: '#0f3460',
    fontSize: '0.95rem',
  },
};
