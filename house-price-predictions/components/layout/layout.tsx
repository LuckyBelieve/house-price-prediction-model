import Link from 'next/link';
import { LineChart, Home, Calculator, BarChart3, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-50 dark:bg-gray-900">
            <Link href="/" className="flex items-center">
              <span className="h-8 w-8 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-white" />
              </span>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">HomeValue</span>
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {[
                { name: 'Home', href: '/', icon: Home },
                { name: 'Predict', href: '/predict', icon: Calculator },
                { name: 'Analytics', href: '/analytics', icon: BarChart3 },
                { name: 'History', href: '/history', icon: Clock },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm py-2 px-4 flex items-center justify-between fixed top-0 w-full z-10">
        <Link href="/" className="flex items-center">
          <span className="h-8 w-8 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <LineChart className="h-5 w-5 text-white" />
          </span>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">HomeValue</span>
        </Link>
      </div>

      {/* Mobile navigation */}
      <div className="fixed inset-x-0 bottom-0 md:hidden bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-10">
        <div className="flex justify-around">
          {[
            { name: 'Home', href: '/', icon: Home },
            { name: 'Predict', href: '/predict', icon: Calculator },
            { name: 'Analytics', href: '/analytics', icon: BarChart3 },
            { name: 'History', href: '/history', icon: Clock },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 py-6 px-4 md:px-6 lg:px-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}