// NOTE: This file was a content-generation tool using Anthropic API --> This is not part of the runtime bundle!
// #!/usr/bin/env node
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const COUNTRIES_FILE = path.join(DATA_DIR, 'countries.json');
const PUZZLES_FILE = path.join(DATA_DIR, 'puzzles.json');
const FAILED_FILE = path.join(DATA_DIR, 'failed.json');
const HINTS_PROMPT_FILE = path.join(__dirname, '../prompts/generateHints.txt');
const VERIFY_PROMPT_FILE = path.join(__dirname, '../prompts/verifyUniqueness.txt');

const GENERATION_MODEL = 'claude-sonnet-4-6';
const VERIFY_MODEL = 'claude-haiku-4-5-20251001';
const MAX_RETRIES = 3;
const BETWEEN_COUNTRY_DELAY_MS = 600;

// ── Helpers ──────────────────────────────────────────────────────────────────

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function readJSON(p, fallback = null) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

function interpolate(template, vars) {
  return Object.entries(vars).reduce(
    (t, [k, v]) => t.replaceAll(`{{${k}}}`, v),
    template
  );
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON in response:\n${text.slice(0, 300)}`);
  return JSON.parse(match[0]);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API call with retry on transient errors ───────────────────────────────────

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callAPI(model, prompt, maxTokens) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await client.messages.create({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });
      return res.content[0].text.trim();
    } catch (err) {
      lastErr = err;
      if (err.status === 429 || (err.status >= 500 && err.status < 600)) {
        const wait = Math.pow(2, attempt) * 2000;
        process.stdout.write(`\n  [API ${err.status}] waiting ${wait / 1000}s... `);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}

// ── Core generation & verification ───────────────────────────────────────────

async function generateHints(country, template) {
  const prompt = interpolate(template, { COUNTRY: country });
  const text = await callAPI(GENERATION_MODEL, prompt, 1024);
  const data = extractJSON(text);

  if (!Array.isArray(data.hints) || data.hints.length !== 6) {
    throw new Error(`Expected 6 hints, got ${data.hints?.length ?? 'none'}`);
  }
  return data.hints;
}

async function verifyHints(countryObj, hints, template) {
  const [h1, h2, h3, h4, h5, h6] = hints;
  const prompt = interpolate(template, {
    HINT_1: h1,
    HINT_2: h2,
    HINT_3: h3,
    HINT_4: h4,
    HINT_5: h5,
    HINT_6: h6,
  });
  const text = await callAPI(VERIFY_MODEL, prompt, 768);
  const data = extractJSON(text);

  const matches = (data.matching_countries ?? []).map((s) => s.toLowerCase().trim());
  const acceptedNames = [
    countryObj.name,
    countryObj.official,
    ...(countryObj.aliases ?? []),
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase().trim());

  return {
    passes: matches.length === 1 && acceptedNames.includes(matches[0]),
    matches: data.matching_countries ?? [],
    reasoning: data.reasoning ?? '',
  };
}

async function processCountry(countryObj, hintsTemplate, verifyTemplate) {
  const country = countryObj.name;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const hints = await generateHints(country, hintsTemplate);
      const { passes, matches } = await verifyHints(countryObj, hints, verifyTemplate);

      if (passes) return hints;

      const got = matches.length ? matches.join(', ') : 'no match';
      process.stdout.write(`\n    ↳ attempt ${attempt}/${MAX_RETRIES} wrong (got: ${got}), retrying... `);
    } catch (err) {
      process.stdout.write(`\n    ↳ attempt ${attempt}/${MAX_RETRIES} error: ${err.message}, retrying... `);
    }
  }
  return null;
}

// ── CLI arg parsing ───────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const countryArg = args.find((a) => a.startsWith('--country='))?.slice('--country='.length);
  const dryRun = args.includes('--dry-run');
  return { countryArg, dryRun };
}

function resolveTargetCountries(countries, countryArg) {
  if (!countryArg) return countries;

  const exact = countries.find(
    (c) => c.name.toLowerCase() === countryArg.toLowerCase()
  );
  if (exact) return [exact];

  const partial = countries.filter((c) =>
    c.name.toLowerCase().includes(countryArg.toLowerCase())
  );
  if (partial.length === 1) {
    console.log(`Matched "${partial[0].name}"`);
    return partial;
  }
  if (partial.length > 1) {
    console.error(`Ambiguous match: ${partial.map((c) => c.name).join(', ')}`);
    process.exit(1);
  }

  console.error(`Country not found: "${countryArg}"`);
  process.exit(1);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY not set. Copy .env.example → .env and add your key.');
    process.exit(1);
  }

  const { countryArg, dryRun } = parseArgs();

  const countries = readJSON(COUNTRIES_FILE);
  if (!countries) {
    console.error('data/countries.json not found.');
    process.exit(1);
  }

  const puzzles = readJSON(PUZZLES_FILE, []);
  const failed = readJSON(FAILED_FILE, []);
  const hintsTemplate = readFile(HINTS_PROMPT_FILE);
  const verifyTemplate = readFile(VERIFY_PROMPT_FILE);

  const doneSet = new Set(puzzles.map((p) => p.country));
  const allTargets = resolveTargetCountries(countries, countryArg);

  // When running in bulk, skip already-done countries. When targeting a single
  // country explicitly, always regenerate it (useful for fixing bad hints).
  const toProcess = countryArg
    ? allTargets
    : allTargets.filter((c) => !doneSet.has(c.name));

  if (toProcess.length === 0) {
    console.log('Nothing to process — all countries already in puzzles.json.');
    return;
  }

  const total = countries.length;
  let doneCount = puzzles.length;

  if (dryRun) console.log('[DRY RUN — no files will be written]\n');
  console.log(`Processing ${toProcess.length} countr${toProcess.length === 1 ? 'y' : 'ies'} (${doneCount}/${total} already done)\n`);

  for (const country of toProcess) {
    const { name } = country;
    const displayNum = doneCount + 1;
    process.stdout.write(`[${displayNum}/${total}] ${name}... `);

    const hints = await processCountry(country, hintsTemplate, verifyTemplate);

    if (hints) {
      const entry = { country: name, hints };

      if (!dryRun) {
        const idx = puzzles.findIndex((p) => p.country === name);
        if (idx >= 0) puzzles[idx] = entry;
        else puzzles.push(entry);
        writeJSON(PUZZLES_FILE, puzzles);
      }

      doneCount++;
      console.log('✓');

      if (dryRun || countryArg) {
        console.log(JSON.stringify(entry, null, 2));
        console.log();
      }
    } else {
      if (!dryRun) {
        const failEntry = { country: name, timestamp: new Date().toISOString() };
        const fi = failed.findIndex((f) => f.country === name);
        if (fi >= 0) failed[fi] = failEntry;
        else failed.push(failEntry);
        writeJSON(FAILED_FILE, failed);
      }
      console.log('✗ (logged to data/failed.json)');
    }

    await sleep(BETWEEN_COUNTRY_DELAY_MS);
  }

  console.log(`\nFinished. ${doneCount} puzzles saved. ${failed.length} failed.`);
}

main().catch((err) => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
