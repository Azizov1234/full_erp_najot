import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

let supabaseClient: SupabaseClient | null = null;

export async function uploadToSupabase(filename: string): Promise<string> {
  // Always keep file locally, don't upload to Supabase
  return filename;
}
