import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 🔐 Get logged-in user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: req.headers.get("authorization"),
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // 📥 Get dept admin info
    const { data: adminData } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (adminData.role !== "dept_admin") {
      return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403 })
    }

    // 1️⃣ Create worker in auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    // 2️⃣ Insert into workers table
    await supabaseAdmin.from("workers").insert({
      id: data.user.id,
      email,
      department: adminData.department,
      created_by: adminData.id
    })

    return new Response(JSON.stringify({ message: "Worker created" }), { status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}