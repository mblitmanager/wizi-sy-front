import React from 'react';
import { Mail, Phone, Users } from 'lucide-react';
import type { Contact } from '../types';

function Contacts() {
  const contacts: Contact[] = []; // This will be fetched from the API

  const contactTypes = {
    trainer: {
      title: 'Formateur',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    commercial: {
      title: 'Commercial',
      icon: Phone,
      color: 'text-green-600 bg-green-100'
    },
    support: {
      title: 'Support',
      icon: Mail,
      color: 'text-purple-600 bg-purple-100'
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mes Contacts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            const typeInfo = contactTypes[contact.type];
            const Icon = typeInfo.icon;
            
            return (
              <div key={contact.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${typeInfo.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.user.firstName} {contact.user.lastName}</h3>
                    <p className="text-sm text-gray-600">{typeInfo.title}</p>
                    <p className="text-sm text-gray-600 mt-2">{contact.user.email}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600">Aucun contact disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;