import useSWR from 'swr'
import {
    profileApi,
    projectsApi,
    educationApi,
    skillsApi,
    achievementsApi,
    positionsApi,
    certificationsApi,
    coursesApi
} from '@/lib/api'

// SWR Configuration - Aggressive caching strategy
// Only fetch data on initial page load and when explicitly mutated (after create/update/delete)
const swrOptions = {
    revalidateOnFocus: false,      // Don't refetch when window gains focus
    revalidateOnReconnect: false,  // Don't refetch when network reconnects
    revalidateIfStale: false,      // Don't refetch even if data is marked stale
    dedupingInterval: 2147483647,  // Max value - essentially cache forever until mutate
    shouldRetryOnError: false,     // Don't retry on error
}

export function useProfile() {
    const { data, error, isLoading, mutate } = useSWR('profile', () => profileApi.get(), swrOptions)
    return {
        profile: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useProjects() {
    const { data, error, isLoading, mutate } = useSWR('projects', () => projectsApi.list(), swrOptions)
    return {
        projects: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function useEducation() {
    const { data, error, isLoading, mutate } = useSWR('education', () => educationApi.list(), swrOptions)
    return {
        education: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function useSkills() {
    const { data, error, isLoading, mutate } = useSWR('skills', () => skillsApi.list(), swrOptions)
    return {
        skills: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function useAchievements() {
    const { data, error, isLoading, mutate } = useSWR('achievements', () => achievementsApi.list(), swrOptions)
    return {
        achievements: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function usePositions() {
    const { data, error, isLoading, mutate } = useSWR('positions', () => positionsApi.list(), swrOptions)
    return {
        positions: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function useCertifications() {
    const { data, error, isLoading, mutate } = useSWR('certifications', () => certificationsApi.list(), swrOptions)
    return {
        certifications: data || [],
        isLoading,
        isError: error,
        mutate
    }
}

export function useCourses() {
    const { data, error, isLoading, mutate } = useSWR('courses', () => coursesApi.list(), swrOptions)
    return {
        courses: data || [],
        isLoading,
        isError: error,
        mutate
    }
}
