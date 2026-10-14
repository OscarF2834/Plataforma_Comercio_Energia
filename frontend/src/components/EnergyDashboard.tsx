import { useState, useEffect } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';

interface EnergyOffer {
  id?: number;
  producerName: string;
  totalKwh: number;
  availableKwh: number;
  pricePerKwh: number;
  description?: string;
  energyType?: string;
  createdAt?: string;
}

export default function EnergyDashboard() {
  const [offers, setOffers] = useState<EnergyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await api.getAvailableOffers();
      setOffers(data);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('No pudimos cargar las ofertas. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handlePurchase = async (id: number) => {
    const kwh = prompt('Ingrese la cantidad de kWh a comprar:');
    if (!kwh) return;
    try {
      const result = await api.purchaseOffer(id, parseFloat(kwh));
      alert(result.message);
      await fetchOffers();
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo completar la compra. Revisa la cantidad e inténtalo de nuevo.');
    }
  };

  const handleClone = async (offer: EnergyOffer) => {
    const answer = window.confirm(
      `Duplicar la oferta de ${offer.producerName} (${offer.availableKwh} kWh a $${offer.pricePerKwh} COP/kWh)?\n\nPatron Prototype: se clonara la oferta en el backend.`
    );
    if (!answer) return;
    try {
      const clone = await api.cloneOffer(offer.id!);
      alert(`Oferta #${clone.id} creada como clon de la #${offer.id}.`);
      await fetchOffers();
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo duplicar la oferta. Inténtalo de nuevo.');
      alert('No se pudo duplicar la oferta.');
    }
  };

  if (loading && offers.length === 0) {
    return <p className="loading-message" role="status">Cargando ofertas disponibles…</p>;
  }

  return (
    <div className="panel offers-panel" style={styles.card}>
      <div className="panel-heading">
        <div>
          <span className="section-kicker">ENERGÍA DE LA COMUNIDAD</span>
          <h2 style={styles.title}>Ofertas disponibles</h2>
        </div>
        <button
          type="button"
          className="refresh-button"
          onClick={fetchOffers}
          disabled={loading}
          aria-label="Actualizar ofertas"
          aria-live="polite"
        >
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>
      <p className="offers-intro">Compara la energía disponible y su precio antes de elegir una oferta.</p>
      {error && (
        <p className="inline-error" role="alert">
          {error}
          <button type="button" onClick={fetchOffers}>Volver a intentar</button>
        </p>
      )}
      {offers.length === 0 && !error ? (
        <div className="empty-state">
          <span aria-hidden="true">☀</span>
          <strong>No hay ofertas disponibles por ahora</strong>
          <p>Cuando alguien comparta su energía, aparecerá aquí. También puedes publicar la tuya.</p>
          <a href="#publicar">Publicar energía <span aria-hidden="true">→</span></a>
        </div>
      ) : (
        <div style={styles.grid}>
          {offers.map((offer) => (
            <div key={offer.id} style={styles.offerCard}>
              <img
                className="offer-image"
                src={getEnergyImage(offer.energyType)}
                alt=""
                loading="lazy"
              />
              <div className="offer-card-content">
              {offer.energyType && <span className="offer-type">{getEnergyTypeName(offer.energyType)}</span>}
              <h3 style={styles.offerTitle}>{offer.producerName}</h3>
              <p style={styles.offerDetail}>
                <strong>{offer.availableKwh}</strong> kWh disponibles
              </p>
              <p style={styles.offerPrice}>${offer.pricePerKwh} COP / kWh</p>
              {offer.description && (
                <p style={styles.offerDesc}>{offer.description}</p>
              )}
              <button
                onClick={() => handlePurchase(offer.id!)}
                style={styles.buyButton}
              >
                Comprar energía
              </button>
              <button
                onClick={() => handleClone(offer)}
                style={styles.cloneButton}
              >
                Duplicar oferta
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  empty: {
    color: '#888',
    fontStyle: 'italic',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  offerCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  offerTitle: {
    margin: '0 0 8px 0',
    color: '#0f3460',
  },
  offerDetail: {
    margin: '4px 0',
    fontSize: '1.1rem',
  },
  offerPrice: {
    color: '#16c784',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    margin: '8px 0',
  },
  typeTag: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: '#eef3fa',
    color: '#0f3460',
    border: '1px solid #cdd9e8',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    margin: '4px 0',
  },
  offerDesc: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '4px 0',
  },
  buyButton: {
    marginTop: '12px',
    padding: '10px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16c784',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cloneButton: {
    marginTop: '8px',
    padding: '10px',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #8e44ad',
    backgroundColor: '#f6eefb',
    color: '#8e44ad',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

function getEnergyImage(type?: string): string {
  switch (type?.toLowerCase()) {
    case 'solar':
      return '/images/solar-energy.svg';
    case 'wind':
      return '/images/wind-energy.svg';
    case 'hydro':
      return '/images/hydro-energy.svg';
    default:
      return '/images/renewable-landscape.svg';
  }
}

function getEnergyTypeName(type: string): string {
  switch (type.toLowerCase()) {
    case 'solar':
      return 'Energía solar';
    case 'wind':
      return 'Energía eólica';
    case 'hydro':
      return 'Energía hidráulica';
    default:
      return type;
  }
}
