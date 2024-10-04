'use client'

import { useState } from 'react'
import { useProperties, Property } from '@/lib/hooks/useProperties'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export function PropertyManagement() {
  const { properties, loading, error, refreshProperties, updateProperty, deleteProperty } = useProperties();
  const [syncing, setSyncing] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newName, setNewName] = useState('');

  const handleSyncProperties = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to sync properties');
      }
      await refreshProperties();
    } catch (err) {
      console.error('Error syncing properties:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setNewName(property.name);
  };

  const handleSaveEdit = async () => {
    if (editingProperty) {
      await updateProperty(editingProperty.id, { ...editingProperty, name: newName });
      setEditingProperty(null);
      await refreshProperties();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      await refreshProperties();
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Property Management</h1>
      <Button onClick={handleSyncProperties} disabled={syncing} className="mb-6">
        {syncing ? 'Syncing...' : 'Sync Properties from Hospitable'}
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property: Property, index: number) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button onClick={() => handleEdit(property)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDelete(property.id)} variant="destructive">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingProperty} onOpenChange={() => setEditingProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property Name</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New property name"
          />
          <DialogFooter>
            <Button onClick={() => setEditingProperty(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}