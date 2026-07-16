import { useAdmin } from '@/lib/context/adminContext';
import { Save,User } from 'lucide-react';
 
 
export default function ProfileSettings() {
  const { user } = useAdmin()
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Profile Settings</h2>
              <form className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    {/*PHOTO IMAGE */}
                  </div>
                  <button type="button" className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder={ user?.fullName }
                      className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder={ user?.email }
                    className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder={ user?.phoneNumber }
                    className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <button type="submit" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </div>
    )
}
 