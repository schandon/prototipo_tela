import React from 'react';
import { LoginForm } from './views/auth/LoginForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm onSuccess={() => console.log('Login successful')} onError={error => console.error('Login failed:', error)} />
    </div>
  );
}

export default App;
