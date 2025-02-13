import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react'; // Chrome
import { authController } from '../../controllers/AuthController';
import logo_svg from '../../assets/jrcbrasil_logo.svg';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      await authController.login({ email, password });
      onSuccess?.();
      window.location.href = '/dashboard';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setLoading(true);
  //   setError(undefined);

  //   try {
  //     await authController.loginWithGoogle();
  //     onSuccess?.();
  //     window.location.href = '/dashboard';
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Failed to login with Google';
  //     setError(errorMessage);
  //     onError?.(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="text-center mb-8">
          <img className="justify-center mb-3" src={logo_svg} alt="logo" />
          <h2 className="text-2xl font-bold text-gray-800">Digital Service Report</h2>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="appearance-none border rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="appearance-none border rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input id="remember" type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a className="inline-block align-baseline text-sm text-red-600 hover:text-red-800" href="#">
            Forgot Password?
          </a>
        </div>

        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 mb-4"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Signing in...
            </span>
          ) : (
            'Sign In with Email'
          )}
        </button>

        {/* <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div> */}

        {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Chrome className="h-5 w-5 mr-2" />
          Sign in with Google
        </button> */}
      </form>
      {/* 
      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <a href="#" className="text-red-600 hover:text-red-800 font-medium">
          Sign up
        </a>
      </p> */}
    </div>
  );
}
