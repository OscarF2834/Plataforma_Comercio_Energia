import { useState } from 'react';
import CreateOffer from './components/CreateOffer';
import EnergyDashboard from './components/EnergyDashboard';
import PredictionPanel from './components/PredictionPanel';
import OfferPrototypePanel from './components/OfferPrototypePanel';
import DevicePanel from './components/DevicePanel';
import SettlementPanel from './components/SettlementPanel';
import OfferExtrasPanel from './components/OfferExtrasPanel';
import BundlePanel from './components/BundlePanel';
import PatternsPanel from './components/PatternsPanel';

const heroPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    alt: 'Paneles solares generando energía bajo el sol',
    label: 'Energía solar',
  },
  {
    src: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80',
    alt: 'Aerogeneradores produciendo energía renovable',
    label: 'Energía eólica',
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Agua en movimiento, una fuente de energía limpia',
    label: 'Energía del agua',
  },
];

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEnergyType, setSelectedEnergyType] = useState<string | null>(null);
  const [heroPhoto] = useState(() => heroPhotos[Math.floor(Math.random() * heroPhotos.length)]);

  const handleOfferCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Energia Talivan, inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M22.4 4.5 10 22h8.8l-1.2 13.5L30 18h-8.8l1.2-13.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>ENERGÍA TALIVAN</strong>
            <small>COMERCIO RENOVABLE</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#market">Mercado</a>
          <a href="#prediccion">Análisis</a>
          <a href="#dispositivos">Dispositivos</a>
          <a href="#plataforma">Plataforma</a>
        </nav>
        <a className="topbar-action" href="#publicar">Publicar excedente <span aria-hidden="true">↗</span></a>
      </header>

      <main className="app-main" id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" /> Mercado de energía limpia</span>
            <h1 id="hero-title">La energía que compartimos <em>mueve el futuro.</em></h1>
            <p>Conecta tu excedente renovable con quienes lo necesitan. Una forma más simple y cercana de comerciar energía.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#market">Explorar ofertas <span aria-hidden="true">→</span></a>
              <a className="button-secondary" href="#publicar">Publicar energía</a>
            </div>
            <div className="hero-note"><span aria-hidden="true">✳</span> Energía renovable, directamente de la comunidad</div>
          </div>
          <div className="hero-art">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              loading="eager"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src = '/images/renewable-landscape.svg';
              }}
            />
            
          </div>
        </section>

        <nav className="feature-nav" aria-label="Otras herramientas">
          <span>Más herramientas</span>
          <a href="#plantillas">Plantillas de oferta</a>
          <a href="#liquidaciones">Calcular liquidación</a>
          <a href="#extras">Opciones de oferta</a>
          <a href="#paquetes">Paquetes de energía</a>
          <a href="#patrones">Flyweight y Proxy</a>
        </nav>

        <section className="content-section market-section" id="market" aria-label="Publicación y ofertas de energía">
          <div className="section-heading">
            <div><span className="section-kicker">MERCADO ABIERTO</span><h2>Compra y comparte energía</h2></div>
            <p>Ofertas disponibles y herramientas para publicar tus excedentes.</p>
          </div>
          <div className="market-grid">
            <div id="publicar">
              <CreateOffer
                onOfferCreated={handleOfferCreated}
                selectedEnergyType={selectedEnergyType}
                onSelectEnergyType={setSelectedEnergyType}
              />
            </div>
            <div key={refreshKey}>
              <EnergyDashboard />
            </div>
          </div>
        </section>

        <section className="content-section panel-section" id="prediccion">
          <PredictionPanel onSystemChanged={handleOfferCreated} />
        </section>
        <section className="content-section panel-section" id="plantillas">
          <OfferPrototypePanel onSystemChanged={handleOfferCreated} />
        </section>
        <section className="content-section panel-section" id="dispositivos">
          <DevicePanel />
        </section>
        <section className="content-section panel-section" id="liquidaciones">
          <SettlementPanel />
        </section>
        <section className="content-section panel-section" id="extras">
          <OfferExtrasPanel />
        </section>
        <section className="content-section panel-section" id="paquetes">
          <BundlePanel />
        </section>
        <section className="content-section panel-section" id="patrones">
          <PatternsPanel onSystemChanged={handleOfferCreated} />
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span className="brand-copy"><strong>ENERGÍA TALIVAN</strong><small>COMERCIO RENOVABLE</small></span>
        </a>
        <span>Un futuro más limpio se construye en comunidad. Derechos Oscar e Ivan 2026</span>
        <a href="#inicio" className="back-to-top">Volver
        </a>
      </footer>
    </div>
  );
}

export default App;
