'use client';
import Image from 'next/image';

export function GoogleButton({ onClick, children = 'Continue with Google' }:{
  onClick: () => void; children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-wl-border bg-white px-4 py-3 text-wl-ink hover:bg-wl-beige focus:outline-none focus-visible:ring-2 focus-visible:ring-wl-sky"
    >
      <Image src="/google.svg" alt="" width={18} height={18} />
      <span className="font-medium">{children}</span>
    </button>
  );
}
