function ParkOSLogoDark({ size = 32, style }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, ...style }}
      >
        {/* Background */}
        <defs>
          <linearGradient id="bgD" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>
          <linearGradient id="bW" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d4d4d2" />
          </linearGradient>
          <linearGradient id="bM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8c8c6" />
            <stop offset="100%" stopColor="#929290" />
          </linearGradient>
          <linearGradient id="bDk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4a48" />
            <stop offset="100%" stopColor="#2a2a28" />
          </linearGradient>
        </defs>
  
        <rect width="32" height="32" rx="7" fill="url(#bgD)" />
  
        {/* Row 1: 3 equal blocks */}
        <rect x="3" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
        <rect x="12.5" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
        <rect x="22" y="3.5" width="7" height="7" rx="1.6" fill="url(#bW)" />
  
        {/* Row 2: wide + small */}
        <rect x="3" y="12.5" width="16" height="7" rx="1.6" fill="url(#bM)" />
        <rect x="22" y="12.5" width="7" height="7" rx="1.6" fill="url(#bM)" />
  
        {/* Row 3: full wide bar */}
        <rect x="3" y="21.5" width="26" height="7" rx="1.6" fill="url(#bDk)" />
      </svg>
    );
  }
  
  function ParkOSLogoWhite({ size = 32, style }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, ...style }}
      >
        <defs>
          <linearGradient id="bgL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ececea" />
          </linearGradient>
          <linearGradient id="lD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#333330" />
            <stop offset="100%" stopColor="#1a1a18" />
          </linearGradient>
          <linearGradient id="lM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#888886" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>
          <linearGradient id="lL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ccccca" />
            <stop offset="100%" stopColor="#b0b0ae" />
          </linearGradient>
        </defs>
  
        <rect width="32" height="32" rx="7" fill="url(#bgL)" stroke="#e0e0de" strokeWidth="0.5" />
  
        {/* Row 1: 3 equal blocks — darkest */}
        <rect x="3" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />
        <rect x="12.5" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />
        <rect x="22" y="3.5" width="7" height="7" rx="1.6" fill="url(#lD)" />
  
        {/* Row 2: wide + small — mid grey */}
        <rect x="3" y="12.5" width="16" height="7" rx="1.6" fill="url(#lM)" />
        <rect x="22" y="12.5" width="7" height="7" rx="1.6" fill="url(#lM)" />
  
        {/* Row 3: full wide bar — light grey */}
        <rect x="3" y="21.5" width="26" height="7" rx="1.6" fill="url(#lL)" />
      </svg>
    );
  }
  
 