#!/usr/bin/env node

// Parses Vite build output from stdin and prints a bundle size report.
// Usage: npm run build 2>&1 | node scripts/bundle-size.mjs

const input = await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
});

// Match lines like: "public/build/assets/FILENAME.js  SIZE.XX kB │ gzip: SIZE.XX kB"
const pattern = /assets\/(.+?)\.([a-z]+)\s+(\d+[\.,]\d+)\s+(kB|MB)\s+.+?gzip:.+?(\d+[\.,]\d+)\s+(kB|MB)/g;

const matches = [...input.matchAll(pattern)];

if (matches.length === 0) {
    console.log('No bundle assets found in build output.');
    process.exit(0);
}

const total = { raw: 0, gzip: 0 };

const rows = matches.map((m) => {
    const raw = parseFloat(m[3].replace(',', '.')) * (m[4] === 'MB' ? 1024 : 1);
    const gzip = parseFloat(m[5].replace(',', '.')) * (m[6] === 'MB' ? 1024 : 1);
    total.raw += raw;
    total.gzip += gzip;
    const label = m[1].length > 48 ? m[1].slice(0, 45) + '...' : m[1];
    return { label, raw, gzip };
});

rows.sort((a, b) => b.raw - a.raw);

const top = rows.slice(0, 30);
const other = { raw: 0, gzip: 0 };
rows.slice(30).forEach((r) => {
    other.raw += r.raw;
    other.gzip += r.gzip;
});

console.log('\n=== Bundle Size Report ===');

// Header
console.log('Chunk'.padEnd(48) + 'Raw'.padStart(10) + 'Gzip'.padStart(10));
console.log('─'.repeat(68));

// Top chunks
top.forEach((r) => {
    console.log(
        r.label.padEnd(48) +
            r.raw.toFixed(1).padStart(8) + ' kB' +
            r.gzip.toFixed(1).padStart(8) + ' kB'
    );
});

// Remaining chunks summary
if (other.raw > 0) {
    const label = `other (${rows.length - 30} chunks)`;
    console.log('─'.repeat(68));
    console.log(
        label.padEnd(48) +
            other.raw.toFixed(1).padStart(8) + ' kB' +
            other.gzip.toFixed(1).padStart(8) + ' kB'
    );
}

// Grand total
console.log('─'.repeat(68));
console.log(
    'TOTAL'.padEnd(48) +
        total.raw.toFixed(1).padStart(8) + ' kB' +
        total.gzip.toFixed(1).padStart(8) + ' kB'
);
console.log(`Chunks: ${matches.length}`);

// Build time
const buildTime = input.match(/built in ([\d\.]+)s/);
if (buildTime) console.log(`Build time: ${buildTime[1]}s`);
