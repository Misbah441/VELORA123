// A minimal layout for auth pages (sign-in, register, reset-password) — no sidebar
export default function AuthOnlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {children}
    </div>
  );
}
