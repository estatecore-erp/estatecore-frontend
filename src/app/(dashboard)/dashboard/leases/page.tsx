"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface LeaseItem {
  id: string;
  property: string;
  client: string;
  dates: string;
  rent: string;
  status: 'Active' | 'Expired';
}

const LeasesPage: React.FC = () => {
  const [leases, setLeases] = useState<LeaseItem[]>([
    {
      id: '1',
      property: 'City Apartment',
      client: 'John Client',
      dates: 'Jul 1 – Jul 2027',
      rent: 'LKR 25,000',
      status: 'Active',
    },
    {
      id: '2',
      property: 'Sea View Flat',
      client: 'Sam Client',
      dates: 'Jan 1 – Jan 2026',
      rent: 'LKR 40,000',
      status: 'Expired',
    },
  ]);

  // Modals States
  const [editingLease, setEditingLease] = useState<LeaseItem | null>(null);
  const [editStatus, setEditStatus] = useState<'Active' | 'Expired'>('Active');
  const [deletingLease, setDeletingLease] = useState<LeaseItem | null>(null);

  // Trigger Edit Modal
  const handleEditClick = (lease: LeaseItem) => {
    setEditingLease(lease);
    setEditStatus(lease.status);
  };

  // Save Edit Configuration
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLease) return;

    setLeases(leases.map(lease => 
      lease.id === editingLease.id ? { ...lease, status: editStatus } : lease
    ));
    setEditingLease(null);
  };

  // Trigger Delete Modal
  const handleDeleteClick = (lease: LeaseItem) => {
    setDeletingLease(lease);
  };

  // Confirm Delete Operation
  const handleConfirmDelete = () => {
    if (!deletingLease) return;
    
    setLeases(leases.filter(lease => lease.id !== deletingLease.id));
    setDeletingLease(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      
      {/* Main List Container (White Background) */}
      <div className="w-full bg-white border border-zinc-200 rounded-xl p-6 shadow-sm text-zinc-900">
        
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
          <Link
            href="/dashboard/leases/create"
            className="flex items-center gap-1.5 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add lease
          </Link>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-medium">
                <th className="pb-3 pr-4 font-semibold">Property</th>
                <th className="pb-3 px-4 font-semibold">Client</th>
                <th className="pb-3 px-4 font-semibold">Dates</th>
                <th className="pb-3 px-4 font-semibold">Rent</th>
                <th className="pb-3 px-4 font-semibold">Status</th>
                <th className="pb-3 pl-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {leases.map((lease) => (
                <tr key={lease.id} className="text-zinc-600 hover:bg-zinc-50 transition-colors">
                  <td className="py-4 pr-4 font-medium text-zinc-900">{lease.property}</td>
                  <td className="py-4 px-4 text-zinc-600">{lease.client}</td>
                  <td className="py-4 px-4 text-zinc-400">{lease.dates}</td>
                  <td className="py-4 px-4 font-medium text-zinc-900">{lease.rent}</td>
                  <td className="py-4 px-4">
                    {lease.status === 'Active' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-50 text-zinc-600 border border-zinc-200">
                        Expired
                      </span>
                    )}
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="py-4 pl-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {/* Edit Button */}
                      <button 
                        onClick={() => handleEditClick(lease)}
                        className="p-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors bg-white"
                        title="Edit Lease"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteClick(lease)}
                        className="p-2 border border-zinc-200 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors bg-white"
                        title="Delete Lease"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. EDIT LEASE MODAL OVERLAY (White Background)            */}
      {/* ========================================================= */}
      {editingLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-6 shadow-2xl text-zinc-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-zinc-500 text-sm font-medium mb-4 tracking-wide">
              Edit — {editingLease.property} · {editingLease.client}
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-600 text-xs font-semibold">Status</label>
                <div className="relative">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Expired')}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 appearance-none cursor-pointer font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs tracking-wide mt-0.5">
                  Marking expired reverts the property to available.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLease(null)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DELETE LEASE MODAL OVERLAY (White Background)          */}
      {/* ========================================================= */}
      {deletingLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-6 shadow-2xl text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold tracking-wide mb-2">
              Delete lease?
            </h3>
            
            <p className="text-zinc-600 text-sm leading-relaxed mb-5 tracking-wide">
              {deletingLease.property} — {deletingLease.client}. Property reverts to available. This can't be undone.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingLease(null)}
                className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeasesPage;