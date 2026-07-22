// Efek tilt 3D ringan berbasis posisi kursor — dipakai di kartu & elemen glass.
export function tiltMove(e, max = 8) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
  el.style.setProperty('--mx', `${(x * 100 + 50).toFixed(1)}%`);
  el.style.setProperty('--my', `${(y * 100 + 50).toFixed(1)}%`);
}

export function tiltLeave(e) {
  const el = e.currentTarget;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
}

// Intersection Observer helper untuk animasi reveal saat scroll
export function observeReveal(root) {
  const els = root.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
  return io;
}
