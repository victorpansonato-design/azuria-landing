export function PlanMark({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 6v88M6 50h88M19 19l62 62M19 81l62-62" stroke="currentColor" strokeWidth="16" /></svg>;
}

/** Original, code-native campaign artwork. No client examples or stock work. */
export function PlansArtwork() {
  const points = Array.from({ length: 360 }, (_, i) => {
    const angle = i / 360 * Math.PI * 2;
    const radius = 180 + 62 * Math.cos(angle * 5);
    return `${300 + Math.cos(angle) * radius},${300 + Math.sin(angle) * radius}`;
  });
  return (
    <div className="plan4-art" aria-hidden="true">
      <div className="plan4-art-orbit" />
      <div className="plan4-poster plan4-poster-back">
        <span>AZURIA / DIREÇÃO DE ARTE</span>
        <strong>Uma marca.<br />Infinitas<br />possibilidades.</strong>
        <svg viewBox="0 0 500 600" fill="none"><path d="M-30 70C240-70 350 190 180 250S-90 500 250 470S630 700 400 650" stroke="currentColor" strokeWidth="30" /></svg>
      </div>
      <div className="plan4-poster plan4-poster-front">
        <div className="plan4-poster-meta"><span>AZURIA®</span><span>ESTUDO Nº 01</span></div>
        <strong>Um novo<br /><i>olhar.</i></strong>
        <svg className="plan4-flower" viewBox="0 0 600 600">
          <defs>
            <linearGradient id="plan4-chrome" x1="0" y1="0" x2=".9" y2="1">
              <stop stopColor="#eaf4ff" /><stop offset=".15" stopColor="#778dd4" />
              <stop offset=".31" stopColor="#1824a9" /><stop offset=".42" stopColor="#9cbeff" />
              <stop offset=".5" stopColor="#f4fbff" /><stop offset=".57" stopColor="#3f51ce" />
              <stop offset=".73" stopColor="#15248d" /><stop offset=".87" stopColor="#a7baff" />
              <stop offset="1" stopColor="#f1f5ff" />
            </linearGradient>
            <radialGradient id="plan4-flower-light" cx=".38" cy=".25" r=".7">
              <stop stopColor="white" stopOpacity=".8" /><stop offset=".5" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="#061139" stopOpacity=".6" />
            </radialGradient>
          </defs>
          <polygon points={points.join(" ")} fill="url(#plan4-chrome)" />
          <polygon points={points.join(" ")} fill="url(#plan4-flower-light)" />
          <circle cx="300" cy="300" r="38" fill="#101ca2" opacity=".28" />
        </svg>
        <div className="plan4-poster-bottom"><span>IMAGINAÇÃO<br />COM DIREÇÃO.</span><span>FEITO PARA<br />A SUA MARCA. ↗</span></div>
      </div>
      <div className="plan4-art-seal"><span>DESIGN COM</span><strong>inten<br />ção.</strong><span>AZURIA / SEU PRÓXIMO NÍVEL</span></div>
      <span className="plan4-art-caption">ESTUDO VISUAL AZURIA — SUA MARCA TEM UM UNIVERSO.</span>
    </div>
  );
}
