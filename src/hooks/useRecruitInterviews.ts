'use client'

// React Imports
import { useState, useEffect, useCallback } from 'react'

// API Imports
import { axiosGet } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

// Type Imports
import type { EventInput } from '@fullcalendar/core'

/**
 * Interview data structure
 */
export interface Interview {
  id: string
  candidateId: string
  candidateName?: string
  interviewDate: string
  durationMinutes: number
  interviewType: string
  location?: string
  status: string
  interviewRound?: number
  jobId?: string
  jobTitle?: string
  notes?: string
}

/**
 * Convert interviews to calendar events
 * @param interviews - Array of interview data
 * @param jobs - Array of job data (optional, for job filtering)
 * @returns Array of calendar events
 */
export function convertInterviewsToEvents(
  interviews: Interview[],
  jobs: Array<{ id: string; title: string }> = []
): EventInput[] {
  return interviews.map(interview => {
    const startDate = new Date(interview.interviewDate)
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes || 60) * 60 * 1000)

    // Find job title if jobId exists
    const job = jobs.find(j => j.id === interview.jobId)
    const jobTitle = job?.title || interview.jobTitle || ''

    return {
      id: interview.id,
      title: interview.candidateName || `Interview ${interview.id}`,
      start: startDate,
      end: endDate,
      extendedProps: {
        interviewId: interview.id,
        candidateId: interview.candidateId,
        candidateName: interview.candidateName,
        interviewType: interview.interviewType,
        location: interview.location,
        status: interview.status,
        interviewRound: interview.interviewRound,
        jobId: interview.jobId,
        jobTitle: jobTitle,
        durationMinutes: interview.durationMinutes,
        notes: interview.notes,
        calendar: interview.jobId || 'default',
      },
      backgroundColor: interview.jobId ? undefined : undefined, // Will be set by calendar colors
      borderColor: interview.jobId ? undefined : undefined,
    }
  })
}

/**
 * Hook to fetch and manage recruit interviews
 */
export function useRecruitInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosGet<Interview[]>(`${API_ENDPOINTS.RECRUIT.INTERVIEWS}?limit=1000`)
      
      if (response?.success && response?.data) {
        const interviewsData = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data || []
        setInterviews(interviewsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch interviews'))
      console.error('[useRecruitInterviews] Error fetching interviews:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInterviews()
  }, [fetchInterviews])

  const convertToEvents = useCallback(
    (interviewsData: Interview[], jobs: Array<{ id: string; title: string }> = []) => {
      return convertInterviewsToEvents(interviewsData, jobs)
    },
    []
  )

  return {
    interviews,
    loading,
    error,
    refetch: fetchInterviews,
    convertToEvents,
    convertInterviewsToEvents, // Alias for convertToEvents
  }
}
