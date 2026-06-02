import React, {useEffect, useMemo, useState} from 'react';
import styles from './styles.module.css';

const DEFAULT_CATALOG_URL =
  'https://raw.githubusercontent.com/powerloom/snapshotter-computes/bds_eth_uniswapv3_core/api/endpoints.json';

function epochDenominator(creditPerEpoch) {
  if (!Number.isFinite(creditPerEpoch) || creditPerEpoch <= 0) return null;
  const den = Math.round(1 / creditPerEpoch);
  return Math.abs(den * creditPerEpoch - 1) < 1e-9 ? den : null;
}

function creditsLabel(weight, billing) {
  const w = Number.isFinite(weight) && weight > 0 ? weight : 1;
  const perEpoch = billing?.credit_per_epoch;
  if (!Number.isFinite(perEpoch) || perEpoch <= 0) {
    return `×${w}`;
  }
  const den = epochDenominator(perEpoch);
  if (den != null) {
    return w === 1 ? `1/${den} credit` : `${w}/${den} credits`;
  }
  const product = w * perEpoch;
  return `${product} credit${product === 1 ? '' : 's'}`;
}

function billingColumn(ep, billing) {
  const mod = ep.billing_modifier;
  if (ep.sse === true || mod?.type === 'stream_session') {
    const session =
      Number.isFinite(mod?.credits_per_connection) && mod.credits_per_connection > 0
        ? mod.credits_per_connection
        : billing?.credit_per_stream_session;
    if (Number.isFinite(session) && session > 0) {
      return `${session} credits / session`;
    }
    return 'flat rate / session';
  }
  if (mod?.type === 'lookback_multiplier') {
    const base = Number.isFinite(ep.credit_weight) ? ep.credit_weight : 5;
    return `${creditsLabel(base, billing)} × lookback (see below)`;
  }
  return creditsLabel(ep.credit_weight, billing);
}

function weightColumn(ep) {
  const mod = ep.billing_modifier;
  if (ep.sse === true || mod?.type === 'stream_session') {
    return '—';
  }
  if (mod?.type === 'lookback_multiplier') {
    const base = Number.isFinite(ep.credit_weight) ? ep.credit_weight : 5;
    return `${base} × lookback`;
  }
  const w = Number.isFinite(ep.credit_weight) ? ep.credit_weight : 1;
  return String(w);
}

function meteredEndpoints(catalog) {
  const eps = Array.isArray(catalog?.endpoints) ? catalog.endpoints : [];
  return eps
    .filter((e) => e && e.metered !== false && typeof e.path === 'string')
    .sort((a, b) => a.path.localeCompare(b.path));
}

export default function LiveMeteredRoutesTable({catalogUrl = DEFAULT_CATALOG_URL}) {
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

  const rows = useMemo(() => meteredEndpoints(state.data), [state.data]);
  const billing = state.data?.billing;
  const market = state.data?.market;
  const version = state.data?.version;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <strong>Metered routes (live)</strong>
          <p>
            Fetched from <code>api/endpoints.json</code> — same catalog the resolver and{' '}
            <code>bds-agent</code> use for route matching and credit weights.
          </p>
        </div>
        <a href={catalogUrl} target="_blank" rel="noreferrer">
          Open catalog JSON
        </a>
      </div>

      {state.loading && <p className={styles.status}>Loading catalog…</p>}

      {state.error && (
        <div className={styles.error}>
          Could not load the live catalog: <code>{state.error}</code>
          <br />
          Open the catalog JSON above for the full route list.
        </div>
      )}

      {!state.loading && !state.error && rows.length === 0 && (
        <div className={styles.error}>No metered endpoints found in the catalog.</div>
      )}

      {!state.loading && !state.error && rows.length > 0 && (
        <>
          <div className={styles.meta}>
            {market && <span>{market}</span>}
            {Number.isFinite(version) && <span>catalog v{version}</span>}
            <span>{rows.length} metered route(s)</span>
            {billing?.credit_per_epoch != null && (
              <span>base GET ≈ 1/7200 credit</span>
            )}
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Metered route</th>
                  <th>
                    <code>credit_weight</code>
                  </th>
                  <th>Typical credits</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((ep) => (
                  <tr key={`${ep.method || 'GET'}:${ep.path}`}>
                    <td className={styles.pathCell}>
                      <code>{ep.path}</code>
                    </td>
                    <td>{weightColumn(ep)}</td>
                    <td>{billingColumn(ep, billing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
