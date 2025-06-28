// Predefined admin accounts with direct access
export interface AdminAccount {
  email: string
  password: string
  profile: {
    id: string
    email: string
    role: 'admin'
    approval_status: 'approved'
    first_name: string
    last_name: string
    phone_number?: string
    organization?: string
    badge_number?: string
    created_at: string
    updated_at: string
  }
}

// Predefined admin accounts - these can sign in directly without registration
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: 'evaoloo2008@gmail.com',
    password: 'eva2008',
    profile: {
      id: 'admin-eva-001',
      email: 'evaoloo2008@gmail.com',
      role: 'admin',
      approval_status: 'approved',
      first_name: 'Eva',
      last_name: 'Oloo',
      phone_number: null,
      organization: 'Everlasting Kin Administration',
      badge_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    email: 'experteacademiahelp@gmail.com',
    password: '020191',
    profile: {
      id: 'admin-expert-001',
      email: 'experteacademiahelp@gmail.com',
      role: 'admin',
      approval_status: 'approved',
      first_name: 'Expert',
      last_name: 'Academia',
      phone_number: null,
      organization: 'Everlasting Kin Administration',
      badge_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
]

// Check if an email is a predefined admin account
export const isAdminAccount = (email: string): boolean => {
  return ADMIN_ACCOUNTS.some(admin => admin.email.toLowerCase() === email.toLowerCase())
}

// Get admin account by email
export const getAdminAccount = (email: string): AdminAccount | null => {
  return ADMIN_ACCOUNTS.find(admin => admin.email.toLowerCase() === email.toLowerCase()) || null
}

// Validate admin credentials
export const validateAdminCredentials = (email: string, password: string): AdminAccount | null => {
  const admin = getAdminAccount(email)
  if (admin && admin.password === password) {
    return admin
  }
  return null
}