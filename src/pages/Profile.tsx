import React from 'react';

function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200"></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Name</h2>
              <p className="text-gray-600">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;