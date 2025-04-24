
import React from 'react';
import { User } from '@/types';
import { Trophy } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Get the first letter of the username or use a fallback
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : '?';
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4 font-nunito">
          {firstLetter}
        </div>
        <div>
          <h2 className="text-xl font-semibold font-montserrat">{user?.username || 'User'}</h2>
          <div className="text-gray-500 font-roboto">{user?.email || 'No email provided'}</div>
          <div className="flex items-center mt-1">
            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium font-nunito">
              {user?.points || 0} points - Niveau {user?.level || 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
