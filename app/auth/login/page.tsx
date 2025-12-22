"use client";

import { store } from "@/lib/store";
import { Button, Input } from "@/components/UI";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            J
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Jamii</h1>
        </div>
        <div className="space-y-4">
          <Input label="Email Address" placeholder="you@example.com" />
          <Input label="Password" type="password" />
          <Button className="w-full" onClick={() => store.login("renter")}>
            Log in as Renter
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => store.login("owner")}>
            Log in as Owner
          </Button>
        </div>
      </div>
    </div>
  );
}
