"use client"

import useSWR from "swr"
import { createClient } from "@/lib/auth"
import type { Profile } from "@/lib/db"

const fetcher = async (key: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("userId", user.id).single()

  if (error) throw error
  return data as Profile
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
