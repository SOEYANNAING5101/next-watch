import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '../lib/auth'
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({headers:await headers()})
  if (session) redirect('/')
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 md:p-6">
      {children}
    </div>
  );
}
