import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

async function migrateTasksPropertyId() {
  const propertiesRef = collection(db, 'properties');
  const tasksRef = collection(db, 'tasks');

  // Get all properties
  const propertiesSnapshot = await getDocs(propertiesRef);
  const properties = propertiesSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
  }));

  // Get all tasks
  const tasksSnapshot = await getDocs(tasksRef);

  for (const taskDoc of tasksSnapshot.docs) {
    const task = taskDoc.data();
    const propertyName = task.property;

    // Find the corresponding property
    const property = properties.find(p => p.name === propertyName);

    if (property) {
      // Update the task with the new propertyId field
      await updateDoc(doc(tasksRef, taskDoc.id), {
        propertyId: property.id,
        propertyName: propertyName,
      });
      console.log(`Updated task ${taskDoc.id} with propertyId ${property.id}`);
    } else {
      console.warn(`Could not find property for task ${taskDoc.id} with property name ${propertyName}`);
    }
  }

  console.log('Migration completed');
}

migrateTasksPropertyId().catch(console.error);