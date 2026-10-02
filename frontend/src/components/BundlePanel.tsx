import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import bundleService from '../patterns/composite/BundleService';
import type { BundleNode } from '../patterns/composite/BundleComponent';

// Muestra el Patron Composite: un arbol de paquetes de energia donde los
// totales (kWh y precio) se calculan de forma recursiva. El mismo arbol se
// evalua localmente (TypeScript) y en el backend (PHP).
export default function BundlePanel() {
  const [tree, setTree] = useState<BundleNode | null>(null);
  const [backendTree, setBackendTree] = useState<BundleNode | null>(null);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();

  useEffect(() => {
    api
      .getSampleBundle()
      .then((sample) => setTree(bundleService.evaluate(sample)))
      .catch(() => setTree(bundleService.evaluate(bundleService.getSampleTree())));
  }, []);

  const handleAddOffer = () => {
    const name = prompt('Nombre de la oferta a agregar al Paquete del Mercado:');
    if (!name || !tree) return;
    const kwhStr = prompt('Cantidad (kWh):', '10');
    const priceStr = prompt('Precio por kWh (COP):', '500');
    const kwh = parseFloat(kwhStr ?? '');
    const price = parseFloat(priceStr ?? '');
    if (!Number.isFinite(kwh) || kwh <= 0 || !Number.isFinite(price) || price < 0) {
      alert('Valores no validos.');
      return;
    }
    const updated: BundleNode = {
      ...tree,
      children: [
        ...tree.children,
        {
          type: 'offer',
          name,
          energyType: 'solar',
          kwh,
          pricePerKwh: price,
          totalKwh: kwh,
          totalPrice: kwh * price,
          children: [],
        },
      ],
    };
    setTree(bundleService.evaluate(updated));
    setBackendTree(null);
  };

  const handleBackendEvaluate = async () => {
    if (!tree) return;
    try {
      const result = await api.evaluateBundle(tree);
      setBackendTree(result);
    } catch {
      setError('No se pudo evaluar el paquete en el backend.');
    }
  };

  const sameTotal =
    tree && backendTree && Math.abs(tree.totalPrice - backendTree.totalPrice) < 0.01;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Paquetes de energia (Composite)</h2>
      <p style={styles.subtitle}>
        Un paquete (<strong>EnergyBundle</strong>) contiene ofertas (<strong>OfferLeaf</strong>) u
        otros paquetes. Los totales se calculan recursivamente: {tree?.offerCount ?? 0} ofertas hoja
        dentro del arbol.
      </p>

      {tree && (
        <div style={styles.treeBox}>
          <TreeNode node={tree} depth={0} />
        </div>
      )}

      <div style={styles.actions}>
        <button onClick={handleAddOffer} style={styles.secondaryButton}>
          + Agregar oferta al paquete raiz
        </button>
        <button onClick={handleBackendEvaluate} style={styles.primaryButton}>
          Evaluar arbol en el backend
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {backendTree && (
        <p style={sameTotal ? styles.matchOk : styles.matchWarn}>
          {sameTotal
            ? `El Composite del backend (PHP) coincide: ${backendTree.totalKwh} kWh · $${backendTree.totalPrice.toLocaleString()} COP.`
            : `El backend calculo $${backendTree.totalPrice.toLocaleString()} COP.`}
        </p>
      )}
    </div>
  );
}

function TreeNode({ node, depth }: { node: BundleNode; depth: number }) {
  const isBundle = node.type === 'bundle';
  return (
    <div>
      <div
        style={{
          ...styles.nodeRow,
          marginLeft: depth * 20,
          backgroundColor: isBundle ? '#eef4ff' : '#f9f9f9',
          borderLeft: `3px solid ${isBundle ? '#0f3460' : '#16c784'}`,
        }}
      >
        <span>
          {isBundle ? '📦' : '⚡'} <strong>{node.name}</strong>
          {!isBundle && node.energyType ? ` (${node.energyType})` : ''}
        </span>
        <span style={styles.nodeTotals}>
          {node.totalKwh} kWh · ${node.totalPrice.toLocaleString()}
        </span>
      </div>
      {node.children.map((child, i) => (
        <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} />
      ))}
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
  title: { margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '1.3rem' },
  subtitle: { margin: '0 0 16px 0', color: '#666', fontSize: '0.9rem', lineHeight: 1.5 },
  treeBox: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  nodeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#1a1a2e',
  },
  nodeTotals: { fontWeight: 'bold', color: '#0f3460' },
  actions: { marginTop: '16px', display: 'flex', gap: '12px' },
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
  secondaryButton: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
    backgroundColor: '#fff',
    color: '#0f3460',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  error: { color: '#c0392b', margin: '12px 0 0 0' },
  matchOk: { margin: '12px 0 0 0', color: '#16c784', fontSize: '0.85rem', fontWeight: 'bold' },
  matchWarn: { margin: '12px 0 0 0', color: '#c0392b', fontSize: '0.85rem' },
};
