'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConditionalAuthGuard } from '@/features/auth';
import { BookOpen, GraduationCap, Target, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <ConditionalAuthGuard
      // Content for authenticated users
      authenticated={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back to Cardemy!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Continue your learning journey with AI-powered flashcards
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/study">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Start Studying
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">My Decks</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Manage your flashcard collections
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/decks">View Decks</Link>
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Target className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Practice</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Test your knowledge with practice sessions
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/practice">Start Practice</Link>
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <BarChart3 className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Track your learning progress
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics">View Stats</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
      
      // Content for unauthenticated users (landing page)
      unauthenticated={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                  Cardemy
                </h1>
              </div>
              
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Master any subject with AI-powered flashcards and spaced repetition learning
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg">
                  <Link href="/register">
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Smart Learning</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI-powered spaced repetition adapts to your learning pace for maximum retention
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                  <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Practice Modes</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Multiple study modes including flashcards, quizzes, and timed practice sessions
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed analytics and progress reports to monitor your learning journey
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Join thousands of learners already using Cardemy
              </p>
              <Button asChild variant="ghost">
                <Link href="/about">Learn more about Cardemy →</Link>
              </Button>
            </div>
          </div>
        </div>
      }
      
      // Loading state
      loading={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }
    />
  );
}
