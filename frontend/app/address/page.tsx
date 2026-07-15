"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddressPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setFullName(data.fullName);
        setPhone(data.phone);
        setStreet(data.street);
        setCity(data.city);
        setState(data.state);
        setPinCode(data.pinCode);
        setCountry(data.country);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveAddress = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          street,
          city,
          state,
          pinCode,
          country,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Address Saved Successfully!");
        router.push("/orders");
      } else {
        alert(data.message || "Failed to save address.");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[500px]">

        <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
          📍 Delivery Address
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="Street Address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="PIN Code"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-900"
        />

        <button
          onClick={saveAddress}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>

      </div>
    </main>
  );
}
