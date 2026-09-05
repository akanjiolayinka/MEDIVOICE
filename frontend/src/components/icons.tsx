import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps, children: React.ReactNode) {
  const { width = 20, height = 20, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>,
  );

export const MicIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </>,
  );

export const ClockIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>,
  );

export const ActivityIcon = (props: IconProps) =>
  base(props, <path d="M3 12h4l2 8 4-16 2 8h6" />);

export const MapPinIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>,
  );

export const GlobeIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </>,
  );

export const BarChartIcon = (props: IconProps) =>
  base(
    props,
    <>
      <line x1="5" y1="21" x2="5" y2="10" />
      <line x1="12" y1="21" x2="12" y2="4" />
      <line x1="19" y1="21" x2="19" y2="14" />
    </>,
  );

export const UserIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
    </>,
  );

export const SettingsIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.29l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>,
  );

export const BellIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>,
  );

export const MenuIcon = (props: IconProps) =>
  base(
    props,
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>,
  );

export const CloseIcon = (props: IconProps) =>
  base(
    props,
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>,
  );

export const LogOutIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>,
  );

export const ChevronDownIcon = (props: IconProps) => base(props, <polyline points="6 9 12 15 18 9" />);

export const SearchIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>,
  );

export const PlayIcon = (props: IconProps) => base(props, <polygon points="6 4 20 12 6 20 6 4" />);

export const DownloadIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M12 3v12" />
      <polyline points="7 11 12 16 17 11" />
      <path d="M5 21h14" />
    </>,
  );

export const CopyIcon = (props: IconProps) =>
  base(
    props,
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>,
  );

export const ShareIcon = (props: IconProps) =>
  base(
    props,
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </>,
  );

export const AlertTriangleIcon = (props: IconProps) =>
  base(
    props,
    <>
      <path d="M12 3 1 21h22L12 3Z" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <line x1="12" y1="17.5" x2="12" y2="17.51" />
    </>,
  );

export const ArrowRightIcon = (props: IconProps) =>
  base(
    props,
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>,
  );

export const CheckIcon = (props: IconProps) => base(props, <polyline points="20 6 9 17 4 12" />);
