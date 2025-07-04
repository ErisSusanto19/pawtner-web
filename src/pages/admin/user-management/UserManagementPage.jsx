import React, { useState, useEffect, useMemo } from 'react';
import UserFilters from './UserFilters';
import UsersTable from './UsersTable';

export const mockUsers = [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      name: 'Eris Susanto',
      email: 'erissusanto997@gmail.com',
      phone_number: '081234567890',
      image_url: 'https://i.pravatar.cc/150?u=a1b2c3d4',
      is_verified: true,
      role: 'business_owner',
      auth_provider: 'local',
      created_at: '2023-10-26T10:00:00Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
      name: 'Budi Doremi',
      email: 'budi.do@example.com',
      phone_number: '082345678901',
      image_url: 'https://i.pravatar.cc/150?u=b2c3d4e5',
      is_verified: false,
      role: 'customer',
      auth_provider: 'google',
      created_at: '2023-10-25T11:30:00Z',
    },
    {
      id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
      name: 'Citra Kirana',
      email: 'citra.ki@example.com',
      phone_number: null,
      image_url: 'https://i.pravatar.cc/150?u=c3d4e5f6',
      is_verified: true,
      role: 'customer',
      auth_provider: 'local',
      created_at: '2023-10-24T09:00:00Z',
    },
      {
      id: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
      name: 'David Guetta',
      email: 'dave.g@example.com',
      phone_number: '085678901234',
      image_url: null,
      is_verified: false,
      role: 'business_owner',
      auth_provider: 'local',
      created_at: '2023-10-22T14:00:00Z',
    },
]

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    is_verified: 'all',
  })

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  const handleAction = (action, userId) => {
      console.log(`Action: ${action} on user ID: ${userId}`)
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = filters.search.toLowerCase()
      
      const matchesSearch = user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesVerification = filters.is_verified === 'all' || String(user.is_verified) === filters.is_verified;
      
      return matchesSearch && matchesRole && matchesVerification;
    })
  }, [users, filters])

  if (isLoading) {
    return <p>Loading users...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <UserFilters filters={filters} onFilterChange={handleFilterChange} />

      <UsersTable users={filteredUsers} onAction={handleAction}/>
      
      {/* Komponen Pagination */}
    </div>
  )
}

export default UserManagementPage
