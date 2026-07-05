"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface LeaseFormData {
  property: string;
  client: string;
  monthlyRent: string;
  startDate: string;
  endDate: string;
}

const LeaseCreatePage: React.FC = () => {
  const [formData, setFormData] = useState<LeaseFormData>({
    property: 'City Apartment',
    client: 'John Client',
    monthlyRent: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Creating Lease with Data:', formData);
  };

  const handleCancel = (): void => {
    console.log('Cancelled');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Form Container (White Background) */}
      <div className="w-full bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm text-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Property Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-sm font-medium">
              Property <span className="text-zinc-400 font-normal">(rent + available only)</span>
            </label>
            <div className="relative">
              <select
                name="property"
                value={formData.property}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 appearance-none cursor-pointer text-sm font-medium"
              >
                <option value="City Apartment">City Apartment</option>
                <option value="Sea View Flat">Sea View Flat</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Client & Rent Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-600 text-sm font-medium">Client</label>
              <div className="relative">
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 appearance-none cursor-pointer text-sm font-medium"
                >
                  <option value="John Client">John Client</option>
                  <option value="Sam Client">Sam Client</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Monthly Rent Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-600 text-sm font-medium">Monthly rent</label>
              <input
                type="number"
                name="monthlyRent"
                placeholder="25000"
                value={formData.monthlyRent}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-sm"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-600 text-sm font-medium">Start date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-sm"
                style={{ colorScheme: 'light' }}
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-600 text-sm font-medium">End date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-sm"
                style={{ colorScheme: 'light' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors text-sm font-medium bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              Create lease
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LeaseCreatePage;