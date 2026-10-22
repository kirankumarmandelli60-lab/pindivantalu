import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const inputPath = resolve('data/research/indian-regional-sweets.json');
const outputPath = resolve(process.env.OUTPUT_PATH || 'data/research/image-candidates.json');
const userAgent = 'PindivantaluImageResearch/1.0 (regional food heritage catalogue; contact repository maintainer)';
const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

function parseLicense(metadata = {}) {
  const value = (key) => metadata[key]?.value?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  return {
    licenseShortName: value('LicenseShortName'),
    licenseUrl: value('LicenseUrl'),
    artist: value('Artist'),
    attributionRequired: value('AttributionRequired'),
    credit: value('Credit'),
    usageTerms: value('UsageTerms'),
    imageDescription: value('ImageDescription'),
  };
}

async function findCandidates(name, region) {
  const query = '"' + name + '" ' + region + ' Indian sweet food';
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '4',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '640',
    format: 'json',
    origin: '*',
  }).toString();

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': userAgent, Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error('Wikimedia Commons returned HTTP ' + response.status);
    const body = await response.json();
    const pages = Object.values(body.query?.pages || {});
    return pages.map((page) => {
      const info = page.imageinfo?.[0] || {};
      const metadata = parseLicense(info.extmetadata);
      return {
        title: page.title || '',
        pageUrl: info.descriptionurl || ('https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title || '')),
        thumbnailUrl: info.thumburl || '',
        originalUrl: info.url || '',
        mime: info.mime || '',
        width: info.width || null,
        height: info.height || null,
        ...metadata,
        candidateScore: scoreCandidate(page.title || '', name, region, metadata),
        reviewStatus: 'needs-human-review',
      };
    }).sort((a, b) => b.candidateScore - a.candidateScore);
  } catch (error) {
    return [{ error: error instanceof Error ? error.message : String(error), reviewStatus: 'lookup-failed' }];
  }
}

function scoreCandidate(title, name, region, metadata) {
  const t = title.toLowerCase();
  const n = name.toLowerCase();
  const r = region.toLowerCase();
  let score = 0;
  if (t.includes(n)) score += 5;
  if (t.includes(r)) score += 2;
  if (/\.(jpe?g|png|webp)$/i.test(title)) score += 1;
  if (metadata.licenseShortName) score += 1;
  if (metadata.artist) score += 1;
  if (/logo|map|flag|poster|menu|collage|diagram/i.test(title)) score -= 5;
  return score;
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const catalog = JSON.parse(await readFile(inputPath, 'utf8'));
const tasks = [];
for (const region of catalog.regions || []) {
  for (const sweet of region.sweets || []) {
    const name = Array.isArray(sweet) ? sweet[0] : sweet.name;
    const alternateNames = Array.isArray(sweet) ? (sweet[1] || []) : (sweet.alternateNames || []);
    const notes = Array.isArray(sweet) ? (sweet[2] || '') : (sweet.notes || '');
    tasks.push({ name, alternateNames, region: region.state, notes });
  }
}

const results = [];
let index = 0;
const concurrency = 3;
async function worker() {
  while (index < tasks.length) {
    const current = tasks[index++];
    const allQueries = [current.name, ...current.alternateNames].slice(0, 2);
    let candidates = [];
    for (const queryName of allQueries) {
      const found = await findCandidates(queryName, current.region);
      candidates.push(...found);
      if (candidates.some((item) => item.thumbnailUrl && item.candidateScore >= 6)) break;
      await delay(350);
    }
    const unique = new Map();
    for (const candidate of candidates) {
      const key = candidate.pageUrl || candidate.title || candidate.error;
      if (key && !unique.has(key)) unique.set(key, candidate);
    }
    results.push({
      id: slugify(current.region) + '-' + slugify(current.name),
      name: current.name,
      alternateNames: current.alternateNames,
      region: current.region,
      notes: current.notes,
      imageCandidates: [...unique.values()].slice(0, 5),
      imageStatus: [...unique.values()].some((item) => item.thumbnailUrl) ? 'candidate-found-review-required' : 'no-candidate-found',
    });
    await delay(250);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
results.sort((a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name));
const output = {
  generatedAt: new Date().toISOString(),
  sourceCatalogue: 'data/research/indian-regional-sweets.json',
  sourceService: 'Wikimedia Commons API',
  totalSweets: results.length,
  note: 'These are search candidates, not automatically approved images. Verify the exact dish, license, attribution, image quality, and permitted reuse before publishing.',
  results,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Processed ' + results.length + ' sweet entries. Wrote ' + outputPath + '.');
console.log('Entries with at least one image candidate: ' + results.filter((item) => item.imageStatus === 'candidate-found-review-required').length);
