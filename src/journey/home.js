export const HOME = `
  <header class="town-header"><a class="town-brand" href="./" aria-label="樱川漫游首页"><span class="flower">✿</span><span>樱川漫游<small>さくらの散歩</small></span></a><span class="season">四月 · 樱花正好</span></header>
  <section class="menu-panel" aria-labelledby="menu-title">
    <div class="menu-copy">
      <p class="arrival start-only">给自己一段没有安排的春天。</p><p class="arrival pause-only">小镇还在这里，等你继续。</p>
      <h1 id="menu-title">去小镇，<br>把时间走慢。</h1>
      <p class="menu-description">穿过樱花下的踏切，拐进熟悉又陌生的街巷。<br>没有倒计时，下一站由你决定。</p>
      <button class="menu-action" type="button"><span class="start-only">开始漫游</span><span class="pause-only">继续漫游</span><span aria-hidden="true">↗</span></button>
      <p class="entry-note">电脑体验 · 鼠标转向 · Esc 暂停</p>
      <div class="home-links"><button type="button" data-open-map>打开游览地图</button><button type="button" data-open-help>查看操作说明</button></div>
      <label class="audio-control"><span class="audio-head"><span>小镇音乐</span><output for="music-volume">34%</output></span><input id="music-volume" class="volume-slider" type="range" min="0" max="100" step="1" value="34" aria-label="音乐音量" /></label>
    </div>
    <aside class="route-ticket"><div class="ticket-heading"><span>今日散步手册</span><span aria-hidden="true">✿</span></div><h2>从一条喜欢的路开始</h2><div class="route-options"></div><p class="ticket-note">到访地点自动记入手册，下次回来还能接着走。</p></aside>
  </section>
  <footer class="town-footer"><span>一个可以走进去的春日故事</span><span>基于 Sakura Crossing · MIT</span></footer>`;
