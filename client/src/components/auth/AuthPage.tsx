import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-metal flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
            SophiCare Authentication 
          </h2>
          <p className="mt-2 text-center text-sm text-text/60">
            Please sign in to continue
          </p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'login'
                ? 'border-wood text-wood'
                : 'border-transparent text-text/60 hover:text-text hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign in
          </button>
          <button
            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'register'
                ? 'border-wood text-wood'
                : 'border-transparent text-text/60 hover:text-text hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Create account
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}; 