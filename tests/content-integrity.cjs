'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const CHAPTERS = [
  { slug: 'intro', prefix: 'INTRO' },
  { slug: 'bacterial', prefix: 'BACTERIAL' },
  { slug: 'fungal', prefix: 'FUNGAL' },
  { slug: 'viral', prefix: 'VIRAL' },
  { slug: 'parasitic', prefix: 'PARASITIC' },
  { slug: 'myco', prefix: 'MYCO' }
];
const VALID_TYPES = new Set(['MCQ', 'Case', 'Treatment', 'Image']);
const VALID_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);
const VALID_LETTERS = ['A', 'B', 'C', 'D'];

function loadScripts(files) {
  const context = { window: {} };
  vm.createContext(context);
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    vm.runInContext(code, context, { filename: path.relative(ROOT, file) });
  }
  return context.window;
}

function nonEmptyString(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim(), `${label} must not be empty`);
}

function bilingual(value, label) {
  assert.ok(value && typeof value === 'object', `${label} must be an object`);
  nonEmptyString(value.en, `${label}.en`);
  nonEmptyString(value.ar, `${label}.ar`);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function normalizedObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

function assertImageExists(image, label) {
  if (image === null || image === undefined || image === '') return;
  nonEmptyString(image, label);
  if (image.startsWith('data:image/')) return;
  const full = path.resolve(ROOT, image);
  assert.ok(full.startsWith(ROOT + path.sep), `${label} escapes project root: ${image}`);
  assert.ok(fs.existsSync(full), `${label} references a missing file: ${image}`);
}

let totalQuestions = 0;
for (const chapter of CHAPTERS) {
  const dir = path.join(ROOT, 'data', chapter.slug);
  const files = fs.readdirSync(dir)
    .filter(name => /^questions-\d+\.js$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(name => path.join(dir, name));
  assert.ok(files.length, `${chapter.slug}: no question data files found`);

  const data = loadScripts(files);
  const topics = data[`${chapter.prefix}_TOPICS`];
  const questions = data[`${chapter.prefix}_QUESTIONS`];
  const stats = data[`${chapter.prefix}_STATS`];

  assert.ok(Array.isArray(topics), `${chapter.slug}: topics array is missing`);
  assert.ok(Array.isArray(questions), `${chapter.slug}: questions array is missing`);
  assert.ok(stats && typeof stats === 'object', `${chapter.slug}: stats object is missing`);

  const topicSlugs = new Set();
  for (const topic of topics) {
    nonEmptyString(topic.slug, `${chapter.slug}: topic slug`);
    assert.ok(!topicSlugs.has(topic.slug), `${chapter.slug}: duplicate topic slug ${topic.slug}`);
    topicSlugs.add(topic.slug);
    bilingual(topic.title, `${chapter.slug}/${topic.slug}: topic title`);
    assertImageExists(topic.image, `${chapter.slug}/${topic.slug}: topic image`);
  }

  const ids = new Set();
  for (const question of questions) {
    nonEmptyString(question.id, `${chapter.slug}: question id`);
    assert.ok(!ids.has(question.id), `${chapter.slug}: duplicate question id ${question.id}`);
    ids.add(question.id);

    nonEmptyString(question.topic, `${chapter.slug}/${question.id}: topic`);
    assert.ok(topicSlugs.has(question.topic), `${chapter.slug}/${question.id}: unknown topic ${question.topic}`);
    assert.ok(VALID_TYPES.has(question.type), `${chapter.slug}/${question.id}: invalid type ${question.type}`);
    assert.ok(VALID_DIFFICULTIES.has(question.difficulty), `${chapter.slug}/${question.id}: invalid difficulty ${question.difficulty}`);
    bilingual(question.question, `${chapter.slug}/${question.id}: question`);
    bilingual(question.explanation, `${chapter.slug}/${question.id}: explanation`);
    bilingual(question.reasoning, `${chapter.slug}/${question.id}: reasoning`);

    assert.ok(Array.isArray(question.options), `${chapter.slug}/${question.id}: options must be an array`);
    assert.equal(question.options.length, 4, `${chapter.slug}/${question.id}: exactly four options are required`);
    const letters = question.options.map(option => option.letter);
    assert.deepEqual([...letters].sort(), VALID_LETTERS, `${chapter.slug}/${question.id}: option letters must be A-D exactly once`);
    for (const option of question.options) {
      bilingual(option, `${chapter.slug}/${question.id}/${option.letter}: option`);
    }
    assert.ok(letters.includes(question.correct), `${chapter.slug}/${question.id}: correct answer ${question.correct} is not an option`);
    assertImageExists(question.image, `${chapter.slug}/${question.id}: question image`);
  }

  assert.equal(stats.total, questions.length, `${chapter.slug}: stats.total does not match question count`);
  assert.deepEqual(
    normalizedObject(stats.types),
    normalizedObject(countBy(questions, 'type')),
    `${chapter.slug}: stats.types does not match question data`
  );
  assert.deepEqual(
    normalizedObject(stats.difficulties),
    normalizedObject(countBy(questions, 'difficulty')),
    `${chapter.slug}: stats.difficulties does not match question data`
  );

  for (const topic of topics) {
    const topicQuestions = questions.filter(question => question.topic === topic.slug);
    assert.equal(topic.count, topicQuestions.length, `${chapter.slug}/${topic.slug}: topic count is incorrect`);
    assert.deepEqual(
      normalizedObject(topic.types || {}),
      normalizedObject(countBy(topicQuestions, 'type')),
      `${chapter.slug}/${topic.slug}: topic type counts are incorrect`
    );
  }

  totalQuestions += questions.length;
}

const drugData = loadScripts([path.join(ROOT, 'data', 'drugs', 'drugs.js')]);
const drugs = drugData.DERMA_MAZE_DRUGS;
assert.ok(Array.isArray(drugs), 'Drug index is missing');
const drugIds = new Set();
for (const drug of drugs) {
  nonEmptyString(drug.id, 'Drug id');
  assert.ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(drug.id), `Invalid drug id: ${drug.id}`);
  assert.ok(!drugIds.has(drug.id), `Duplicate drug id: ${drug.id}`);
  drugIds.add(drug.id);
  nonEmptyString(drug.name, `${drug.id}: name`);
  bilingual(drug.class, `${drug.id}: class`);
  bilingual(drug.subclass, `${drug.id}: subclass`);
  nonEmptyString(drug.category, `${drug.id}: category`);
  assert.ok(Array.isArray(drug.aliases), `${drug.id}: aliases must be an array`);
  assert.ok(Array.isArray(drug.dermatologyForms), `${drug.id}: dermatologyForms must be an array`);
  assert.ok(Array.isArray(drug.bookLocations) && drug.bookLocations.length > 0, `${drug.id}: bookLocations must not be empty`);

  const formIds = new Set();
  for (const form of drug.dermatologyForms) {
    nonEmptyString(form.id, `${drug.id}: form id`);
    assert.ok(!formIds.has(form.id), `${drug.id}: duplicate form id ${form.id}`);
    formIds.add(form.id);
    nonEmptyString(form.route, `${drug.id}/${form.id}: route`);
    bilingual(form.form, `${drug.id}/${form.id}: form label`);
    nonEmptyString(form.egyptStatus, `${drug.id}/${form.id}: Egypt status`);
    assert.ok(Array.isArray(form.brands), `${drug.id}/${form.id}: brands must be an array`);
  }

  for (const location of drug.bookLocations) {
    nonEmptyString(location.chapter, `${drug.id}: book chapter`);
    bilingual(location.section, `${drug.id}/${location.chapter}: book section`);
    assert.ok(location.page === null || Number.isInteger(location.page), `${drug.id}: book page must be null or an integer`);
  }
}

console.log(`PASS: ${totalQuestions} questions, ${drugs.length} drug records, topic totals, bilingual fields, answer keys, and image references are internally consistent.`);
