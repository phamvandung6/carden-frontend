import { LearningLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/features/auth';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LearningLayout>{children}</LearningLayout>
    </AuthGuard>
  );
}
