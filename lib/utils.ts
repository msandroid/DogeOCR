import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const supabase = createClient(
  'https://pzwalveyyuhlwuditeij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6d2FsdmV5eXVobHd1ZGl0ZWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzIwNDIsImV4cCI6MjA2ODI0ODA0Mn0.ilr0-_qIGKTu8bO5ersa7i5FzqTsX9wloCHT-bw3KNY'
)
