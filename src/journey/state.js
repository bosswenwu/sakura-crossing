export const PLACES = [
  { id: 'crossing', name: '樱花踏切', jp: '桜踏切', x: 1.85, z: 8, radius: 9, note: '等一班列车，听铃声掠过春天。', tag: '铁道 / 起点' },
  { id: 'shops', name: '春日商店街', jp: '商店街', x: 22.2, z: 29, radius: 10, note: '拉面店、花铺与尚未收起的灯笼。', tag: '街巷 / 日常' },
  { id: 'library', name: '街角图书馆', jp: 'ひばり台図書館', x: 15, z: 47, radius: 7, note: '在安静的窗前，给散步留一页空白。', tag: '街角 / 休憩' },
  { id: 'shrine', name: '樱守神社', jp: '桜守神社', x: -27.9, z: 18, radius: 7, note: '沿铁道向西，走进两栋房屋之间的石巷。', tag: '石巷 / 神社' },
  { id: 'canal', name: '小鸠桥河岸', jp: 'こばと橋', x: 0, z: -24, radius: 9, note: '过了踏切，沿着水渠慢慢走。', tag: '河岸 / 散步' },
  { id: 'hill', name: '山间展望台', jp: '桜守台', x: 34.5, z: -128.2, radius: 10, note: '沿学校后方的山路登高，回望整座小镇。', tag: '山道 / 远眺' },
];
export const ROUTES = [
  { name: '第一次来小镇', sub: '从踏切出发，认识街角的日常。', time: '约 4 分钟', stops: ['crossing', 'shops', 'library'] },
  { name: '听风的散步', sub: '穿过石巷，再去河岸听一会儿风。', time: '约 6 分钟', stops: ['crossing', 'shrine', 'canal'] },
  { name: '向山里去', sub: '召唤电动车，从河岸一路到山脚。', time: '约 10 分钟', stops: ['canal', 'hill'] },
];
export function discover(pos, visited, places = PLACES) {
  return [...new Set([...visited, ...places.filter(p => Math.hypot(p.x - pos.x, p.z - pos.z) <= p.radius).map(p => p.id)])];
}
export function restore(raw) {
  try {
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? [...new Set(saved.filter(id => PLACES.some(p => p.id === id)))] : [];
  } catch { return []; }
}
export function guide(pos, yaw, target) {
  return { distance: Math.round(Math.hypot(target.x - pos.x, target.z - pos.z)), bearing: Math.atan2(target.x - pos.x, pos.z - target.z) + yaw };
}
