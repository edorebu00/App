import type { Circuit } from "@/lib/circuits";

export default function CircuitIllustration({ circuit }: { circuit: Circuit }) {
  return (
    <svg
      viewBox={circuit.viewBox}
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={circuit.d} stroke="#334155" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={circuit.d}
        stroke="#818cf8"
        strokeWidth="1.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <g transform={`translate(${circuit.start[0] - 6}, ${circuit.start[1] - 6})`}>
        <rect width="12" height="12" fill="#f4f4f5" />
        <rect width="6" height="6" fill="#0c0c0e" />
        <rect x="6" y="6" width="6" height="6" fill="#0c0c0e" />
      </g>
    </svg>
  );
}
