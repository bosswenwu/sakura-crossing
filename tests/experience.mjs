import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5179/');
  await page.waitForLoadState('networkidle', { timeout: 120000 });
  console.log('Buttons:', await page.getByRole('button').allTextContents());
  await page.getByRole('button', { name: '打开游览地图', exact: true }).click({ timeout: 5000 });
  await page.getByRole('button', { name: /图书馆.*设为目的地/ }).click();
  assert.match(await page.locator('.journey-target').textContent(), /图书馆/);
  await page.getByRole('button', { name: '收起地图', exact: true }).click();
  assert.equal(await page.locator('.journey-map').isVisible(), false);
  await page.screenshot({ path: 'experience-desktop.png' });
  // Observe a real walk arrival, then verify its saved progress survives reload.
  await page.evaluate(() => {
    const { player } = window.__scene;
    player.pos.set(15, 0, 47);
  });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('sakuragawa-discoveries') || '[]').includes('library'));
  await page.reload();
  await page.waitForLoadState('networkidle', { timeout: 120000 });
  assert.match(await page.locator('.journey-progress').textContent(), /2\s*\/\s*6/);
  await page.getByRole('button', { name: '查看操作说明', exact: true }).click();
  assert.ok(await page.getByRole('heading', { name: '轻松上路' }).isVisible());
  await page.getByRole('button', { name: '关闭操作说明' }).click();
  await page.getByRole('button', { name: '开始漫游', exact: true }).click();
  await page.waitForFunction(() => window.__scene.player.locked);
  const before = await page.evaluate(() => window.__scene.player.pos.clone());
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1500);
  await page.keyboard.up('KeyW');
  const after = await page.evaluate(() => window.__scene.player.pos.clone());
  assert.ok(Math.hypot(after.x - before.x, after.z - before.z) > 0.1);
  await page.keyboard.press('Tab');
  assert.ok(await page.locator('.journey-map').isVisible());
  await page.getByRole('button', { name: '收起地图', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'experience-mobile.png' });
  assert.ok(await page.getByRole('button', { name: '继续漫游', exact: true }).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  console.log('Experience checks passed');
} finally { await browser.close(); }
