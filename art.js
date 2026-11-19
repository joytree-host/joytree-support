/* JOYTREE support: animated isometric hero art.
   A help desk in the same line-art language as the docs, but the subject is support:
   a message comes in, a ticket stack on the desk gets picked up and worked, and it leaves
   as resolved. Pills cycle ticket in > diagnosing > resolved. No gradients; motion is
   transform / opacity / dash only and is switched off by prefers-reduced-motion in CSS. */
(function () {
  'use strict';
  var S = 30, OX = 190, OY = 64, uid = 0;

  function P(x, y, z) { return [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - z * S]; }
  function pts(a) { return a.map(function (p) { var q = P(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); }
  function box(x, y, z, w, d, h, hot) {
    var c = hot ? ' hot' : '';
    return '<polygon class="a-left' + c + '" points="' + pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]) + '"/>' +
      '<polygon class="a-right' + c + '" points="' + pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]) + '"/>' +
      '<polygon class="a-top' + c + '" points="' + pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]) + '"/>';
  }
  function face(x, y, z, w, d, h, hot, n) {
    var a = P(x + 0.55, y + d, z + h / 2), b = P(x + w * 0.78, y + d, z + h / 2), l = P(x + 0.26, y + d, z + h / 2);
    return '<line class="a-slot" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>' +
      '<circle class="a-led' + (hot ? ' hot' : '') + '" style="animation-delay:-' + (n * 0.7).toFixed(1) + 's" cx="' + l[0].toFixed(1) + '" cy="' + l[1].toFixed(1) + '" r="1.7"/>';
  }
  function card(x, y, z, w, d, hot, n) {
    var h = 0.28;
    return box(x, y, z, w, d, h, hot) + face(x, y, z, w, d, h, hot, n);
  }
  function node(cx, cy, cls, icon, i) {
    return '<g transform="translate(' + cx + ' ' + cy + ')"><g class="a-float" style="--amp:-4px;--dur:' + (3.4 + (i % 3) * 0.5).toFixed(1) + 's;animation-delay:-' + (i * 0.9).toFixed(1) + 's">' +
      '<g class="a-node ' + cls + '"><circle class="ring" r="17"/><circle class="core" r="17"/>' + icon + '</g></g></g>';
  }
  function pill(cls, x, y, w, label) {
    return '<g class="a-pill ' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="22" rx="11"/>' +
      '<circle cx="' + (x + 13) + '" cy="' + (y + 11) + '" r="3"/><text x="' + (x + 23) + '" y="' + (y + 14.5) + '">' + label + '</text></g>';
  }
  function pkt(path, dur, begin) {
    return '<circle class="a-pkt" r="2.8"><animateMotion dur="' + dur + 's" begin="-' + begin + 's" repeatCount="indefinite" path="' + path + '"/></circle>';
  }

  var ICON = {
    chat: '<path d="M-8-6h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8.5l-4.5 4v-4h-1a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"/><path d="M-4-1h8" />',
    headset: '<path d="M-8 3v-3a8 8 0 0 1 16 0v3"/><rect x="-10" y="1" width="4" height="7" rx="1.5"/><rect x="6" y="1" width="4" height="7" rx="1.5"/><path d="M8 8q0 4-6 4"/>',
    buoy: '<circle r="8"/><circle r="3.4"/><path d="M-5.7-5.7l3.3 3.3M5.7-5.7l-3.3 3.3M-5.7 5.7l3.3-3.3M5.7 5.7l-3.3-3.3"/>',
    check: '<path d="M-6 0.5l4.2 4.2L6.5-4.5"/>',
    wrench: '<g transform="translate(-9 -9) scale(.75)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></g>'
  };

  function build() {
    var id = 'sd' + (++uid), o = '';
    o += '<svg viewBox="0 0 380 236" width="100%" fill="none" role="presentation" focusable="false">';
    o += '<defs><pattern id="' + id + '" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" class="a-dot"/></pattern></defs>';

    /* desk slab */
    o += '<g class="a-base">' + box(0, 0, -0.3, 4, 4, 0.3, false) + '</g>';
    o += '<polygon class="a-dots" style="fill:url(#' + id + ')" points="' + pts([[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0]]) + '"/>';

    /* flows (behind the stacks) */
    var fIn = 'M66 92C96 100 124 111 148 121', fHead = 'M156 40C164 58 176 72 186 82',
      fOut = 'M226 98C262 94 296 97 320 100', fDone = 'M338 83L340 60', fTool = 'M78 172C96 166 112 160 124 154';
    [fIn, fHead, fOut, fDone, fTool].forEach(function (d) { o += '<path class="a-flow" d="' + d + '"/>'; });

    /* the queue: single tickets either side, a stack of three in the middle */
    o += card(0.15, 2.95, 0, 0.85, 0.85, false, 1) + card(0.15, 2.95, 0.4, 0.85, 0.85, false, 2);
    o += card(1, 1, 0, 2, 2, false, 3) + card(1, 1, 0.4, 2, 2, false, 4);
    o += card(3, 0.25, 0, 0.85, 0.85, false, 5);
    /* the ticket being worked: lifted off the stack, ghost where it was */
    o += '<polygon class="a-ghost" points="' + pts([[1, 1, 1.08], [3, 1, 1.08], [3, 3, 1.08], [1, 3, 1.08]]) + '"/>';
    var c = P(2, 2, 1.08 + 0.28);
    var tick = 'M' + (c[0] - 18).toFixed(1) + ' ' + (c[1] - 2).toFixed(1) + 'L' + (c[0] - 7).toFixed(1) + ' ' + (c[1] + 6).toFixed(1) + 'L' + (c[0] + 18).toFixed(1) + ' ' + (c[1] - 10).toFixed(1);
    o += '<g class="a-float" style="--amp:-8px;--dur:3.6s">' + card(1, 1, 0.8, 2, 2, true, 0) + '<path class="a-tick" d="' + tick + '"/></g>';

    /* nodes */
    o += node(48, 80, 'warm', ICON.chat, 0) + node(150, 24, 'calm', ICON.headset, 1) + node(338, 100, 'calm', ICON.buoy, 2) +
      node(340, 42, 'ok', ICON.check, 3) + node(62, 180, 'calm', ICON.wrench, 4);

    /* packets travelling the flows */
    o += pkt(fIn, 2.8, 0) + pkt(fHead, 3.2, 1) + pkt(fOut, 2.6, 0.6) + pkt(fDone, 1.6, 0.3) + pkt(fTool, 3, 1.4);

    /* status pills: ticket in > diagnosing > resolved */
    o += pill('pl1', 4, 110, 88, 'ticket in') + pill('pl2', 182, 12, 98, 'diagnosing') + pill('pl3 ok', 292, 134, 86, 'resolved');

    /* reply card */
    o += '<g class="a-term"><rect x="236" y="198" width="138" height="28" rx="7"/>' +
      '<text class="prompt" x="248" y="216">&#8250;</text><text x="260" y="216">looking into it</text><rect class="caret" x="356" y="207" width="6" height="11"/></g>';

    /* sparkles */
    o += '<g class="a-spark"><path d="M112 40h8M116 36v8M268 56h8M272 52v8M30 140h8M34 136v8M300 196h8M304 192v8"/></g>';
    return o + '</svg>';
  }

  function mount() {
    var hosts = document.querySelectorAll('.home-hero, .page-hero');
    for (var i = 0; i < hosts.length; i++) {
      if (hosts[i].querySelector('.hero-art')) continue;
      var d = document.createElement('div');
      d.className = 'hero-art';
      d.setAttribute('aria-hidden', 'true');
      d.innerHTML = build();
      hosts[i].appendChild(d);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
