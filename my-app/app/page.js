// src/app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080/api/products';

export default function PaginationDemo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  // Pagination Controls State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2); // By default 2 items taake pagination foran test ho sake

  // Current API URL jo backend ko call ho rahi hai
  const currentQueryUrl = `${BACKEND_URL}?page=${page}&limit=${limit}`;

  // 1. Fetch data from Rust Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(currentQueryUrl);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Rust Backend connect nahi ho raha! Check karein port 8080 par cargo run chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  // Jab bhi Page ya Limit change ho, naya data mangwao
  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  // 2. Dummy Data Generator (cURL chalane ki zaroorat nahi)
  const generateDummyData = async () => {
    try {
      setMsg('Creating dummy products in Rust database...');
      const sampleItems = [
        { name: 'MacBook Pro M3', price: 2500 },
        { name: 'Dell XPS 15', price: 1800 },
        { name: 'Mechanical Keyboard', price: 120 },
        { name: 'Gaming Mouse', price: 70 },
        { name: '4K Monitor 27 inch', price: 400 },
        { name: 'Noise Cancel Headphones', price: 300 },
      ];

      for (const item of sampleItems) {
        await axios.post(BACKEND_URL, { id: 0, name: item.name, price: item.price });
      }

      setMsg('✅ 6 Demo Products database mein add ho gaye!');
      setPage(1);
      fetchProducts();
    } catch (err) {
      setError('Dummy data create karte waqt error aaya');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-indigo-600">
          📄 Zero-Config Pagination Testing
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Don Framework Rust Backend + Next.js Dynamic Query Params
        </p>
      </div>

      {/* Live Query Inspector Card */}
      <div className="bg-slate-900 text-emerald-400 font-mono p-4 rounded-xl shadow-lg mb-6 text-sm">
        <div className="text-gray-400 text-xs uppercase mb-1">
          ⚡ Live Backend Request URL:
        </div>
        <div className="break-all font-bold">{currentQueryUrl}</div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow border mb-6 flex flex-wrap justify-between items-center gap-4">
        {/* Limit Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Items Per Page (Limit):
          </label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Limit badalne par page 1 par jao
            }}
            className="border p-2 rounded-lg font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={2}>2 items</option>
            <option value={3}>3 items</option>
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
          </select>
        </div>

        {/* Dummy Data Button */}
        <button
          type="button"
          onClick={generateDummyData}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-4 py-2.5 rounded-lg transition"
        >
          ⚡ Insert 6 Demo Products
        </button>
      </div>

      {/* Alerts */}
      {msg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
          {msg}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
          🛑 {error}
        </div>
      )}

      {/* Table Data */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Fetched Products</h2>
          <span className="text-xs font-mono bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full">
            Showing {products.length} records (Limit: {limit})
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Rust backend se data fetch ho raha hai...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Is page par koi data nahi mila. Upar "Insert 6 Demo Products" button dabayein!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                <th className="p-4">ID (Ordered DESC)</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-400">#{item.id}</td>
                  <td className="p-4 font-bold text-gray-800">{item.name}</td>
                  <td className="p-4 font-mono font-bold text-emerald-600">
                    ${item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Navigation Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 text-sm font-semibold border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Previous Page
          </button>

          <span className="text-sm font-semibold text-gray-700">
            Current Page: <strong className="text-indigo-600 text-base">{page}</strong>
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={products.length < limit || loading}
            className="px-4 py-2 text-sm font-semibold border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next Page →
          </button>
        </div>
      </div>
    </div>
  );
}