import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  domesticBusinessLines,
  domesticCta,
  domesticHeroMetrics,
  domesticHomeHero,
  domesticProofAssets,
  domesticValueCards,
  domesticWorkSteps,
} from '../data/domesticHome.mjs';

assert.equal(domesticHomeHero.label, 'AI SYSTEM ARCHITECTURE STUDIO');
assert.equal(domesticHomeHero.title, '简序智能 INTJsys');
assert.equal(domesticHomeHero.primaryCta.href, '/contact');
assert.equal(domesticHomeHero.secondaryCta.href, '#business-lines');

assert.equal(domesticHeroMetrics.length, 4);
assert.deepEqual(
  domesticHeroMetrics.map((metric) => metric.label),
  ['Agent 架构', '私有云/下云', 'AI 转型', '国内交付'],
);

assert.equal(domesticValueCards.length, 5);
assert.deepEqual(
  domesticValueCards.map((card) => card.id),
  ['cloud-exit-case', 'private-ai-case', 'diagnosis', 'agent-infra', 'delivery'],
);

assert.equal(domesticBusinessLines.length, 3);
assert.deepEqual(
  domesticBusinessLines.map((line) => line.slug),
  ['agent-efficiency-architecture', 'cloud-infrastructure-configuration', 'intelligent-transformation-strategy'],
);
assert.ok(domesticBusinessLines.every((line) => line.link === '/contact'));

assert.equal(domesticWorkSteps.length, 3);
assert.deepEqual(
  domesticWorkSteps.map((step) => step.num),
  ['01', '02', '03'],
);

assert.equal(domesticProofAssets.length, 4);
assert.equal(domesticCta.primary.href, '/contact');
assert.equal(domesticCta.secondary.href, '/about');

const collectFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(fullPath);
    return fullPath;
  });
};

const displaySourceFiles = [
  ...collectFiles('components').filter((file) => file.endsWith('.vue')),
  ...collectFiles('pages').filter((file) => file.endsWith('.vue')),
  ...collectFiles('data').filter((file) => file.endsWith('.mjs')),
];

for (const file of displaySourceFiles) {
  const source = readFileSync(file, 'utf8');
  assert.doesNotMatch(source, /https:\/\/talentai\.intjsys\.com/, `${file} should not link to TalentAI service`);
  assert.doesNotMatch(source, /https:\/\/mbti\.intjsys\.com/, `${file} should not link to MindAI service`);
}

const headerSource = readFileSync('components/SiteHeader.vue', 'utf8');
const homeSource = readFileSync('pages/index.vue', 'utf8');
const promoSource = readFileSync('pages/promo.vue', 'utf8');
const nuxtConfigSource = readFileSync('nuxt.config.ts', 'utf8');

assert.ok(existsSync('public/site-logo.svg'), 'domestic site should carry the international logo SVG asset');
assert.ok(existsSync('public/site-logo.png'), 'domestic site should carry the international logo PNG asset');
assert.match(headerSource, /src="\/site-logo\.svg"/, 'header should use the international logo SVG');
assert.match(
  nuxtConfigSource,
  /href: "\/site-logo\.svg\?v=\d+"/,
  'favicon should use the versioned international logo SVG',
);
assert.match(
  nuxtConfigSource,
  /rel: "apple-touch-icon",\s+href: "\/site-logo\.png\?v=\d+"/,
  'apple touch icon should use the versioned international logo PNG',
);
assert.doesNotMatch(headerSource, />INTJ</, 'header should not use a handcrafted INTJ text logo');
assert.match(
  headerSource,
  /max-height: calc\(100dvh - 88px\)/,
  'mobile menu should stay inside the visible phone viewport',
);
assert.match(headerSource, /overflow-y: auto/, 'mobile menu should scroll when the viewport is short');

for (const label of ['首页', '案例库', '交付能力', '行业场景', '关于', '联系']) {
  assert.match(headerSource, new RegExp(label), `header should include ${label}`);
}

for (const target of ['/', '/cases', '#delivery', '#industries', '/about', '/contact']) {
  assert.match(headerSource, new RegExp(target), `header should link to ${target}`);
}

for (const outdated of ['AI 资讯', '知识库', '登录', 'LOGIN', 'href="/docs"', 'TALENTAI', 'MINDAI']) {
  assert.doesNotMatch(headerSource, new RegExp(outdated), `header should remove outdated nav item ${outdated}`);
}

for (const sectionId of ['id="delivery"', 'id="industries"']) {
  assert.match(homeSource, new RegExp(sectionId), `home page should expose ${sectionId} for nav`);
}

for (const visualClass of ['hero-shell', 'blueprint', 'phase-grid', 'standard-list', 'proof-grid', 'foundation']) {
  assert.match(homeSource, new RegExp(visualClass), `home page should include visual layer ${visualClass}`);
}

assert.match(homeSource, /CN · DISPLAY EDITION/, 'home page should identify the domestic display edition');
assert.match(homeSource, /不直连产品后台/, 'home page should state the domestic product-link boundary');
assert.match(homeSource, /国内站仅承担品牌展示与商务咨询/, 'home page should state its public scope');
assert.match(homeSource, /@media \(max-width: 680px\)/, 'home page should include a mobile breakpoint');

assert.match(promoSource, /src="\/intjsys-website-qr\.png"/, 'promo page should use the official website QR code');
assert.match(promoSource, /max-width: 430px/, 'promo page should be constrained for mobile viewing');
assert.match(promoSource, /\.qr-image\s*\{[\s\S]*?width: 128px/, 'promo QR code should stay compact');
assert.match(promoSource, /https:\/\/intjsys\.com\//, 'promo page should point to the official website');
