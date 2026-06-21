/* ==========================================================================
   AXIOBYTE® — THANK YOU PAGE — External JS
   ========================================================================== */

(function () {
  'use strict';

  /* =========================================================================
     1. CUSTOM CURSOR (dark dot on light background)
     ========================================================================= */
  var dot     = document.querySelector('.ty-cursor-dot');
  var outline = document.querySelector('.ty-cursor-outline');

  if (dot && outline) {
    var mouseX = 0, mouseY = 0;
    var outX   = 0, outY   = 0;
    var active = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';

      if (!active) {
        dot.style.opacity     = '1';
        outline.style.opacity = '1';
        active = true;
      }
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity     = '0';
      outline.style.opacity = '0';
      active = false;
    });

    // Smooth outline follow with inertia
    (function animateOutline() {
      outX += (mouseX - outX) * 0.13;
      outY += (mouseY - outY) * 0.13;
      outline.style.left = outX + 'px';
      outline.style.top  = outY + 'px';
      requestAnimationFrame(animateOutline);
    })();

    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        outline.classList.add('is-hover');
        dot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', function () {
        outline.classList.remove('is-hover');
        dot.style.opacity = '1';
      });
    });

    document.addEventListener('mousedown', function () { outline.classList.add('is-click'); });
    document.addEventListener('mouseup',   function () { outline.classList.remove('is-click'); });
  }

  /* =========================================================================
     2. STAGGERED ENTRANCE ANIMATIONS
     ========================================================================= */
  function animateIn() {
    var sequence = [
      { sel: '.ty-label',          delay: 80,  cls: 'ty-revealed'       },
      { sel: '.ty-message',        delay: 200, cls: 'ty-revealed'       },
      { sel: '.ty-sep',            delay: 340, cls: 'ty-revealed-sep'   },
      { sel: '.ty-meta-row',       delay: 420, cls: 'ty-revealed'       },
      { sel: '.ty-phone-wrapper',  delay: 300, cls: 'ty-revealed-phone' },
    ];

    // Display lines — each staggered
    var lines = document.querySelectorAll('.ty-display-line');
    lines.forEach(function (line, i) {
      sequence.push({ el: line, delay: 540 + i * 90, cls: 'ty-revealed-line' });
    });

    // Tagline last
    sequence.push({ sel: '.ty-tagline', delay: 740, cls: 'ty-revealed' });

    sequence.forEach(function (item) {
      var el = item.el || (item.sel ? document.querySelector(item.sel) : null);
      if (!el) return;

      setTimeout(function () {
        el.classList.add(item.cls);

        // After the phone entrance animation finishes, switch to continuous float.
        // We lock opacity:1 + base transform via inline style BEFORE removing the
        // entrance class — otherwise the element flashes back to opacity:0 (CSS default)
        // for the one frame between class removal and the float animation starting.
        if (item.cls === 'ty-revealed-phone') {
          setTimeout(function () {
            // 1. Pin the end-state so there's no invisible frame
            el.style.opacity   = '1';
            el.style.transform = 'rotate(-3deg) translateY(0)';

            // 2. Now safely swap the animation class
            el.classList.remove('ty-revealed-phone');
            el.classList.add('is-floating');

            // 3. Clear inline overrides after float keyframes take full control
            setTimeout(function () {
              el.style.opacity   = '';
              el.style.transform = '';
            }, 50);
          }, 1150); // just before 1.1s animation ends
        }
      }, item.delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateIn);
  } else {
    animateIn();
  }

  /* =========================================================================
     3. SUBTLE PARALLAX TILT ON PHONE (mouse move)
     ========================================================================= */
  var phoneWrapper = document.querySelector('.ty-phone-wrapper');
  var rightPanel   = document.querySelector('.ty-right');

  if (phoneWrapper && rightPanel) {
    rightPanel.addEventListener('mousemove', function (e) {
      var rect   = rightPanel.getBoundingClientRect();
      var cx     = rect.left + rect.width  / 2;
      var cy     = rect.top  + rect.height / 2;
      var dx     = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
      var dy     = (e.clientY - cy) / (rect.height / 2); // -1 to 1

      var tiltX  =  dy * 6;   // tilt up/down
      var tiltY  = -dx * 6;   // tilt left/right

      phoneWrapper.style.transition = 'transform 0.15s ease';
      phoneWrapper.style.transform  =
        'rotate(-3deg) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(0)';
    });

    rightPanel.addEventListener('mouseleave', function () {
      phoneWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      phoneWrapper.style.transform  = 'rotate(-3deg) translateY(0)';
      // Re-enable float after mouse leaves
      setTimeout(function () {
        phoneWrapper.style.transition = '';
        phoneWrapper.style.transform  = '';
      }, 650);
    });
  }

  /* =========================================================================
     4. HAMBURGER → back to homepage
     ========================================================================= */
  var hamburger = document.querySelector('.ty-hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      window.location.href = './index.html';
    });
  }

  /* =========================================================================
     5. PAGE TRANSITION ENTRANCE FADE-OUT
     ========================================================================= */
  var entranceOverlay = document.getElementById('ty-entrance-overlay');
  if (entranceOverlay) {
    setTimeout(function () {
      entranceOverlay.style.opacity = '0';
      setTimeout(function () {
        if (entranceOverlay.parentNode) {
          entranceOverlay.parentNode.removeChild(entranceOverlay);
        }
      }, 600);
    }, 50);
  }

})();
