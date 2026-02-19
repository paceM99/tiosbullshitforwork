/* Angepasst: Selektiert Elemente innerhalb .av-widget, wartet auf DOM, Pagefly/Shopify-kompatibel */

(function () {
  function init() {
    var root = document.querySelector(".av-widget");
    if (!root) return;

    var THUMB_SIZE = 44;
    var PADDING = 6;

    var track = root.querySelector(".av-track");
    var thumb = root.querySelector(".av-thumb");
    var trackHint = root.querySelector(".av-track-hint");
    var labelNo = root.querySelector(".av-label-no");
    var labelYes = root.querySelector(".av-label-yes");
    var subtitle = root.querySelector(".av-subtitle");
    var result = root.querySelector(".av-result");
    var modalOverlay = root.querySelector(".av-modal-overlay");
    var btnCancel = root.querySelector(".av-btn-cancel");
    var btnConfirm = root.querySelector(".av-btn-confirm");

    if (!track || !thumb) return;

    var isDragging = false;
    var confirmed = false;
    var dragOffset = 0;

    function getMaxOffset() {
      return track.offsetWidth - THUMB_SIZE - PADDING * 2;
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function updateUI() {
      var max = getMaxOffset();
      var progress = max > 0 ? dragOffset / max : 0;

      thumb.style.left = PADDING + dragOffset + "px";

      if (confirmed) {
        track.style.background = "#22c55e";
      } else {
        var green = "#22c55e " + (progress * 100) + "%";
        var mid = progress > 0 ? "#86efac" : "#cbd5e1";
        track.style.background =
          "linear-gradient(to right, " + green + ", " + mid + " " + (progress * 100) + "%, #cbd5e1 100%)";
      }

      if (confirmed) {
        labelNo.classList.remove("av-active");
        labelYes.classList.add("av-active");
        result.className = "av-result av-yes";
        result.querySelector(".av-result-icon").textContent = "\u2705";
        result.querySelector(".av-result-title").textContent = "Ja \u2014 Ich bin 18 oder \u00e4lter";
        result.querySelector(".av-result-text").textContent = "Sie d\u00fcrfen fortfahren.";
        subtitle.textContent = "Best\u00e4tigt \u2014 Sie d\u00fcrfen fortfahren";
        trackHint.classList.add("av-hidden");
        thumb.classList.add("av-locked");
      } else {
        labelNo.classList.add("av-active");
        labelYes.classList.remove("av-active");
        result.className = "av-result av-no";
        result.querySelector(".av-result-icon").textContent = "\uD83D\uDEAB";
        result.querySelector(".av-result-title").textContent = "Nein \u2014 Ich bin unter 18";
        result.querySelector(".av-result-text").textContent =
          "Sie m\u00fcssen mindestens 18 Jahre alt sein, um fortzufahren.";
        subtitle.textContent =
          "Schieben Sie den Regler nach rechts, um zu best\u00e4tigen, dass Sie 18+ sind";
      }
    }

    function onPointerDown(e) {
      if (confirmed) return;
      e.preventDefault();
      thumb.setPointerCapture(e.pointerId);
      isDragging = true;
      thumb.classList.add("av-dragging");
      trackHint.classList.add("av-hidden");
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      var rect = track.getBoundingClientRect();
      var x = e.clientX - rect.left - PADDING - THUMB_SIZE / 2;
      dragOffset = clamp(x, 0, getMaxOffset());
      updateUI();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      thumb.classList.remove("av-dragging");

      var max = getMaxOffset();
      if (dragOffset >= max * 0.85) {
        dragOffset = max;
        updateUI();
        modalOverlay.classList.remove("av-hidden");
      } else {
        dragOffset = 0;
        trackHint.classList.remove("av-hidden");
        updateUI();
      }
    }

    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);

    btnCancel.addEventListener("click", function () {
      modalOverlay.classList.add("av-hidden");
      dragOffset = 0;
      trackHint.classList.remove("av-hidden");
      updateUI();
    });

    btnConfirm.addEventListener("click", function () {
      modalOverlay.classList.add("av-hidden");
      confirmed = true;
      dragOffset = getMaxOffset();
      updateUI();
    });

    window.addEventListener("resize", function () {
      if (confirmed) {
        dragOffset = getMaxOffset();
        updateUI();
      }
    });

    updateUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
