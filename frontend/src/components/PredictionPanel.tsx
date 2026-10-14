import { useCallback, useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import { DailyPredictor } from '../patterns/template/DailyPredictor';
import { WeeklyPredictor } from '../patterns/template/WeeklyPredictor';
import { EnergyOfferBuilder } from '../patterns/builder/EnergyOfferBuilder';
import { OfferDirector } from '../patterns/builder/OfferDirector';
import type { MarketContext, Prediction } from '../patterns/template/Predictor';

type PredictionSource = 'local' | 'backend';

interface PredictionWithSource extends Prediction {
  source: PredictionSource;
}

export default function PredictionPanel({
  onSystemChanged,
}: {
  onSystemChanged?: () => void;
}) {
  const [production, setProduction] = useState(18);
  const [consumption, setConsumption] = useState(10);
  const [predictions, setPredictions] = useState<PredictionWithSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSource, setLastSource] = useState<PredictionSource>('backend');
  const [acting, setActing] = useState<string | null>(null);

  const api = EnergyApiService.getInstance();

  const loadFromBackend = useCallback(async (prod: number, cons: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPredictions(prod, cons);
      setPredictions(data.map((p: Prediction) => ({ ...p, source: 'backend' })));
      setLastSource('backend');
    } catch {
      setError('No se pudieron obtener las predicciones. Revisa que el backend este activo.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadFromBackend(production, consumption);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocal = () => {
    const market: MarketContext = predictions[0]?.market ?? {
      totalOffers: 0,
      activeOffers: 0,
      totalAvailableKwh: 0,
      avgPricePerKwh: 0,
      transactionCount: 0,
    };
    const local = [
      new DailyPredictor(production, consumption, market),
      new WeeklyPredictor(production, consumption, market),
    ].map((predictor) => ({ ...predictor.predict(), source: 'local' as const }));
    setPredictions(local);
    setLastSource('local');
  };

  const handleBackend = () => {
    loadFromBackend(production, consumption);
  };

  const handlePublish = async (prediction: Prediction) => {
    const producerName = prompt('Nombre del productor para publicar el excedente:');
    if (!producerName) return;
    const energyType = prompt('Tipo de energia (solar, wind, hydro):', 'solar');
    if (!energyType || !['solar', 'wind', 'hydro'].includes(energyType)) {
      alert('Tipo de energia no valido. Usa solar, wind o hydro.');
      return;
    }
    setActing(prediction.period);
    try {
      // El excedente estimado se convierte en una oferta real mediante el
      // patron Builder: el Director construye la oferta paso a paso.
      const offer = new OfferDirector(new EnergyOfferBuilder()).buildFromRequest({
        producerName,
        totalKwh: prediction.surplusEstimate,
        pricePerKwh: prediction.market.avgPricePerKwh || 500,
        energyType,
        description: `Excedente estimado por prediccion ${prediction.period === 'daily' ? 'diaria' : 'semanal'}`,
      });
      const result = await api.createOffer(offer);
      alert(`Oferta #${result.id} publicada correctamente.`);
      onSystemChanged?.();
      await loadFromBackend(production, consumption);
    } catch {
      alert('No se pudo publicar la oferta.');
    } finally {
      setActing(null);
    }
  };

  const handleBuy = async (prediction: Prediction) => {
    const deficit = prediction.deficitEstimate;
    if (deficit <= 0) return;
    setActing(prediction.period);
    try {
      const offers = await api.getAvailableOffers();
      if (offers.length === 0) {
        alert('No hay ofertas disponibles para comprar.');
        return;
      }
      const cheapest = [...offers].sort((a, b) => a.pricePerKwh - b.pricePerKwh)[0];
      const toBuy = Math.min(deficit, cheapest.availableKwh);
      if (toBuy <= 0) {
        alert('La oferta mas barata no tiene energia disponible.');
        return;
      }
      const result = await api.purchaseOffer(cheapest.id!, toBuy);
      alert(`${result.message} (de la oferta #${cheapest.id}).`);
      onSystemChanged?.();
      await loadFromBackend(production, consumption);
    } catch {
      alert('No se pudo realizar la compra.');
    } finally {
      setActing(null);
    }
  };

  const market = predictions[0]?.market;

  return (
    <div className="panel" style={styles.card}>
      <h2 style={styles.title}>Tu balance de energía</h2>
      <p style={styles.subtitle}>
        Indica cuánto produces y consumes para estimar si tendrás energía para compartir o si necesitarás comprar.
      </p>
      <details className="technical-note">
        <summary>Cómo se calcula la predicción</summary>
        <p>La estimación utiliza los datos del mercado actual y puede calcularse aquí o consultarse al servidor.</p>
      </details>

      {market && (
        <div className="market-status" style={styles.marketBar}>
          <strong>Estado real del mercado:</strong>
          <span style={styles.marketItem}>{market.activeOffers} ofertas activas</span>
          <span style={styles.marketItem}>{market.totalAvailableKwh} kWh disponibles</span>
          <span style={styles.marketItem}>${market.avgPricePerKwh} COP/kWh promedio</span>
          <span style={styles.marketItem}>{market.transactionCount} transacciones</span>
        </div>
      )}

      <div style={styles.form}>
        <label style={styles.label}>
          Mi producción (kWh):
          <input
            type="number"
            min="0"
            value={production}
            onChange={(e) => setProduction(parseFloat(e.target.value) || 0)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Mi consumo (kWh):
          <input
            type="number"
            min="0"
            value={consumption}
            onChange={(e) => setConsumption(parseFloat(e.target.value) || 0)}
            style={styles.input}
          />
        </label>
        <div style={styles.actions}>
          <button onClick={handleLocal} style={styles.secondaryButton}>
            Calcular aquí
          </button>
          <button onClick={handleBackend} style={styles.primaryButton} disabled={loading}>
            {loading ? 'Consultando…' : 'Actualizar desde el servidor'}
          </button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.sourceLabel}>
        Cálculo realizado en: <strong>{lastSource === 'backend' ? 'el servidor' : 'este dispositivo'}</strong>
      </p>

      <div style={styles.grid}>
        {predictions.map((prediction) => (
          <div
            key={prediction.period}
            style={{ ...styles.predictCard, borderColor: prediction.color }}
          >
            <h3 style={{ ...styles.predictTitle, color: prediction.color }}>
              {prediction.period === 'daily' ? 'Diaria' : 'Semanal'}
            </h3>
            <p style={styles.desc}>{prediction.description}</p>
            <div style={styles.metrics}>
              <p style={styles.metric}>
                Produccion: <strong>{prediction.productionEstimate} kWh</strong>
              </p>
              <p style={styles.metric}>
                Consumo: <strong>{prediction.consumptionEstimate} kWh</strong>
              </p>
              <p style={{ ...styles.metric, color: '#16c784' }}>
                Excedente: <strong>{prediction.surplusEstimate} kWh</strong>
              </p>
              {prediction.deficitEstimate > 0 && (
                <p style={{ ...styles.metric, color: '#e74c3c' }}>
                  Deficit: <strong>{prediction.deficitEstimate} kWh</strong>
                </p>
              )}
            </div>
            <p style={styles.recommendation}>💡 {prediction.recommendation}</p>
            {prediction.action === 'publish' && prediction.surplusEstimate > 0 && (
              <button
                onClick={() => handlePublish(prediction)}
                style={styles.actionSell}
                disabled={acting === prediction.period}
              >
                {acting === prediction.period ? 'Publicando...' : 'Publicar excedente'}
              </button>
            )}
            {prediction.action === 'buy' && prediction.deficitEstimate > 0 && (
              <button
                onClick={() => handleBuy(prediction)}
                style={styles.actionBuy}
                disabled={acting === prediction.period}
              >
                {acting === prediction.period ? 'Comprando...' : 'Comprar energia'}
              </button>
            )}
          </div>
        ))}
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
    margin: '0 0 8px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#888',
    fontSize: '0.85rem',
  },
  marketBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  marketItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    borderRadius: '999px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    fontSize: '1rem',
  },
  actions: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  secondaryButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
    backgroundColor: '#fff',
    color: '#0f3460',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fdecea',
    padding: '10px',
    borderRadius: '8px',
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
  },
  sourceLabel: {
    margin: '0 0 16px 0',
    color: '#666',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  predictCard: {
    border: '2px solid',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  predictTitle: {
    margin: '0 0 8px 0',
  },
  desc: {
    color: '#666',
    fontSize: '0.85rem',
    margin: '4px 0',
  },
  metrics: {
    margin: '10px 0',
  },
  metric: {
    margin: '4px 0',
    fontSize: '0.95rem',
  },
  recommendation: {
    margin: '8px 0 0 0',
    fontSize: '0.9rem',
    backgroundColor: '#f0f4ff',
    padding: '10px',
    borderRadius: '8px',
    color: '#0f3460',
  },
  actionSell: {
    marginTop: '12px',
    padding: '10px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16c784',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  actionBuy: {
    marginTop: '12px',
    padding: '10px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};