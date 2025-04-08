import React from 'react';
import { Bell, Lock, Eye, Globe, Moon } from 'lucide-react';
import Form from '../../components/form/Form';
import FormField from '../../components/form/FormField';
import FormSelect from '../../components/form/FormSelect';
import { z } from 'zod';

const settingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sound: z.boolean()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'contacts']),
    showProgress: z.boolean(),
    showRanking: z.boolean()
  }),
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.string()
  })
});

function Settings() {
  const handleSubmit = (data: z.infer<typeof settingsSchema>) => {
    console.log('Settings updated:', data);
  };

  const defaultValues = {
    notifications: {
      email: true,
      push: true,
      sound: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showRanking: true
    },
    appearance: {
      theme: 'system',
      language: 'fr'
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <Form
        schema={settingsSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        className="space-y-6"
      >
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <FormField
              type="checkbox"
              name="notifications.email"
              label="Notifications par email"
            />
            <FormField
              type="checkbox"
              name="notifications.push"
              label="Notifications push"
            />
            <FormField
              type="checkbox"
              name="notifications.sound"
              label="Sons de notification"
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Confidentialité</h2>
          </div>
          <div className="space-y-4">
            <FormSelect
              name="privacy.profileVisibility"
              label="Visibilité du profil"
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Privé' },
                { value: 'contacts', label: 'Contacts uniquement' }
              ]}
            />
            <FormField
              type="checkbox"
              name="privacy.showProgress"
              label="Afficher ma progression"
            />
            <FormField
              type="checkbox"
              name="privacy.showRanking"
              label="Afficher mon classement"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Apparence</h2>
          </div>
          <div className="space-y-4">
            <FormSelect
              name="appearance.theme"
              label="Thème"
              options={[
                { value: 'light', label: 'Clair' },
                { value: 'dark', label: 'Sombre' },
                { value: 'system', label: 'Système' }
              ]}
            />
            <FormSelect
              name="appearance.language"
              label="Langue"
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Settings;