export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg w-full bg-white border border-wl-border rounded-2xl shadow-card p-6 sm:p-8">
      {children}
    </div>
  );
}
