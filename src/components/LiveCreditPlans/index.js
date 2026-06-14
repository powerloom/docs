import React, {useEffect, useMemo, useState} from 'react';
import styles from './styles.module.css';

const PLANS_URL = 'https://bds-metering.powerloom.io/credits/plans';

const CHAIN_NAMES = {
  1: 'Ethereum',
  137: 'Polygon',
  7869: 'Powerloom',
  42161: 'Arbitrum One',
  10: 'Optimism',
  42431: 'Moderato',
};

function chainName(chainId) {
  return CHAIN_NAMES[chainId] ? `${CHAIN_NAMES[chainId]} (${chainId})` : `Chain ${chainId}`;
}

function paymentKindLabel(paymentKind) {
  if (paymentKind === 'native_value') {
    return 'native value transfer';
  }
  if (paymentKind === 'erc20') {
    return 'ERC-20 transfer';
  }
  return paymentKind || 'unknown';
}

export default function LiveCreditPlans() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
    fetchedAt: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlans() {
      try {
        const response = await fetch(PLANS_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`GET /credits/plans returned ${response.status}`);
        }

        const data = await response.json();
        setState({
          loading: false,
          error: null,
          data,
          fetchedAt: new Date().toISOString(),
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        setState({
          loading: false,
          error: error.message,
          data: null,
          fetchedAt: null,
        });
      }
    }

    loadPlans();

    return () => controller.abort();
  }, []);

  const activePlans = useMemo(() => {
    return (state.data?.plans || [])
      .filter((plan) => plan.active !== false)
      .sort((a, b) => {
        const orderA = Number.isFinite(a.sort_order) ? a.sort_order : 0;
        const orderB = Number.isFinite(b.sort_order) ? b.sort_order : 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return String(a.label || a.id).localeCompare(String(b.label || b.id));
      });
  }, [state.data]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <strong>Live payment plans</strong>
          <p>
            Fetched from <code>GET /credits/plans</code> on the metering service.
          </p>
        </div>
        <a href={PLANS_URL} target="_blank" rel="noreferrer">
          Open JSON
        </a>
      </div>

      <pre className={styles.curlBlock}>
        <code>{`curl -sS ${PLANS_URL}`}</code>
      </pre>

      {state.loading && <p className={styles.status}>Loading latest plans...</p>}

      {state.error && (
        <div className={styles.error}>
          Could not load the live plan list: <code>{state.error}</code>
          <br />
          Use the curl command above to query the endpoint directly.
        </div>
      )}

      {!state.loading && !state.error && (
        <>
          <div className={styles.meta}>
            <span>{activePlans.length} active plan(s)</span>
            {state.fetchedAt && (
              <span>Fetched {new Date(state.fetchedAt).toLocaleString()}</span>
            )}
            {state.data?.epoch_unit?.note && <span>{state.data.epoch_unit.note}</span>}
          </div>

          <div className={styles.planGrid}>
            {activePlans.map((plan) => (
              <article className={styles.planCard} key={`${plan.id}-${plan.chain_id}`}>
                <div className={styles.planTitle}>{plan.label || plan.id}</div>
                <div className={styles.planMeta}>
                  <span>{plan.credits} credits</span>
                  <span>{chainName(plan.chain_id)}</span>
                </div>
                <dl className={styles.planDetails}>
                  <div>
                    <dt>Token</dt>
                    <dd>{plan.token_symbol || 'unknown'}</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd>{plan.token_amount}</dd>
                  </div>
                  <div>
                    <dt>Payment</dt>
                    <dd>{paymentKindLabel(plan.payment_kind)}</dd>
                  </div>
                  {plan.offer && (
                    <div>
                      <dt>Offer</dt>
                      <dd>{plan.offer}</dd>
                    </div>
                  )}
                </dl>
                {plan.description && <p className={styles.description}>{plan.description}</p>}
              </article>
            ))}
          </div>

          {state.data?.primary_recipient && (
            <div className={styles.recipient}>
              Primary recipient: <code>{state.data.primary_recipient}</code>
            </div>
          )}
        </>
      )}
    </div>
  );
}
