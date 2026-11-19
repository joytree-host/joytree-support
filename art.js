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
      '<text class="prompt" x="248" y="216">&#8250;</text><text x="260" y="216">looking into it</text><rect class="caret" x="364" y="207" width="6" height="11"/></g>';

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

/* ------------------------------------------------------------------ card art
   Line-art for the Collections cards on the home page: same construction and
   viewBox as the docs cards (white line-art on a solid green card), but with
   support scenes: an inbox getting a message, and a failing server being fixed. */
(function (root) {
  'use strict';
  var U = 22, ORIGIN = { x: 148, y: 54 }, Z0 = 0.25;
  var ICON = {
    chat: '<path d="M-7-5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-7l-4 3.4V5h-3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="-8" y="-5.5" width="16" height="11" rx="2"/><path d="M-7.5-4.5L0 1.5l7.5-6"/>',
    headset: '<path d="M-7 2v-3a7 7 0 0 1 14 0v3"/><rect x="-9" y="0.5" width="3.6" height="6" rx="1.4"/><rect x="5.4" y="0.5" width="3.6" height="6" rx="1.4"/><path d="M7 6.5q0 3.5-5.5 3.5"/>',
    wrench: '<g transform="translate(-8 -8) scale(.67)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></g>',
    buoy: '<circle r="7"/><circle r="3"/><path d="M-5-5l2.9 2.9M5-5l-2.9 2.9M-5 5l2.9-2.9M5 5l-2.9-2.9"/>',
    check: '<path d="M-5.5 .5l3.8 3.8L6-4"/>',
    warn: '<path d="M0-7.5L8 6.5h-16z"/><path d="M0-2v4.5M0 4.6v.1"/>'
  };
  var ANCHORS = [[120, 54], [152, 24], [198, 13], [238, 14], [266, 38]];

  function cardArt(scene, id) {
    var P = function (x, y, z) { return [ORIGIN.x + (x - y) * 0.866 * U, ORIGIN.y + (x + y) * 0.5 * U - z * U]; };
    var pt = function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); };
    var poly = function (arr, cls, extra) { return '<polygon class="' + cls + '" points="' + arr.map(pt).join(' ') + '"' + (extra || '') + '/>'; };
    var out = '', bi = 0;
    var box = function (x, y, z, w, d, h, dots) {
      out += poly([P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)], 'a-r');
      out += poly([P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)], 'a-l');
      out += poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], 'a-t', dots ? ' style="fill:url(#' + id + '-d)"' : '');
    };
    var thin = function (x0, y0, x1, y1, z) { out += '<path class="a-ln" d="M' + pt(P(x0, y0, z)) + ' L' + pt(P(x1, y1, z)) + '"/>'; };
    var bar = function (x0, y0, x1, y1, z) { out += '<path class="a-bar" pathLength="1" style="animation-delay:' + (bi++ * 0.45).toFixed(2) + 's" d="M' + pt(P(x0, y0, z)) + ' L' + pt(P(x1, y1, z)) + '"/>'; };
    var grp = function (cls, style, fn) { out += '<g class="' + cls + '" style="' + style + '">'; fn(); out += '</g>'; };
    var dash = function (a, b) { out += '<path class="a-ln a-dash" d="M' + pt(a) + ' L' + pt(b) + '"/>'; };
    var led = function (x, y, z, n) { var c = P(x, y, z); out += '<circle class="a-led" cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="1.5" style="animation-delay:-' + ((n * 0.37) % 2.4).toFixed(2) + 's"/>'; };
    var chip = function (name, k, amp) {
      var c = ANCHORS[k];
      out += '<g transform="translate(' + c[0] + ' ' + c[1] + ')"><g class="a-float" style="--amp:' + (amp || -4) + 'px;--dur:' + (3.4 + (k % 3) * 0.5).toFixed(1) + 's;animation-delay:-' + (k * 0.8).toFixed(1) + 's">' +
        '<circle class="a-chip-bg" r="12"/><g class="a-chip-ic">' + ICON[name] + '</g></g></g>';
    };

    box(0, 0, 0, 6, 4.6, Z0, true); /* dotted base slab */

    if (scene === 'contact') {
      /* a message being written on a card, an envelope lifting off it */
      box(0.8, 0.7, Z0, 3.4, 2.6, 0.16);
      bar(1.3, 1.4, 3.5, 1.4, Z0 + 0.16); bar(1.3, 2.0, 3.0, 2.0, Z0 + 0.16); bar(1.3, 2.6, 3.6, 2.6, Z0 + 0.16);
      dash(P(5.1, 2.0, Z0 + 0.15), P(5.1, 2.0, Z0 + 0.75));
      grp('a-float', '--amp:-7px;--dur:3.6s', function () {
        box(4.3, 1.45, Z0 + 0.75, 1.6, 1.1, 0.18);
        var z = Z0 + 0.93;
        thin(4.3, 1.45, 5.1, 2.0, z); thin(5.9, 1.45, 5.1, 2.0, z);
      });
      grp('a-pulse', '--dur:3.2s', function () { box(4.8, 3.3, Z0, 0.8, 0.8, 0.5); });
      led(4.8 + 0.28, 3.3 + 0.8, Z0 + 0.25, 1);
      chip('chat', 1); chip('mail', 2, -5); chip('headset', 0, -3);
    } else {
      /* a failing server, a log being read, the fix landing */
      box(0.7, 0.8, Z0, 1.7, 1.4, 0.5);
      led(0.7 + 0.3, 0.8 + 1.4, Z0 + 0.25, 0); thin(0.7 + 0.65, 0.8 + 1.4, 0.7 + 1.45, 0.8 + 1.4, Z0 + 0.25);
      box(0.7, 0.8, Z0 + 0.6, 1.7, 1.4, 0.5);
      out += '<g class="a-blink">';
      led(0.7 + 0.3, 0.8 + 1.4, Z0 + 0.85, 1);
      out += '</g>';
      thin(0.7 + 0.65, 0.8 + 1.4, 0.7 + 1.45, 0.8 + 1.4, Z0 + 0.85);
      box(3.1, 0.9, Z0, 2.6, 2.3, 0.14);
      bar(3.55, 1.5, 5.2, 1.5, Z0 + 0.14); bar(3.55, 2.05, 4.7, 2.05, Z0 + 0.14); bar(3.55, 2.6, 5.0, 2.6, Z0 + 0.14);
      dash(P(2.4, 1.5, Z0 + 0.25), P(3.1, 1.9, Z0 + 0.1));
      grp('a-float', '--amp:-6px;--dur:3.4s', function () { box(4.0, 3.3, Z0 + 0.55, 0.8, 0.8, 0.4); });
      dash(P(4.4, 3.7, Z0 + 0.15), P(4.4, 3.7, Z0 + 0.55));
      chip('warn', 0, -3); chip('wrench', 1); chip('buoy', 2, -5); chip('check', 3);
    }
    return '<svg class="card-art" viewBox="0 0 280 176" preserveAspectRatio="xMaxYMax meet" aria-hidden="true"><defs><pattern id="' + id + '-d" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.9" class="a-dot"/></pattern></defs>' + out + '</svg>';
  }
  root.SupportArt = { card: cardArt };
})(window);
