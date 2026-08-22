const assert = require('assert');
const { shouldTriggerAntiNuke, isTrustedTarget } = require('../src/utils/antinukeGuard');

const state = new Map();
const now = Date.now();

assert.strictEqual(shouldTriggerAntiNuke('guild-1', 'roleCreate', state, now), false);
assert.strictEqual(shouldTriggerAntiNuke('guild-1', 'roleCreate', state, now + 1000), false);
assert.strictEqual(shouldTriggerAntiNuke('guild-1', 'roleCreate', state, now + 2000), true);

const botState = new Map();
assert.strictEqual(shouldTriggerAntiNuke('guild-2', 'botAdd', botState, now), false);
assert.strictEqual(shouldTriggerAntiNuke('guild-2', 'botAdd', botState, now + 1000), true);

const webhookState = new Map();
assert.strictEqual(shouldTriggerAntiNuke('guild-3', 'webhook', webhookState, now), false);
assert.strictEqual(shouldTriggerAntiNuke('guild-3', 'webhook', webhookState, now + 1000), true);

assert.strictEqual(isTrustedTarget({ whitelistUserIds: ['user-1'] }, { id: 'user-1', roles: { cache: new Map() } }), true);
assert.strictEqual(isTrustedTarget({ whitelistRoleIds: ['role-1'] }, { id: 'user-2', roles: { cache: new Map([['role-1', { id: 'role-1' }]]) } }), true);
assert.strictEqual(isTrustedTarget({ whitelistUserIds: ['user-1'] }, { id: 'user-2', roles: { cache: new Map() } }), false);

console.log('antinukeGuard tests passed');
