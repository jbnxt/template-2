import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebase/firebase'
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Received task data:', req.body)
      const taskData = {
        ...req.body,
        date: Timestamp.fromDate(new Date())
      }
      console.log('Processed task data:', taskData)
      const docRef = await addDoc(collection(db, 'tasks'), taskData)
      console.log('Task added with ID:', docRef.id)
      res.status(201).json({ id: docRef.id, ...taskData, date: taskData.date.toDate().toISOString() })
    } catch (error) {
      console.error('Error creating task:', error)
      res.status(500).json({ 
        error: 'Failed to create task', 
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  } else if (req.method === 'GET') {
    try {
      const tasksQuery = query(collection(db, 'tasks'), orderBy('date', 'desc'))
      const taskSnapshot = await getDocs(tasksQuery)
      const tasks = taskSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString()
      }))
      res.status(200).json(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      res.status(500).json({ error: 'Failed to fetch tasks', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}