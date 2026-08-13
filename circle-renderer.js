(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const circle = window.VECTOR_REGNUM_CIRCLE;
  const root = document.querySelector('#circle-render-root');
  const trace = document.querySelector('#circle-trace');
  if (!circle || !root) return;

  const center = { x: 0, y: 0 };
  const outerRadius = 232;
  const ringStep = 2.2 / Math.max(1, circle.ringCount);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function svg(name, attributes = {}, parent = root) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    parent.append(element);
    return element;
  }

  function ringRadius(ring) {
    return ((2.6 - ring * ringStep) / 2.6) * outerRadius;
  }

  function position(ring, slot) {
    const angle = Math.PI * 2 * slot / circle.slotsPerRing;
    const radius = ringRadius(ring);
    return {
      x: center.x + Math.sin(angle) * radius,
      y: center.y - Math.cos(angle) * radius,
    };
  }

  function glyphFor(type, parent) {
    const path = {
      VM_DURATION: 'M-7-8H7M-7 8H7M-6-7 6 7M6-7-6 7',
      VM_DELAY: 'M-6-8V8M6-8V8',
      VM_PUSH_SELF: 'M0-8A4 4 0 1 0 0 0A4 4 0 1 0 0-8M-8 9Q0 1 8 9',
      VM_PUSH_LOOK: 'M-9 6 8-7M1-8H9V0',
      VM_MULTIPLY: 'M-8-8 8 8M8-8-8 8',
      VM_IMPULSE: 'M-10 0H8M2-6 9 0 2 6M-8-8v5M-8 3v5',
      EXECUTE: 'M0-10 3-3 10 0 3 3 0 10-3 3-10 0-3-3 0-10 3-3Z',
    }[type];

    if (type === 'VM_PUSH_NUMBER') {
      const text = svg('text', { class: 'runtime-glyph-number', x: 0, y: 4 }, parent);
      text.textContent = '1.2';
      return;
    }
    svg('path', { class: 'runtime-glyph', d: path || 'M-8 0H8M0-8V8' }, parent);
  }

  const aura = svg('g', { class: 'runtime-aura' });
  svg('circle', { class: 'runtime-aura-ring aura-one', r: outerRadius + 18 }, aura);
  svg('circle', { class: 'runtime-aura-ring aura-two', r: outerRadius - 9 }, aura);

  const ringLayer = svg('g', { class: 'runtime-rings' });
  for (let ring = 0; ring < circle.ringCount; ring += 1) {
    const radius = ringRadius(ring);
    svg('circle', {
      class: `runtime-ring runtime-ring-${ring}`,
      r: radius,
      'data-ring': ring,
    }, ringLayer);

    const particleCount = Math.max(18, circle.slotsPerRing * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const angle = Math.PI * 2 * index / particleCount;
      svg('circle', {
        class: `runtime-particle ${ring === 0 ? 'particle-end-rod' : 'particle-enchant'}`,
        cx: Math.cos(angle) * radius,
        cy: Math.sin(angle) * radius,
        r: ring === 0 ? 1.8 : 1.35,
        style: `--particle-delay: ${-(index * 37 + ring * 113)}ms`,
      }, ringLayer);
    }

    for (let slot = 0; slot < circle.slotsPerRing; slot += 1) {
      const point = position(ring, slot);
      svg('circle', {
        class: 'runtime-slot',
        cx: point.x,
        cy: point.y,
        r: 3.2,
      }, ringLayer);
    }
  }

  const ordered = [...circle.sigils].sort((left, right) =>
    left.ring - right.ring || left.slot - right.slot);
  const points = ordered.map((sigil) => position(sigil.ring, sigil.slot));
  const routeData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  svg('path', { class: 'runtime-route route-shadow', d: routeData });
  svg('path', { class: 'runtime-route route-energy', d: routeData });

  const beam = svg('line', {
    class: 'runtime-beam', x1: 0, y1: 0, x2: points[0].x, y2: points[0].y,
  });

  const nodes = ordered.map((sigil, index) => {
    const point = points[index];
    const group = svg('g', {
      class: `runtime-node ${sigil.type === 'EXECUTE' ? 'node-execute' : 'node-end-rod'}`,
      transform: `translate(${point.x} ${point.y})`,
      'data-index': index,
    });
    svg('circle', { class: 'runtime-node-pulse', r: 23 }, group);
    svg('path', { class: 'runtime-node-frame', d: 'M0-17 17 0 0 17-17 0Z' }, group);
    svg('circle', { class: 'runtime-node-core', r: 12 }, group);
    glyphFor(sigil.type, group);
    const order = svg('text', { class: 'runtime-node-order', x: 18, y: -15 }, group);
    order.textContent = String(index + 1).padStart(2, '0');
    return group;
  });

  const core = svg('g', { class: 'runtime-core' });
  svg('circle', { class: 'runtime-core-orbit core-orbit-outer', r: 61 }, core);
  svg('circle', { class: 'runtime-core-orbit core-orbit-inner', r: 42 }, core);
  svg('path', { class: 'runtime-core-mark', d: 'M0-38 27-11 38 0 27 11 0 38-27 11-38 0-27-11Z' }, core);
  svg('circle', { class: 'runtime-core-light', r: 15 }, core);
  const coreText = svg('text', { class: 'runtime-core-text', x: 0, y: 4 }, core);
  coreText.textContent = 'VM2';

  function parameterText(parameters) {
    return parameters.length ? ` [${parameters.join(', ')}]` : '';
  }

  function showStep(index) {
    const active = ordered[index];
    nodes.forEach((node, nodeIndex) => {
      node.classList.toggle('is-active', nodeIndex === index);
      node.classList.toggle('is-complete', nodeIndex < index);
    });
    beam.setAttribute('x2', points[index].x);
    beam.setAttribute('y2', points[index].y);
    if (trace) {
      trace.textContent = `${String(index + 1).padStart(2, '0')} / ${String(ordered.length).padStart(2, '0')} · ${active.type}${parameterText(active.parameters)}`;
    }
  }

  showStep(reducedMotion ? ordered.length - 1 : 0);
  if (!reducedMotion) {
    const millisecondsPerTick = 1000 / circle.tickRate;
    const cycleMilliseconds = circle.visualDurationTicks * millisecondsPerTick;
    const startedAt = performance.now();
    let shownIndex = 0;

    function advance(now) {
      const ageTicks = Math.floor(((now - startedAt) % cycleMilliseconds) / millisecondsPerTick);
      const nextIndex = Math.min(ordered.length - 1,
        Math.floor(ageTicks / circle.executionStepTicks));
      if (nextIndex !== shownIndex) {
        shownIndex = nextIndex;
        showStep(shownIndex);
      }
      window.requestAnimationFrame(advance);
    }
    window.requestAnimationFrame(advance);
  }
})();
