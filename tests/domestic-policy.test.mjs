import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  domesticEnabledModules,
  domesticExcludedModules,
  domesticExternalHosts,
  domesticPublicRoutes,
} from "../data/domesticPolicy.mjs";

assert.deepEqual(domesticPublicRoutes, [
  "/",
  "/cases",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/promo",
]);

for (const route of ["/signal", "/knowledge", "/docs", "/skills", "/log", "/login", "/admin"]) {
  assert.ok(!domesticPublicRoutes.includes(route), `${route} must not ship in the domestic build`);
}

for (const moduleName of [
  "public-generative-ai",
  "algorithmic-recommendation",
  "signal-news-aggregation",
  "searchable-knowledge-base",
  "user-accounts",
  "comments",
  "newsletter",
  "admin-console",
  "external-oauth",
  "payments",
  "direct-product-entry",
]) {
  assert.ok(domesticExcludedModules.includes(moduleName), `${moduleName} must be explicitly excluded`);
}

assert.ok(domesticEnabledModules.includes("cases"));
assert.deepEqual(domesticExternalHosts, ["beian.miit.gov.cn"]);

const nuxtConfig = readFileSync("nuxt.config.ts", "utf8");
assert.match(nuxtConfig, /pages:extend/);
assert.match(nuxtConfig, /domesticPublicRoutes/);
assert.doesNotMatch(nuxtConfig, /fonts\.googleapis\.com/);
assert.doesNotMatch(nuxtConfig, /cdnjs\.cloudflare\.com/);

const appSource = readFileSync("app.vue", "utf8");
assert.doesNotMatch(appSource, /unpkg\.com/);

const privacySource = readFileSync("pages/privacy.vue", "utf8");
const termsSource = readFileSync("pages/terms.vue", "utf8");
const contactSource = readFileSync("pages/contact.vue", "utf8");

for (const source of [privacySource, termsSource]) {
  assert.match(source, /不提供用户注册、评论、订阅、支付、公开生成式 AI、算法推荐/);
  assert.doesNotMatch(source, /<SiteHeader/);
  assert.doesNotMatch(source, /<SiteFooter/);
}

assert.doesNotMatch(contactSource, /<SiteHeader/);
assert.doesNotMatch(contactSource, /<SiteFooter/);
