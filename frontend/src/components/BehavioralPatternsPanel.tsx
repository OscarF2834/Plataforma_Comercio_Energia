import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import type { EnergyOffer } from '../patterns/singleton/energy-api.service';
import { OfferCollection } from '../patterns/iterator/OfferCollection';
import PlatformMediator from '../patterns/mediator/PlatformMediator';
import { offerDraftCaretaker } from '../patterns/memento/OfferDraftCaretaker';
import marketEventsSubject from '../patterns/observer/MarketEventsSubject';
import activityFeedObserver from '../patterns/observer/ActivityFeedObserver';
import type { MarketObserver } from '../patterns/observer/MarketObserver';
import OfferStateContext from '../patterns/state/OfferStateContext';
import { MarketReportVisitor } from '../patterns/visitor/MarketReportVisitor';
import { MarketAuditVisitor } from '../patterns/visitor/MarketAuditVisitor';
import { visitMarketInventory } from '../patterns/visitor/MarketInventory';

const api = EnergyApiService.getInstance();

type IteratorStrategy = 'type' | 'cheapest' | 'available';

const STRATEGY_LABELS: Record<IteratorStrategy, string> = {
  type: 'Por tipo de energía',
  cheapest: 'Por precio (más barata primero)',
  available: 'Solo disponibles',
};

