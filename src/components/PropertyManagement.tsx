'use client'

import { useState } from 'react'
import { useProperties, Property } from '@/lib/hooks/useProperties'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PropertyManagement() {
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties();
  
  console.log('Properties:', properties);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState({ name: '', address: '' });

  const handleAddProperty = async () => {
    await addProperty(newProperty);
    setNewProperty({ name: '', address: '' });
    setIsAddModalOpen(false);
  };

  const handleUpdateProperty = async () => {
    if (editingProperty) {
      await updateProperty(editingProperty.id, editingProperty);
      setEditingProperty(null);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(propertyId);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Property Management</h1>
      <Button onClick={() => setIsAddModalOpen(true)}>Add Property</Button>
      <ul className="mt-4">
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((property: Property) => (
            <li key={property.id} className="mb-2 p-2 border rounded">
              {editingProperty?.id === property.id ? (
                <>
                  <Input
                    value={editingProperty.name}
                    onChange={(e) => setEditingProperty({...editingProperty, name: e.target.value})}
                    className="mb-2"
                  />
                  <Input
                    value={editingProperty.address}
                    onChange={(e) => setEditingProperty({...editingProperty, address: e.target.value})}
                    className="mb-2"
                  />
                  <Button onClick={handleUpdateProperty}>Save</Button>
                  <Button onClick={() => setEditingProperty(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <span>{property.name} - {property.address}</span>
                  <Button onClick={() => setEditingProperty(property)} className="ml-2">Edit</Button>
                  <Button onClick={() => handleDeleteProperty(property.id)} className="ml-2">Delete</Button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No properties available</p>
        )}
      </ul>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newProperty.name}
            onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
          />
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={newProperty.address}
            onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
          />
          <Button onClick={handleAddProperty}>Add Property</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}