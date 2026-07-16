import { useAdmin } from '@/lib/context/adminContext';
import { Save } from 'lucide-react';


export default function StoreSettings() {
  const { user } = useAdmin()
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Store Information</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue={user?.store?.name ?? " "}
                    className="w-full text-gray-500/30 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={3}
                    defaultValue={user?.store?.address ?? " "}
                    className="w-full px-4 py-2.5 text-gray-500/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user?.store?.phoneNumber}
                      className="w-full px-4 py-2.5 text-gray-500/30 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      defaultValue="12.345.678.9-012.000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div> */}
                </div>

                <button type="submit" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </div>
    )
}