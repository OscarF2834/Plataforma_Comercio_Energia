import { useState, useEffect } from 'react';
import energyTypeFlyweightFactory from '../patterns/flyweight/EnergyTypeFlyweightFactory';
import energyApiProxy from '../patterns/proxy/EnergyApiProxy';
import OfferStateContext from '../patterns/state/OfferStateContext';
import marketEventsSubject from '../patterns/observer/MarketEventsSubject';
import DashboardRefreshObserver from '../patterns/observer/DashboardRefreshObserver';

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

  const api = energyApiProxy;

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

    // Patron Observer: el dashboard se suscribe al sujeto del mercado.
    // Cuando alguien publique o compre energía, el DashboardRefreshObserver
    // notifica el cambio y refresca la lista automáticamente.
    const refreshObserver = new DashboardRefreshObserver(fetchOffers);
    marketEventsSubject.attach(refreshObserver);
    return () => marketEventsSubject.detach(refreshObserver);
  }, []);

  const handlePurchase = async (id: number) => {
    const offer = offers.find((o) => o.id === id);
    // Patron State: el estado actual decide si la compra es posible.
    if (offer && !OfferStateContext.resolve(offer).canPurchase()) {
      alert('Esta oferta está agotada: no queda energía disponible para comprar');
      return;
    }
    const kwh = prompt('Ingrese la cantidad de kWh a comprar:');
    if (!kwh) return;
    try {
      const result = await api.purchaseOffer(id, parseFloat(kwh));
      alert(result.message);

      // Patron Observer: la compra es un cambio de estado del mercado.
      // Se notifica al sujeto y los observadores reaccionan (el feed
      // registra el evento y el dashboard se refresca solo).
      const purchased = offers.find((o) => o.id === id);
      if (purchased) {
        marketEventsSubject.notifyOfferPurchased(purchased, `Compra de ${parseFloat(kwh)} kWh en la oferta #${id}`);
      }
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

      // Patron Observer: registrar una oferta también es un cambio del
      // mercado; los observadores lo registran y refrescan el dashboard.
      marketEventsSubject.notifyOfferPublished(clone, `Oferta #${clone.id} clonada desde la #${offer.id}`);
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
          {offers.map((offer) => {
            // Patron State: el estado del ciclo de vida de la oferta
            // decide la insignia y si se puede comprar.
            const state = OfferStateContext.resolve(offer);
            return (
            <div key={offer.id} style={styles.offerCard}>
              <img
                className="offer-image"
                src={energyTypeFlyweightFactory.getImage(offer.energyType)}
                alt={energyTypeFlyweightFactory.getName(offer.energyType)}
                onError={(e) => {
                  e.currentTarget.src = '/images/renewable-landscape.svg';
                }}
              />
              <div className="offer-card-content">
              {offer.energyType && <span className="offer-type">{energyTypeFlyweightFactory.getName(offer.energyType)}</span>}
              <span
                style={{
                  ...styles.stateBadge,
                  color: state.color,
                  borderColor: state.color,
                  backgroundColor: `${state.color}1a`,
                }}
                title={`Estado de la oferta (patrón State): ${state.label}`}
              >
                {state.label}
              </span>
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
                disabled={!state.canPurchase()}
                style={{
                  ...styles.buyButton,
                  ...(state.canPurchase()
                    ? {}
                    : { backgroundColor: '#b0b8c1', cursor: 'not-allowed' }),
                }}
              >
                {state.canPurchase() ? 'Comprar energía' : 'Agotada'}
              </button>
              <button
                onClick={() => handleClone(offer)}
                style={styles.cloneButton}
              >
                Duplicar oferta
              </button>
              </div>
            </div>
            );
          })}
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
  stateBadge: {
    display: 'inline-block',
    marginLeft: '6px',
    padding: '2px 10px',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    verticalAlign: 'middle',
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
