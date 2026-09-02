import CreateOffer from './components/CreateOffer';
import EnergyDashboard from './components/EnergyDashboard';
import { useState } from 'react';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEnergyType, setSelectedEnergyType] = useState<string | null>(null);

  const handleOfferCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Plataforma de Comercio de Energia</h1>
        <p style={styles.subtitle}>Comercio directo de excedentes energeticos entre productores y consumidores</p>
      </header>
      <main style={styles.main}>
        <div style={styles.grid}>
          <CreateOffer
            onOfferCreated={handleOfferCreated}
            selectedEnergyType={selectedEnergyType}
            onSelectEnergyType={setSelectedEnergyType}
          />
          <div key={refreshKey}>
            <EnergyDashboard />
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    backgroundColor: '#0f3460',
    color: '#fff',
    padding: '32px 24px',
    textAlign: 'center',
  },
  logo: {
    margin: '0 0 8px 0',
    fontSize: '1.8rem',
  },
  subtitle: {
    margin: 0,
    opacity: 0.85,
    fontSize: '1rem',
  },
  main: {
    maxWidth: '1100px',
    margin: '32px auto',
    padding: '0 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
};

export default App;
