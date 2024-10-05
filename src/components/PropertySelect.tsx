import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Property } from '@/lib/hooks/useProperties'

interface PropertySelectProps {
  properties: Property[]
  selectedPropertyId: string | null
  onSelectProperty: (propertyId: string) => void
}

export function PropertySelect({ properties, selectedPropertyId, onSelectProperty }: PropertySelectProps) {
  return (
    <Select value={selectedPropertyId || undefined} onValueChange={onSelectProperty}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a property" />
      </SelectTrigger>
      <SelectContent>
        {properties.map((property) => (
          <SelectItem key={property.id} value={property.id}>
            {property.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}