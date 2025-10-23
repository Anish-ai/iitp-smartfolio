"use client"

import useSWR from "swr"
import { profileApi } from "@/lib/api"
import type { Profile } from "@/lib/db"

const fetcher = async () => {
  try {
    const data = await profileApi.get()
    return data as Profile
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile | null>("profile", fetcher, { revalidateOnFocus: false })

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  }
}
