import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compiled = ts.transpileModule(
  readFileSync(
    new URL('../lib/analytics/marketing-funnel.ts', import.meta.url),
    'utf8',
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
function browser({ consent, ready = true, search = '' } = {}) {
  const local = new Map(
    consent ? [['griit_marketing_analytics_consent', consent]] : [],
  );
  const session = new Map();
  const events = [];
  const window = {
    location: { search },
    localStorage: { getItem: (key) => local.get(key) ?? null },
    sessionStorage: {
      getItem: (key) => session.get(key) ?? null,
      setItem: (key, value) => session.set(key, value),
    },
    griitAnalyticsReady: ready,
    gtag: (...args) => events.push(args),
    dispatchEvent() {},
  };
  const context = vm.createContext({
    exports: {},
    window,
    Event,
    URLSearchParams,
    queueMicrotask,
  });
  vm.runInContext(compiled, context);
  return {
    window,
    local,
    session,
    events,
    track: context.exports.trackMarketingFunnelEvent,
    markReady: context.exports.markMarketingAnalyticsReady,
  };
}

test('no events or attribution storage before consent or after refusal', () => {
  for (const consent of [undefined, 'declined']) {
    const b = browser({ consent, search: '?utm_source=instagram' });
    assert.equal(b.track('signup_view'), false);
    assert.equal(b.events.length, 0);
    assert.equal(b.session.size, 0);
  }
});
test('a view can be retried after consent and initialization', () => {
  const b = browser({ ready: false });
  assert.equal(b.track('signup_view'), false);
  b.local.set('griit_marketing_analytics_consent', 'accepted');
  assert.equal(b.track('signup_view'), false);
  b.window.griitAnalyticsReady = true;
  assert.equal(b.track('signup_view'), true);
  assert.equal(b.events.length, 1);
});
test('Instagram and referring profile attribution survive internal navigation', () => {
  const b = browser({
    consent: 'accepted',
    search:
      '?utm_source=instagram&utm_medium=social&utm_campaign=bio&source=partner_profile&profile=runner',
  });
  b.track('marketing_page_view');
  b.window.location.search = '';
  b.track('signup_view', { source: undefined, profile: undefined });
  const payload = b.events[1][2];
  assert.equal(payload.utm_source, 'instagram');
  assert.equal(payload.source, 'partner_profile');
  assert.equal(payload.profile, 'runner');
});
test('invalid campaign values are discarded and blocked storage does not crash navigation', () => {
  const b = browser({
    consent: 'accepted',
    search: '?utm_source=%3Cscript%3E',
  });
  b.track('signup_view');
  assert.equal(b.events[0][2].utm_source, undefined);
  b.window.localStorage.getItem = () => {
    throw new Error('blocked');
  };
  assert.equal(b.track('signup_view'), false);
});

test('readiness is announced after the inline initialization has executed', async () => {
  const b = browser({ consent: 'accepted', ready: false });
  delete b.window.gtag;
  const readyEvents = [];
  b.window.dispatchEvent = (event) => {
    readyEvents.push(event.type);
    b.track('signup_view');
  };
  b.markReady();
  assert.equal(b.window.griitAnalyticsReady, false);
  b.window.gtag = (...args) => b.events.push(args);
  await new Promise((resolve) => queueMicrotask(resolve));
  assert.deepEqual(readyEvents, ['griit-marketing-analytics-ready']);
  assert.equal(b.events[0][1], 'signup_view');
});
