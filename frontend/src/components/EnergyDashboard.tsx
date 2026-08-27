import { useState, useEffect } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';

interface EnergyOffer {
  id?: number;
  producerName: string;
  totalKwh: number;
  availableKwh: number;
  pricePerKwh: number;
  description?: string;
  createdAt?: string;
}

export default function EnergyDashboard() {
  const [offers, setOffers] = useState<EnergyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const api = EnergyApiService.getInstance();

  const fetchOffers = async () => {
    try {
      const data = await api.getAvailableOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error:', error);
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
      fetchOffers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Cargando ofertas...</p>;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Ofertas Disponibles de Energia</h2>
      {offers.length === 0 ? (
        <p style={styles.empty}>No hay ofertas disponibles. Publica la primera.</p>
      ) : (
        <div style={styles.grid}>
          {offers.map((offer) => (
            <div key={offer.id} style={styles.offerCard}>
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
                Comprar Energia
              </button>
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
};
