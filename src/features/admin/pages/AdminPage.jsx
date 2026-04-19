import { useState } from "react";
import AdminHeader from "@/features/admin/components/AdminHeader";
import Tabs from "@/features/admin/components/Tabs";
import DestinationsTable from "@/features/admin/components/destinations/DestinationsTable";
import PackagesTable from "@/features/admin/components/packages/PackagesTable";

export default function AdminPage() {
  // state to track which tab is active 
  const [tab, setTab] = useState("Destinations");

  return (
    // full screen layout with a soft gray bg 
    <div className="min-h-screen bg-gray-50">
      
      
      <AdminHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        
       
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage destinations, tour packages, and bookings.
          </p>
        </div>

        {/* tabs component  */}
        <Tabs tab={tab} onTabChange={setTab} />

        <div className="mt-6">
          {/* conditional rendering  */}
          
          {/* show destinations table if tab is "Destinations" */}
          {tab === "Destinations" && <DestinationsTable />}

          {/* show packages table if tab is "Packages" */}
          {tab === "Packages" && <PackagesTable />}
        </div>
      </main>
    </div>
  );
}