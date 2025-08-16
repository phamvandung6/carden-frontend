import Link from 'next/link';
import { LoginForm } from '@/components/forms';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <LoginForm />

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
