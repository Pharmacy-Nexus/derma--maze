'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');

const store = new Map();
global.window = global;
global.currentDMLang = 'en';
global.DM_SITE_CONFIG = { study: { defaultDailyTarget: 20 }, order: {} };
global.location = { pathname: '/dashboard.html', hash: '' };
global.CustomEvent = class CustomEvent { constructor(type) { this.type = type; } };
global.document = {
  body: null,
  addEventListener() {},
  getElementById() { return null; },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  createElement() { return {}; }
};
global.dispatchEvent = () => true;
global.addEventListener = () => {};
global.dmStorageGet = (key, fallback = null) => store.has(key) ? store.get(key) : fallback;
global.dmStorageSet = (key, value) => { store.set(key, value); return true; };
global.dmStorageRemove = key => { store.delete(key); return true; };
global.dmStorageGetJSON = (key, fallback = null) => {
  if (!store.has(key)) return fallback;
  try { return JSON.parse(store.get(key)); } catch { return fallback; }
};
global.dmStorageSetJSON = (key, value) => { store.set(key, JSON.stringify(value)); return true; };

require(path.resolve(__dirname, '../js/core/study-tracker.js'));

assert.throws(() => DMStudy.importData({ schema:'derma-maze-study-backup', version:99, data:{} }), /Invalid backup/);

const valid = {
  schema:'derma-maze-study-backup', version:1, data:{
    meta:{studyDays:['2026-07-30','not-a-date'],visits:3,lastVisited:{slug:'intro',anchor:'#question-bank',timestamp:123}},
    notes:[{id:'n1',chapter:'intro',text:'hello',createdAt:1,updatedAt:2}],
    target:25,
    chapters:{
      dermaMazeIntroProgressV1:{answers:{Q1:{selected:'A',correct:true,updatedAt:10}},bookmarks:['Q1']}
    },
    drugFavorites:['terbinafine','terbinafine']
  }
};
assert.equal(DMStudy.importData(valid), true);
assert.equal(JSON.parse(store.get('dermaMazeNotesV1')).length, 1);
assert.equal(store.get('dermaMazeDailyTargetV1'), '25');
assert.deepEqual(JSON.parse(store.get('dermaMazeDrugFavoritesV1')), ['terbinafine']);
assert.deepEqual(JSON.parse(store.get('dermaMazeStudyMetaV1')).studyDays, ['2026-07-30']);

// A failed write must restore every previous value.
store.set('dermaMazeNotesV1', JSON.stringify([{id:'old',chapter:'general',text:'keep me'}]));
const before = new Map(store);
const normalSetJSON = global.dmStorageSetJSON;
global.dmStorageSetJSON = (key, value) => key === 'dermaMazeBacterialProgressV1' ? false : normalSetJSON(key, value);
assert.throws(() => DMStudy.importData({
  ...valid,
  data:{...valid.data,chapters:{...valid.data.chapters,dermaMazeBacterialProgressV1:{answers:{B1:{selected:'B',correct:false}},bookmarks:[]}}}
}), /Storage unavailable/);
global.dmStorageSetJSON = normalSetJSON;
for (const [key, value] of before) assert.equal(store.get(key), value, `rollback failed for ${key}`);

console.log('PASS: backup schema validation, sanitization, and rollback.');
