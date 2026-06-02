import React, {useEffect, useMemo, useState} from 'react';
import styles from './styles.module.css';

// Same default catalog the resolver uses (snapshotter-core-edge endpoint_catalog.py).
const DEFAULT_CATALOG_URL =
  'https://raw.githubusercontent.com/powerloom/snapshotter-computes/bds_eth_uniswapv3_core/api/endpoints.json';

function windowLabel(maxSeconds) {
  if (maxSeconds % 86400 === 0) {
    const d = maxSeconds / 86400;
    return `≤ ${d} day${d > 1 ? 's' : ''} (${maxSeconds}s)`;
  }
  if (maxSeconds % 3600 === 0) {
    const h = maxSeconds / 3600;
    return `≤ ${h} hour${h > 1 ? 's' : ''} (${maxSeconds}s)`;
  }
  if (maxSeconds % 60 === 0) {
    return `≤ ${maxSeconds / 60} min (${maxSeconds}s)`;
  }
  return `≤ ${maxSeconds}s`;
}

function findLookbackEndpoint(catalog) {
  const eps = Array.isArray(catalog?.endpoints) ? catalog.endpoints : [];
  return eps.find(
    (e) => e && e.billing_modifier && e.billing_modifier.type === 'lookback_multiplier',
  );
}

export default function LiveTimeseriesMultiplier({catalogUrl = DEFAULT_CATALOG_URL}) {
  const [state, setState] = useState({loading: true, error: null, data: null});

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(catalogUrl, {
          headers: {Accept: 'application/json'},
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`GET catalog returned ${response.status}`);
        }
        const data = await response.json();
        setState({loading: false, error: null, data});
      } catch (error) {
        if (error.name === 'AbortError') return;
        setState({loading: false, error: error.message, data: null});
      }
    }
    load();
    return () => controller.abort();
  }, [catalogUrl]);

  const model = useMemo(() => {
    const ep = findLookbackEndpoint(state.data);
    if (!ep) return null;
    const base = Number.isFinite(ep.credit_weight) ? ep.credit_weight : 1;
    const mod = ep.billing_modifier;
    const tiers = Array.isArray(mod.tiers)
      ? [...mod.tiers].sort((a, b) => a.max_seconds - b.max_seconds)
      : [];
    return {
      path: ep.path,
      param: mod.param,
      base,
      tiers,
      overflow: Number.isFinite(mod.overflow_multiplier) ? mod.overflow_multiplier : 1,
      version: state.data?.version,
    };
  }, [state.data]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <strong>Time series lookback multiplier (live)</strong>
          <p>
            Fetched from the resolver endpoint catalog (<code>billing_modifier</code> on the
            time series route). Effective debit ={' '}
            <code>CREDIT_PER_EPOCH × base_weight × multiplier</code>.
          </p>
        </div>
        <a href={catalogUrl} target="_blank" rel="noreferrer">
          Open catalog JSON
        </a>
      </div>

      {state.loading && <p className={styles.status}>Loading latest multipliers…</p>}

      {state.error && (
        <div className={styles.error}>
          Could not load the live catalog: <code>{state.error}</code>
          <br />
          Open the catalog JSON above to read <code>billing_modifier.tiers</code> directly.
        </div>
      )}

      {!state.loading && !state.error && !model && (
        <div className={styles.error}>
          No <code>lookback_multiplier</code> billing modifier found in the catalog.
        </div>
      )}

      {!state.loading && !state.error && model && (
        <>
          <div className={styles.meta}>
            <span>
              <code>{model.path}</code>
            </span>
            <span>base weight ×{model.base}</span>
            <span>keyed off <code>{model.param}</code></span>
            {Number.isFinite(model.version) && <span>catalog v{model.version}</span>}
          </div>
          <table>
            <thead>
              <tr>
                <th>Lookback window (<code>{model.param}</code>)</th>
                <th>Multiplier</th>
                <th>Effective cost (base ×{model.base})</th>
              </tr>
            </thead>
            <tbody>
              {model.tiers.map((t) => (
                <tr key={t.max_seconds}>
                  <td>{windowLabel(t.max_seconds)}</td>
                  <td>{t.multiplier}×</td>
                  <td>{t.multiplier * model.base}</td>
                </tr>
              ))}
              {model.tiers.length > 0 && (
                <tr>
                  <td>&gt; {windowLabel(model.tiers[model.tiers.length - 1].max_seconds).replace('≤ ', '')}</td>
                  <td>{model.overflow}×</td>
                  <td>{model.overflow * model.base}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
