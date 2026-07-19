"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

interface AddressForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

const EMPTY_FORM: AddressForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pinCode: "",
  country: "",
};

export default function AddressPage() {
  const router = useRouter();
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await apiGet<Record<string, unknown>>("/address", true);
        const { id, userId, ...addressFields } = data;
        setForm(addressFields as AddressForm);
      } catch {
        // no saved address yet
      } finally {
        setFetching(false);
      }
    };
    fetchAddress();
  }, []);

  const updateField = (field: keyof AddressForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveAddress = async () => {
    setLoading(true);
    try {
      await apiPost("/address", {
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        pinCode: form.pinCode,
        country: form.country,
      });
      alert("Address saved successfully!");
      router.push("/orders");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="animate-pulse w-full max-w-md space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Delivery Address
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Where should we deliver your order?
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              placeholder="123 Main Street, Apt 4B"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Mumbai"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="Maharashtra"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code
              </label>
              <input
                type="text"
                placeholder="400001"
                value={form.pinCode}
                onChange={(e) => updateField("pinCode", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="India"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <button
          onClick={saveAddress}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-6"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </main>
  );
}
