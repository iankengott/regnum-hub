/*
 * Generated website fixture from Vector-Regnum's real vmStarterCircle().
 * Source commit: db9346d9605290692af94a234fd1fbc4998da836
 * CircleAuthoringService.java:469-483
 * CircleOrder.java:6-16
 * SpellVisualManager.java:423-458
 */
window.VECTOR_REGNUM_CIRCLE = Object.freeze({
  schemaVersion: 1,
  id: 'typed-vector-step',
  name: 'Typed Vector Step',
  ringCount: 3,
  slotsPerRing: 8,
  tickRate: 20,
  ringRefreshTicks: 4,
  executionStepTicks: 12,
  visualDurationTicks: 300,
  sourceCommit: 'db9346d9605290692af94a234fd1fbc4998da836',
  sigils: Object.freeze([
    { ring: 0, slot: 0, type: 'VM_DURATION', parameters: ['1'] },
    { ring: 0, slot: 1, type: 'VM_DELAY', parameters: ['20'] },
    { ring: 0, slot: 2, type: 'VM_PUSH_SELF', parameters: [] },
    { ring: 0, slot: 3, type: 'VM_PUSH_LOOK', parameters: [] },
    { ring: 0, slot: 4, type: 'VM_PUSH_NUMBER', parameters: ['1.2'] },
    { ring: 0, slot: 5, type: 'VM_MULTIPLY', parameters: [] },
    { ring: 1, slot: 0, type: 'VM_IMPULSE', parameters: ['20', '0'] },
    { ring: 2, slot: 0, type: 'EXECUTE', parameters: [] },
  ]),
});
