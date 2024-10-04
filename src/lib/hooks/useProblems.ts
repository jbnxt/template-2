import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import { Problem } from '@/lib/types'

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProblems() {
      try {
        const problemsCollection = collection(db, 'problems')
        const problemsSnapshot = await getDocs(problemsCollection)
        const problemsList = problemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Problem))
        setProblems(problemsList)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch problems')
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  return { problems, loading, error }
}