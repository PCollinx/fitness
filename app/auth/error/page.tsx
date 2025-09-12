'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'Signin':
          setError('Try signing in with a different account.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
          setError('There was a problem with your authentication provider. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          setError('This email is already in use with a different provider. Please sign in using the original provider.');
          break;
        case 'CredentialsSignin':
          setError('Invalid login credentials. Please check your email and password.');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access this page.');
          break;
        default:
          setError('An unknown error occurred.');
          break;
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="flex flex-col items-center">
        <FaExclamationTriangle className="h-16 w-16 text-yellow-500" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-yellow-500">
          Authentication Error
        </h2>
        {error && (
          <div className="mt-4 rounded-md bg-red-900/30 p-4">
            <p className="text-md text-red-400">{error}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 space-y-4">
        <div>
          <Link 
            href="/auth/signin"
            className="inline-flex justify-center rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Return to sign in
          </Link>
        </div>
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="w-full max-w-md text-center">
          <FaExclamationTriangle className="h-16 w-16 mx-auto text-yellow-500" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-yellow-500">
            Loading...
          </h2>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}