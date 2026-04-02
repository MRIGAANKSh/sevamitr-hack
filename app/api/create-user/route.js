import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const { email, password, department } = await req.json()

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1. Create auth user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    return Response.json({ error: error.message })
  }

  // 2. Insert into users table
  await supabaseAdmin.from('users').insert({
    id: data.user.id,
    email,
    role: 'dept_admin',
    department
  })

  return Response.json({ message: "User created" })
}