export default function BehavioralPatternsPanel({ onSystemChanged }: { onSystemChanged?: () => void }) {
  // ---------------- Iterator ----------------
  const [strategy, setStrategy] = useState<IteratorStrategy>('cheapest');
  const [energyType, setEnergyType] = useState('solar');
  const [iteratorResult, setIteratorResult] = useState<any>(null);
  const [backendIterated, setBackendIterated] = useState<any>(null);

  // ---------------- Mediator ----------------
  const mediator = PlatformMediator.getInstance();
  const [mediatorVersion, setMediatorVersion] = useState(0);
  const [mediatorStats, setMediatorStats] = useState<any>(null);

  // ---------------- Memento ----------------
  const [marketHistory, setMarketHistory] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------- Observer ----------------
  const [observerVersion, setObserverVersion] = useState(0);
  const [observerStats, setObserverStats] = useState<any>(null);

  // ---------------- State ----------------
  const [offerStates, setOfferStates] = useState<any>(null);
  const [simulatedOffers, setSimulatedOffers] = useState<EnergyOffer[]>([]);
  const [simulateOfferId, setSimulateOfferId] = useState('');
  const [simulateKwh, setSimulateKwh] = useState('1');
  const [simulateResult, setSimulateResult] = useState<any>(null);

  // ---------------- Visitor ----------------
  const [visitorType, setVisitorType] = useState<'report' | 'audit'>('report');
  const [localVisitorResult, setLocalVisitorResult] = useState<any>(null);
  const [backendVisitorResult, setBackendVisitorResult] = useState<any>(null);

  const runIterator = async () => {
    setMessage('');
    setLoading(true);
    try {
      // 1) El patrón corre en el FRONTEND: la colección local crea el
      //    iterador concreto y lo recorremos con hasNext()/next().
      const offers = await api.getAvailableOffers();
      const collection = new OfferCollection(offers);
      const iterator = collection.createIterator(strategy, { energyType });
      const walked: EnergyOffer[] = [];
      let steps = 0;
      while (iterator.hasNext()) {
        const offer = iterator.next();
        steps++;
        if (offer) walked.push(offer);
      }
      setIteratorResult({
        strategy,
        steps,
        total: walked.length,
        totalAvailableKwh: round(walked.reduce((sum, o) => sum + o.availableKwh, 0)),
        offers: walked.slice(0, 5),
      });

      // 2) La MISMA estrategia ejecutada en el BACKEND (PHP).
      setBackendIterated(await api.getIteratedOffers(strategy, energyType));
    } catch {
      setMessage('No se pudo ejecutar el Iterator. Revisa que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  const loadMediatorAndHistory = async () => {
    try {
      setMediatorStats(await api.getMediatorStats());
      setMarketHistory(await api.getMarketHistory());
    } catch {
      /* el panel local sigue funcionando sin backend */
    }
  };

  const undoLastPurchase = async () => {
    setMessage('');
    setLoading(true);
    try {
      // Patron Memento: el mediador del backend restaura la última
      // instantánea guardada (deshacer compra).
      const result = await api.undoLastPurchase();
      setMessage(result.message);
      if (result.success) {
        mediator.publish('system:refresh', 'Compra deshecha en el backend (Memento)');
        setMarketHistory(await api.getMarketHistory());
        onSystemChanged?.();
      } else {
        setMarketHistory(await api.getMarketHistory());
      }
    } catch {
      setMessage('No se pudo deshacer la compra.');
    } finally {
      setLoading(false);
    }
  };

  const loadObserverAndStates = async () => {
    try {
      setObserverStats(await api.getObserverStats());
      setOfferStates(await api.getOfferStates());
    } catch {
      /* el panel local sigue funcionando sin backend */
    }
  };

  const loadSimulatorOffers = async () => {
    try {
      setSimulatedOffers(await api.getAvailableOffers());
    } catch {
      /* sin backend no hay simulador */
    }
  };

  // Patron State: simula una compra LOCAL y muestra la transición de
  // estado (Disponible → Parcialmente vendida → Agotada).
  const simulatePurchase = () => {
    const offer = simulatedOffers.find((o) => String(o.id) === simulateOfferId);
    if (!offer) {
      setMessage('Selecciona una oferta para simular la compra.');
      return;
    }
    const kwh = parseInt(simulateKwh, 10);
    if (!kwh || kwh <= 0) {
      setMessage('Ingresa una cantidad de kWh válida para la simulación.');
      return;
    }
    const result = OfferStateContext.handlePurchase(offer, kwh);
    setSimulateResult({ ...result, offerId: offer.id, producer: offer.producerName });
    // Actualiza el stock local para poder encadenar simulaciones.
    setSimulatedOffers((prev) =>
      prev.map((o) => (o.id === offer.id ? { ...o, availableKwh: result.availableKwh } : o))
    );
  };

  const runVisitor = async () => {
    setMessage('');
    setLoading(true);
    try {
      // 1) El patrón corre en el FRONTEND: los elementos aceptan al
      //    visitante con doble despacho (accept()).
      const local = await visitMarketInventory(
        visitorType === 'audit' ? new MarketAuditVisitor() : new MarketReportVisitor()
      );
      setLocalVisitorResult(local);

      // 2) La MISMA operación ejecutada en el BACKEND (PHP).
      setBackendVisitorResult(await api.getVisitorReport(visitorType));
    } catch {
      setMessage('No se pudo recorrer el inventario con el Visitor. Revisa que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runIterator();
    // Suscripción del panel al mediador: se refresca cuando un colega publica.
    const unsubscribe = mediator.subscribe('offer:created', () => {
      setMediatorVersion((v) => v + 1);
      loadMediatorAndHistory();
    });
    loadMediatorAndHistory();

    // Patron Observer: el panel se adjunta al sujeto del mercado y se
    // refresca solo cuando alguien publica o compra energía.
    const panelObserver: MarketObserver = {
      name: 'Panel de patrones (BehavioralPatternsPanel)',
      update: () => setObserverVersion((v) => v + 1),
    };
    marketEventsSubject.attach(panelObserver);
    loadObserverAndStates();
    loadSimulatorOffers();

    return () => {
      unsubscribe;
      marketEventsSubject.detach(panelObserver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localMediatorStats = mediator.getStats();
  const localEventLog = mediator.getEventLog();
  const draftHistory = offerDraftCaretaker.history();

  return (
    <div className="panel" style={styles.card}>
      <h2 style={styles.title}>Patrones de comportamiento — 3er corte</h2>
      <p style={styles.subtitle}>
        Iterator, Mediator, Memento, Observer, State y Visitor en acción: recorrer el mercado, coordinar la compra,
        deshacer operaciones, notificar cambios, transicionar el ciclo de vida de las ofertas y auditar el inventario.
      </p>
      <details className="technical-note">
        <summary>¿Qué muestran estos paneles?</summary>
        <p>
          <strong>Iterator:</strong> recorre las ofertas con hasNext()/next() sin exponer la colección del mercado (estrategias: por tipo, más barata primero, solo disponibles), en el frontend (TS) y en el backend (PHP).
          <br />
          <strong>Mediator:</strong> los componentes ya no se avisan entre sí con props: publican eventos al mediador (offer:created, offer:purchased), que coordina Mercado + Registro + Historial en el backend.
          <br />
          <strong>Memento:</strong> instantáneas del asistente (deshacer/rehacer borrador) y del mercado (deshacer la última compra con la instantánea previa).
          <br />
          <strong>Observer:</strong> el mercado notifica sus cambios a los observadores suscritos (feed de actividad, refresco del dashboard, métricas, alertas y precios en el backend).
          <br />
          <strong>State:</strong> el ciclo de vida de una oferta (Disponible → Parcialmente vendida → Agotada) cambia el comportamiento de la compra: una oferta agotada RECHAZA la compra.
          <br />
          <strong>Visitor:</strong> operaciones distintas (reporte, auditoría) recorren el mismo inventario (ofertas + fuentes + IoT) sin modificar las clases visitadas.
        </p>
      </details>

      <div style={styles.grid}>
        {/* ------------------------- ITERATOR ------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">ITERATOR</span>
              <h3 style={styles.boxTitle}>Recorridos del mercado</h3>
            </div>
            <button className="refresh-button" onClick={runIterator} disabled={loading}>
              {loading ? 'Recorriendo…' : 'Recorrer'}
            </button>
          </div>
          <div style={styles.row}>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as IteratorStrategy)}
              style={styles.select}
              aria-label="Estrategia del Iterator"
            >
              {Object.entries(STRATEGY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {strategy === 'type' && (
              <select
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value)}
                style={styles.select}
                aria-label="Tipo de energía"
              >
                <option value="solar">Solar</option>
                <option value="wind">Eólica</option>
                <option value="hydro">Hidráulica</option>
              </select>
            )}
          </div>
          {iteratorResult && (
            <>
              <dl style={styles.kv}>
                <div><dt>Ofertas recorridas</dt><dd>{iteratorResult.total} (pasos: {iteratorResult.steps})</dd></div>
                <div><dt>kWh disponibles</dt><dd>{iteratorResult.totalAvailableKwh}</dd></div>
              </dl>
              <ul style={styles.list}>
                {iteratorResult.offers.map((o: EnergyOffer) => (
                  <li key={`${o.id}-${o.producerName}`}>
                    #{o.id} {o.producerName} · {o.availableKwh} kWh · ${o.pricePerKwh}/kWh
                  </li>
                ))}
              </ul>
              {backendIterated && (
                <p style={styles.small}>
                  Backend (PHP): estrategia <strong>{backendIterated.strategy}</strong> devolvió{' '}
                  {backendIterated.total} ofertas · {backendIterated.totalAvailableKwh} kWh · precio promedio ${backendIterated.avgPricePerKwh}.
                </p>
              )}
            </>
          )}
        </div>

        {/* ------------------------- MEDIATOR ------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">MEDIATOR</span>
              <h3 style={styles.boxTitle}>Coordinación de la plataforma</h3>
            </div>
            <button className="refresh-button" onClick={loadMediatorAndHistory} disabled={loading}>
              Actualizar
            </button>
          </div>
          <p style={styles.hint}>
            Colegas locales (TS): {localMediatorStats.colleagues.join(' · ') || '—'}
          </p>
          <p style={styles.hint}>
            Eventos coordinados localmente (v{mediatorVersion}): {localMediatorStats.eventsHandled} · suscritos: {localMediatorStats.subscribedEvents.join(', ') || '—'}
          </p>
          <ul style={styles.list}>
            {localEventLog.slice(0, 3).map((e, i) => (
              <li key={`${e.at}-${i}`}>{e.at} · {e.event} {e.detail && `— ${e.detail}`}</li>
            ))}
          </ul>
          {mediatorStats && (
            <>
              <dl style={styles.kv}>
                <div><dt>Colegas backend (PHP)</dt><dd>{mediatorStats.colleagues.length}</dd></div>
                <div><dt>Eventos coordinados</dt><dd>{mediatorStats.eventsHandled}</dd></div>
              </dl>
              <ul style={styles.list}>
                {(mediatorStats.recentEvents ?? []).slice(0, 3).map((e: any, i: number) => (
                  <li key={`${e.at}-${i}`}>{e.at} · {e.event} {e.detail && `— ${e.detail}`}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ------------------------- MEMENTO -------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">MEMENTO</span>
              <h3 style={styles.boxTitle}>Instantáneas y deshacer</h3>
            </div>
            <button className="refresh-button" onClick={loadMediatorAndHistory} disabled={loading}>
              Actualizar
            </button>
          </div>
          <p style={styles.hint}>
            Borrador del asistente (local): {draftHistory.length} instantánea(s) guardada(s) · última: {draftHistory.slice(-1)[0] || '—'}
          </p>
          {marketHistory && (
            <>
              <dl style={styles.kv}>
                <div><dt>Instantáneas del mercado</dt><dd>{marketHistory.count}</dd></div>
              </dl>
              <ul style={styles.list}>
                {(marketHistory.snapshots ?? []).slice(0, 3).map((s: any, i: number) => (
                  <li key={`${s.createdAt}-${i}`}>{s.createdAt} · {s.reason} · {s.offers} ofertas</li>
                ))}
              </ul>
            </>
          )}
          <button
            style={styles.undoButton}
            onClick={undoLastPurchase}
            disabled={loading || !marketHistory?.count}
            title="Memento: restaura la instantánea capturada antes de la última compra"
          >
            ↶ Deshacer última compra
          </button>
        </div>

        {/* ------------------------- OBSERVER ------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">OBSERVER</span>
              <h3 style={styles.boxTitle}>Notificaciones del mercado</h3>
            </div>
            <button className="refresh-button" onClick={loadObserverAndStates} disabled={loading}>
              Actualizar
            </button>
          </div>
          <p style={styles.hint}>
            Observadores suscritos (TS): {marketEventsSubject.getObservers().join(' · ') || '—'}
          </p>
          <p style={styles.hint}>
            Cambios notificados en vivo (v{observerVersion}): {activityFeedObserver.countEvents()}
          </p>
          <ul style={styles.list}>
            {activityFeedObserver.getFeed().slice(0, 4).map((entry, i) => (
              <li key={`${entry.at}-${i}`}>
                {entry.at} · {entry.event === 'offer:published' ? 'Publicado' : 'Compra'} — {entry.detail}
              </li>
            ))}
          </ul>
          {observerStats && (
            <>
              <dl style={styles.kv}>
                <div><dt>Observadores backend (PHP)</dt><dd>{observerStats.observers.length}</dd></div>
                <div><dt>Eventos notificados</dt><dd>{observerStats.eventsHandled}</dd></div>
              </dl>
              <ul style={styles.list}>
                {Object.entries(observerStats.metrics ?? {}).map(([key, value]) => (
                  <li key={key}>{key}: {String(value)}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* -------------------------- STATE --------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">STATE</span>
              <h3 style={styles.boxTitle}>Ciclo de vida de las ofertas</h3>
            </div>
            <button
              className="refresh-button"
              onClick={() => {
                loadObserverAndStates();
                loadSimulatorOffers();
              }}
              disabled={loading}
            >
              Actualizar
            </button>
          </div>
          {offerStates && (
            <>
              <p style={styles.hint}>
                Backend (PHP): {Object.entries(offerStates.summary ?? {}).map(([label, count]) => `${label}: ${count}`).join(' · ') || 'sin ofertas'}
              </p>
              <ul style={styles.list}>
                {(offerStates.states ?? []).slice(0, 4).map((s: any) => (
                  <li key={s.id}>
                    <span style={{ color: s.state.color, fontWeight: 'bold' }}>● {s.state.label}</span> — #{s.id} {s.producerName} · {s.availableKwh}/{s.totalKwh} kWh
                  </li>
                ))}
              </ul>
            </>
          )}
          <p style={styles.small}>Simulador local (TS): compra energía y mira cómo transiciona el estado.</p>
          <div style={styles.row}>
            <select
              value={simulateOfferId}
              onChange={(e) => setSimulateOfferId(e.target.value)}
              style={styles.select}
              aria-label="Oferta a simular"
            >
              <option value="">Elegir oferta…</option>
              {simulatedOffers.map((o) => (
                <option key={o.id} value={String(o.id)}>
                  #{o.id} {o.producerName} ({o.availableKwh} kWh)
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={simulateKwh}
              onChange={(e) => setSimulateKwh(e.target.value)}
              style={{ ...styles.select, maxWidth: '90px' }}
              aria-label="kWh a simular"
            />
            <button className="refresh-button" onClick={simulatePurchase}>
              Simular compra
            </button>
          </div>
          {simulateResult && (
            <p style={styles.small}>
              {simulateResult.success ? '✔' : '✖'} {simulateResult.message} — estado:{' '}
              <strong style={{ color: simulateResult.state.color }}>{simulateResult.state.label}</strong>
              {simulateResult.state.changed
                ? ` (transición: ${simulateResult.state.previous} → ${simulateResult.state.current})`
                : ' (sin cambio de estado)'}
            </p>
          )}
        </div>

        {/* ------------------------- VISITOR -------------------------- */}
        <div style={styles.box}>
          <div style={styles.boxHeader}>
            <div>
              <span className="section-kicker">VISITOR</span>
              <h3 style={styles.boxTitle}>Inventario: reporte y auditoría</h3>
            </div>
            <button className="refresh-button" onClick={runVisitor} disabled={loading}>
              {loading ? 'Recorriendo…' : 'Recorrer inventario'}
            </button>
          </div>
          <div style={styles.row}>
            <select
              value={visitorType}
              onChange={(e) => {
                setVisitorType(e.target.value as 'report' | 'audit');
                setLocalVisitorResult(null);
                setBackendVisitorResult(null);
              }}
              style={styles.select}
              aria-label="Visitante a aplicar"
            >
              <option value="report">Reporte del mercado</option>
              <option value="audit">Auditoría del mercado</option>
            </select>
          </div>
          {localVisitorResult && (
            <>
              <dl style={styles.kv}>
                {visitorType === 'report' ? (
                  <>
                    <div><dt>Ofertas visitadas</dt><dd>{localVisitorResult.market?.totalOffers ?? 0}</dd></div>
                    <div><dt>Precio promedio</dt><dd>${localVisitorResult.market?.avgPricePerKwh ?? 0}/kWh</dd></div>
                    <div><dt>Fuentes</dt><dd>{(localVisitorResult.sources ?? []).length}</dd></div>
                    <div><dt>Dispositivos IoT</dt><dd>{localVisitorResult.iot?.totalDevices ?? 0} ({localVisitorResult.iot?.onlineDevices ?? 0} en línea)</dd></div>
                  </>
                ) : (
                  <>
                    <div><dt>Incidencias</dt><dd>{localVisitorResult.totalIssues ?? 0}</dd></div>
                    <div><dt>Errores / advertencias</dt><dd>{localVisitorResult.bySeverity?.error ?? 0} / {localVisitorResult.bySeverity?.warning ?? 0}</dd></div>
                  </>
                )}
              </dl>
              <ul style={styles.list}>
                {visitorType === 'report'
                  ? Object.entries(localVisitorResult.market?.kwhAvailableByType ?? {}).map(([type, kwh]) => (
                      <li key={type}>{type}: {String(kwh)} kWh disponibles</li>
                    ))
                  : (localVisitorResult.issues ?? []).slice(0, 3).map((issue: any, i: number) => (
                      <li key={i}>[{issue.severity}] {issue.message}</li>
                    ))}
              </ul>
              {backendVisitorResult && (
                <p style={styles.small}>
                  Backend (PHP): {backendVisitorResult.visitor} —{' '}
                  {visitorType === 'report'
                    ? `${backendVisitorResult.market?.totalOffers} ofertas · ${backendVisitorResult.iot?.totalDevices} dispositivos IoT · eficiencia promedio ${backendVisitorResult.sources?.avgEfficiency}%`
                    : `${backendVisitorResult.totalIssues} incidencias (${backendVisitorResult.bySeverity?.error} errores, ${backendVisitorResult.bySeverity?.warning} advertencias)`}.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '1.3rem' },
  subtitle: { margin: '0 0 16px 0', color: '#888', fontSize: '0.85rem', lineHeight: 1.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
  box: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' },
  boxHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' },
  boxTitle: { margin: '6px 0 0 0', color: '#0f3460', fontSize: '1.05rem' },
  kv: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', margin: '10px 0 0 0' },
  list: { margin: '10px 0 0 0', paddingLeft: '18px', color: '#444', fontSize: '0.82rem', lineHeight: 1.6 },
  row: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  select: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', backgroundColor: '#fff' },
  hint: { color: '#666', fontSize: '0.8rem', margin: '6px 0' },
  small: { color: '#666', fontSize: '0.75rem', margin: '10px 0 0 0', lineHeight: 1.4 },
  message: { color: '#0f3460', backgroundColor: '#eef3fa', padding: '10px', borderRadius: '8px', margin: '14px 0 0 0', fontSize: '0.85rem' },
  undoButton: { marginTop: '12px', padding: '10px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#0f3460', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' },
};
