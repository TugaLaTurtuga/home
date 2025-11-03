document.querySelectorAll('.wave-text').forEach(el => {
  const text = el.textContent;
  el.textContent = ''; // clear old text
  let spaces = 0;

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    if (char === ' ') spaces++;
    span.style.animationDelay = `${-(i - spaces) * 0.1}s`;
    el.appendChild(span);
  });
});
