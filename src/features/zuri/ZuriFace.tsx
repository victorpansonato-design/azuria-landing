export function ZuriFace() {
  return (
    <svg
      className="zuri-face"
      width="56"
      height="56"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="zuri-persistent-blue" cx="40%" cy="30%" r="90%">
          <stop stopColor="#55aaff" />
          <stop offset=".55" stopColor="#2d87fa" />
          <stop offset="1" stopColor="#75bdff" />
        </radialGradient>
      </defs>
      <path
        d="M7 13C12 6 23 6 32 6C45 6 56 9 58 20C62 35 57 48 50 51V60L34 54C19 55 9 53 6 42C3 31 3 21 7 13Z"
        fill="url(#zuri-persistent-blue)"
      />
      <g className="zuri-travel-gaze">
        <g className="zuri-gaze">
          <g className="zuri-eyes">
            <rect x="19" y="22" width="8" height="20" rx="4" fill="white" />
            <rect x="38" y="22" width="8" height="20" rx="4" fill="white" />
          </g>
        </g>
      </g>
    </svg>
  );
}
