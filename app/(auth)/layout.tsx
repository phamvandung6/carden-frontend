import { AuthLayout } from '@/components/layout/app-layout';
import { GuestGuard } from '@/features/auth';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
