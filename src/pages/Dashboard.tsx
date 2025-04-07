import React from 'react';

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Your learning journey continues here.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;