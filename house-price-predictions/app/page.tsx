'use client';

import Layout from '@/components/layout/layout';
import { ArrowRight, CheckCircle, Home as HomeIcon, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  const features = [
    {
      title: "Accurate Predictions",
      description: "Our machine learning model uses multiple factors to predict house prices with high accuracy.",
      icon: <TrendingUp className="h-5 w-5 text-cyan-500" />
    },
    {
      title: "Comprehensive Analysis",
      description: "Get detailed insights on property valuations with comparative market analysis.",
      icon: <CheckCircle className="h-5 w-5 text-cyan-500" />
    },
    {
      title: "Improvement Recommendations",
      description: "Receive personalized suggestions to increase your property's value.",
      icon: <HomeIcon className="h-5 w-5 text-cyan-500" />
    }
  ];

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <HomeIcon className="h-8 w-8 text-white" />
            </span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            House Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Prediction</span>
          </h1>
          
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Accurately predict property prices using advanced machine learning algorithms. 
            Get insights and recommendations to maximize your property's value.
          </p>
          
          <div className="mt-8">
            <button 
              onClick={() => router.push('/predict')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-md transition-all duration-200 px-8 py-2 flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 dark:bg-gray-800/80 border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-50 dark:bg-cyan-900 mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}