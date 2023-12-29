import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function API() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()
  const api = new Api(profile.api_key)
  const { data: tools } = await api.getTools()

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <p className="text-lg">APIs</p>
      <DataTable columns={columns} data={tools} profile={profile} />
    </div>
  )
}
