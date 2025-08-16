import { LearningLayout } from '@/components/layout/app-layout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearningLayout>{children}</LearningLayout>;
}
