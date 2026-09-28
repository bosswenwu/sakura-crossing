import { PLACES, ROUTES, discover, restore, guide } from './state.js';
import './style.css';

export function createJourney({ player, hud }) {
  let visited = [];
  try { visited = restore(localStorage.getItem('sakuragawa-discoveries')); } catch { /* optional storage */ }
  let route = ROUTES[0];
  let target = PLACES.find(p => p.id === route.stops.find(id => !visited.includes(id))) || PLACES[1];
  const panel = document.createElement('div');
  panel.className = 'journey-ui';
  panel.innerHTML = `<div class="walk-header"><span class="walk-brand">✿ 樱川漫游</span><span class="journey-progress"></span><button type="button" data-open-map>地图 <kbd>Tab</kbd></button></div><div class="journey-target"><span class="target-arrow">↑</span><div><small>下一站 · 直线方向</small><strong></strong></div><span class="target-distance"></span></div>
  <dialog class="journey-map" aria-labelledby="map-title"><div class="map-head"><div><small>樱川漫游 / 散步手册</small><h2 id="map-title">慢慢走，总会遇见。</h2></div><button type="button" data-close-map aria-label="收起地图">✕</button></div><div class="map-body"><div class="map-paper"><svg viewBox="-70 -165 150 250" role="img" aria-label="小镇地点示意图，北侧是学校与山道"><defs><pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#d5dde0" stroke-width=".3"/></pattern></defs><rect x="-70" y="-165" width="150" height="250" fill="url(#map-grid)"/><path d="M-60 -155Q-40 -90 5 -100T65 -160" fill="none" stroke="#bdd4b5" stroke-width="24"/><path d="M-70 -24H80" stroke="#a2cbd9" stroke-width="7"/><path d="M-70 0H80" stroke="#6c6e82" stroke-width="1.6" stroke-dasharray="2 2"/><path d="M2 70V-90M2 15H22V47H2M-28 5V24" fill="none" stroke="#fff" stroke-width="6"/><path d="M2 -90L15 -108L35 -128" fill="none" stroke="#c4b998" stroke-width="2"/><text x="-60" y="-140" class="map-label">山道</text><text x="-59" y="-28" class="map-label">用水路</text><text x="55" y="-5" class="map-label">鉄道</text>${PLACES.map(p => `<g><circle cx="${p.x}" cy="${p.z}" r="3" fill="#b14f79"/><text x="${p.x + 5}" y="${p.z + 2}" class="map-label">${p.name}</text></g>`).join('')}<circle id="map-player" r="3.5" fill="#485dab" stroke="white" stroke-width="1.5"/></svg><div class="map-legend"><span>● 你的位置</span><span>粉色标记 · 可到访地点</span></div><p>地点示意图 · 导航指向目的地，途中请沿道路行走</p></div><div class="place-list">${PLACES.map(p => `<button type="button" data-place="${p.id}" aria-label="${p.name} 设为目的地"><span class="place-stamp" data-stamp="${p.id}">○</span><span><small>${p.tag}</small><strong>${p.name}</strong><em>${p.note}</em></span><span aria-hidden="true">↗</span></button>`).join('')}</div></div></dialog>
  <dialog class="journey-help" aria-labelledby="help-title"><button type="button" data-close-help aria-label="关闭操作说明">✕</button><h2 id="help-title">轻松上路</h2><p>点击「开始漫游」后，鼠标控制视线。按 Esc 释放鼠标并暂停。</p><dl><dt>W A S D</dt><dd>向前、向左、向后、向右</dd><dt>Shift</dt><dd>加快脚步</dd><dt>E</dt><dd>与售货机、猫咪互动；上下电动车</dd><dt>V</dt><dd>召唤或收起电动车</dd><dt>Tab</dt><dd>打开游览地图，选择目的地</dd><dt>P</dt><dd>从太空看看整颗小星球</dd><dt>M</dt><dd>开启 / 关闭音乐</dd><dt>R</dt><dd>回到最初的踏切</dd></dl><p class="touch-note">漫游需要键盘与鼠标，请在电脑上体验。</p></dialog>`;
  hud.root.append(panel);
  const map = panel.querySelector('.journey-map');
  const help = panel.querySelector('.journey-help');
  const arrow = panel.querySelector('.target-arrow');
  const name = panel.querySelector('.journey-target strong');
  const distance = panel.querySelector('.target-distance');
  const progress = panel.querySelector('.journey-progress');
  const routeOptions = hud.overlay.querySelector('.route-options');
  routeOptions.innerHTML = ROUTES.map((r, i) => `<button class="route-option ${i === 0 ? 'selected' : ''}" type="button" data-route="${i}" aria-pressed="${i === 0}"><span class="route-symbol">${['↝', '♧', '△'][i]}</span><span><strong>${r.name}</strong><small>${r.sub}</small></span><span class="route-time">${r.time}</span></button>`).join('');
  const open = dialog => {
    if (player.locked) document.exitPointerLock();
    if (!dialog.open) dialog.showModal();
  };
  for (const root of [hud.overlay, panel]) root.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.matches('.menu-action')) return;
    e.stopPropagation();
    if (button.hasAttribute('data-open-map')) open(map);
    if (button.hasAttribute('data-close-map')) map.close();
    if (button.hasAttribute('data-open-help')) open(help);
    if (button.hasAttribute('data-close-help')) help.close();
    if (button.dataset.place) {
      target = PLACES.find(p => p.id === button.dataset.place);
      route = null;
      map.querySelectorAll('[data-place]').forEach(b => b.classList.toggle('selected', b === button));
      update(0);
      hud.flash(`已选择 ${target.name} · 收起地图后继续漫游`, 2200);
    }
    if (button.dataset.route !== undefined) {
      route = ROUTES[Number(button.dataset.route)];
      target = PLACES.find(p => p.id === (route.stops.find(id => !visited.includes(id)) || route.stops.at(-1)));
      routeOptions.querySelectorAll('button').forEach(b => { const selected = b === button; b.classList.toggle('selected', selected); b.setAttribute('aria-pressed', String(selected)); });
      update(0);
    }
  }, true);
  window.addEventListener('keydown', e => {
    if (e.code !== 'Tab' || e.repeat) return;
    // Preserve normal keyboard focus traversal within dialogs and the menu.
    if (!player.locked) return;
    e.preventDefault(); open(map);
  });
  const originalSetLocked = hud.setLocked.bind(hud);
  hud.setLocked = locked => { originalSetLocked(locked); panel.classList.toggle('walking', locked); hud.root.classList.toggle('is-walking', locked); };
  let accumulator = 0;
  function update(dt) {
    accumulator += dt;
    if (dt && accumulator < 0.2) return;
    accumulator = 0;
    const next = discover(player.pos, visited);
    if (next.length !== visited.length) {
      const additions = next.filter(id => !visited.includes(id));
      visited = next;
      try { localStorage.setItem('sakuragawa-discoveries', JSON.stringify(visited)); } catch { /* memory-only mode */ }
      hud.flash(`发现 ${PLACES.find(p => p.id === additions[0]).name} · 已记入散步手册`, 2800);
      if (route && visited.includes(target.id)) {
        const pending = route.stops.find(id => !visited.includes(id));
        if (pending) target = PLACES.find(p => p.id === pending);
      }
    }
    progress.textContent = `已发现 ${visited.length} / ${PLACES.length}`;
    panel.querySelectorAll('[data-stamp]').forEach(s => { const found = visited.includes(s.dataset.stamp); s.textContent = found ? '✿' : '○'; s.classList.toggle('found', found); });
    const info = guide(player.pos, player.yaw, target);
    name.textContent = target.name;
    distance.textContent = info.distance <= target.radius ? '已到达' : `${info.distance} m`;
    arrow.style.transform = `rotate(${info.bearing}rad)`;
    panel.querySelector('#map-player').setAttribute('cx', player.pos.x);
    panel.querySelector('#map-player').setAttribute('cy', player.pos.z);
  }
  update(0);
  return { update };
}
