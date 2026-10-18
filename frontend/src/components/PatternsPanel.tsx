import { useEffect, useState } from 'react';
import energyApiProxy from '../patterns/proxy/EnergyApiProxy';
import energyTypeFlyweightFactory from '../patterns/flyweight/EnergyTypeFlyweightFactory';

export default function PatternsPanel({ onSystemChanged }: { onSystemChanged?: () => void }) {
  const [proxyStats, setProxyStats] = useState<any>(null);
  const [flyStats, setFlyStats] = useState<any>(null);
  const [cacheValid, setCacheValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const api = energyApiProxy;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [p, f] = await Promise.all([
        api.getProxyStats(),
        api.getFlyweightStats(),
      ]);
      setProxyStats(p);
      setFlyStats(f);
      setCacheValid(p?.cache?.valid ?? null);
      onSystemChanged?.();
    } catch {
      setError('No se pudieron cargar las estadísticas de patrones. Revisa que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  const forceInvalidate = () => {
    api.invalidateOffers();
    setCacheValid(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fly = energyTypeFlyweightFactory;

  return (
    <div className="panel" style={styles.card}>
      <h2 style={styles.title}>Patrones recién implementados</h2>
      <p style={styles.subtitle}>
        Estado en tiempo real de Flyweight y Proxy, con métricas desde el backend (PHP) y vista desde el frontend (TS).
      </p>
      <details className="technical-note">
        <summary>¿Qué muestran estos paneles?</summary>
        <p>
          <strong>Flyweight:</strong> instancias compartidas por tipo de energía (una sola instancia de Solar/Eólica/Hidráulica reutilizada por todas las ofertas).
          <br />
          <strong>Proxy:</strong> caché de ofertas con TTL (cache hit/expiración), invalida la caché al publicar/comprar y protege compras (mínimo 1 kWh · máximo 100 kWh por operación).
        </p>
      </details>

      <div style={styles.grid}>
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">FLYWEIGHT</span>
              <h3 style={styles.boxTitle}>Descriptores compartidos</h3>
            </div>
            <button className="refresh-button" onClick={load} disabled={loading}>
              {loading ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>
          <p style={styles.hint}>
            Compartidos en frontend (TS): {fly.list().map((d) => `${d.emoji} ${d.type}`).join(' · ')}
          </p>
          {flyStats && (
            <dl style={styles.kv}>
              <div><dt>Instancias creadas</dt><dd>{flyStats.createdInstances}</dd></div>
              <div><dt>Total de usos</dt><dd>{flyStats.totalUses}</dd></div>
              {flyStats.usesByType && Object.entries(flyStats.usesByType).map(([k, v]) => (
                <div key={k}><dt>Usos · {k}</dt><dd>{String(v)}</dd></div>
              ))}
            </dl>
          )}
          <div style={styles.badges}>
            {fly.list().map((d) => (
              <span key={d.type} style={{ ...styles.badge, backgroundColor: d.accentBg, color: d.accentText, borderColor: d.accentBorder }}>
                {d.emoji} {d.name}
              </span>
            ))}
          </div>
        </div>

        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">PROXY</span>
              <h3 style={styles.boxTitle}>Caché + Protección</h3>
            </div>
            <div style={styles.row}>
              <button style={styles.ghostButton} onClick={forceInvalidate}>Forzar invalidación</button>
              <button className="refresh-button" onClick={load} disabled={loading}>
                {loading ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>
          </div>
          {proxyStats && (
            <>
              <dl style={styles.kv}>
                <div><dt>Caché válida</dt><dd>{proxyStats.cache.valid ? 'Sí' : 'No'}</dd></div>
                <div><dt>Entradas en caché</dt><dd>{proxyStats.cache.entries}</dd></div>
                <div><dt>TTL (segundos)</dt><dd>{proxyStats.cache.ttlSeconds}</dd></div>
                <div><dt>Expira en (segundos)</dt><dd>{proxyStats.cache.expiresIn}</dd></div>
                <div><dt>Mínima compra</dt><dd>{proxyStats.config.minPurchaseKwh} kWh</dd></div>
                <div><dt>Máxima compra</dt><dd>{proxyStats.config.maxPurchaseKwh} kWh</dd></div>
                <div><dt>Ofertas cacheadas (frontend)</dt><dd>{cacheValid === null ? '—' : cacheValid ? 'Válida' : 'Expirada/invalidada'}</dd></div>
              </dl>
              <p style={styles.small}>
                Cada petición a <code>/energy/offers</code> puede servirse desde la caché del Proxy (PHP). Al crear/clonar/compra, el Proxy invalida la caché automáticamente.
              </p>
            </>
          )}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '1.3rem' },
  subtitle: { margin: '0 0 16px 0', color: '#888', fontSize: '0.85rem', lineHeight: 1.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' },
  box: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' },
  boxHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' },
  boxTitle: { margin: '6px 0 0 0', color: '#0f3460', fontSize: '1.05rem' },
  kv: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', margin: '10px 0 0 0' },
  dt: { color: '#666', fontSize: '0.8rem' },
  dd: { margin: '2px 0 0 0', fontWeight: 'bold', color: '#1a1a2e' } as any,
  badges: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' },
  badge: { padding: '4px 10px', borderRadius: '999px', border: '1px solid', fontSize: '0.8rem', fontWeight: 'bold' },
  hint: { color: '#666', fontSize: '0.8rem', margin: '6px 0' },
  small: { color: '#666', fontSize: '0.75rem', margin: '10px 0 0 0', lineHeight: 1.4 },
  error: { color: '#c0392b', margin: '12px 0 0 0' },
  row: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  ghostButton: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #0f3460', backgroundColor: '#fff', color: '#0f3460', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' },
};
