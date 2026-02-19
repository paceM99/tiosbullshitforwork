// Rewritten: Vanilla JS drag slider with confirmation popup logic

(function () {
  const THUMB_SIZE = 44;
  const PADDING = 6;

  const track = document.getElementById("track");
  const thumb = document.getElementById("thumb");
  const trackHint = document.getElementById("trackHint");
  const labelNo = document.getElementById("labelNo");
  const labelYes = document.getElementById("labelYes");
  const subtitle = document.getElementById("subtitle");
  const result = document.getElementById("result");
  const modalOverlay = document.getElementById("modalOverlay");
  const btnCancel = document.getElementById("btnCancel");
  const btnConfirm = document.getElementById("btnConfirm");

  let isDragging = false;
  let confirmed = false;
  let dragOffset = 0;

  function getMaxOffset() {
    return track.offsetWidth - THUMB_SIZE - PADDING * 2;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function updateUI() {
    const max = getMaxOffset();
    const progress = max > 0 ? dragOffset / max : 0;

    thumb.style.left = PADDING + dragOffset + "px";

    if (confirmed) {
      track.style.background = "#22c55e";
    } else {
      const green = `#22c55e ${progress * 100}%`;
      const mid = progress > 0 ? "#86efac" : "#cbd5e1";
      track.style.background =
        `linear-gradient(to right, ${green}, ${mid} ${progress * 100}%, #cbd5e1 100%)`;
    }

    if (confirmed) {
      labelNo.classList.remove("active");
      labelYes.classList.add("active");
      result.className = "result yes";
      result.querySelector(".result-icon").textContent = "✅";
      result.querySelector(".result-title").textContent = "Ja — Ich bin 18 oder älter";
      result.querySelector(".result-text").textContent = "Sie dürfen fortfahren.";
      subtitle.textContent = "Bestätigt — Sie dürfen fortfahren";
      trackHint.classList.add("hidden");
      thumb.classList.add("locked");
    } else {
      labelNo.classList.add("active");
      labelYes.classList.remove("active");
      result.className = "result no";
      result.querySelector(".result-icon").textContent = "🚫";
      result.querySelector(".result-title").textContent = "Nein — Ich bin unter 18";
      result.querySelector(".result-text").textContent =
        "Sie müssen mindestens 18 Jahre alt sein, um fortzufahren.";
      subtitle.textContent =
        "Schieben Sie den Regler nach rechts, um zu bestätigen, dass Sie 18+ sind";
    }
  }

  function onPointerDown(e) {
    if (confirmed) return;
    e.preventDefault();
    thumb.setPointerCapture(e.pointerId);
    isDragging = true;
    thumb.classList.add("dragging");
    trackHint.classList.add("hidden");
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left - PADDING - THUMB_SIZE / 2;
    dragOffset = clamp(x, 0, getMaxOffset());
    updateUI();
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove("dragging");

    const max = getMaxOffset();
    if (dragOffset >= max * 0.85) {
      dragOffset = max;
      updateUI();
      modalOverlay.classList.remove("hidden");
    } else {
      dragOffset = 0;
      trackHint.classList.remove("hidden");
      updateUI();
    }
  }

  thumb.addEventListener("pointerdown", onPointerDown);
  thumb.addEventListener("pointermove", onPointerMove);
  thumb.addEventListener("pointerup", onPointerUp);

  btnCancel.addEventListener("click", function () {
    modalOverlay.classList.add("hidden");
    dragOffset = 0;
    trackHint.classList.remove("hidden");
    updateUI();
  });

  btnConfirm.addEventListener("click", function () {
    modalOverlay.classList.add("hidden");
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
})();
