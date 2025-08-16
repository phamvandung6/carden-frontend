import { AuthLayout } from '@/components/layout/app-layout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
