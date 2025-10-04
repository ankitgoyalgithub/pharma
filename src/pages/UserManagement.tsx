import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Edit, 
  Lock, 
  Unlock,
  RotateCcw,
  Mail,
  X,
  CheckCircle,
  Clock,
  Search,
  Shield,
  User,
  Eye,
  ArrowLeft
} from 'lucide-react';

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'Karthik V',
      email: 'karthik@divislabs',
      role: 'Admin',
      status: 'active',
      lastLogin: '2 hours ago',
      permissions: ['Can Run Studies', 'Can Edit Workflows', 'Can Add Users']
    },
    {
      id: 2,
      name: 'Ankit Goyal',
      email: 'ankit@3scsolutions',
      role: 'Planner',
      status: 'active',
      lastLogin: '1 day ago',
      permissions: ['Can Run Studies', 'Can Edit Workflows']
    },
    {
      id: 3,
      name: 'Pooja R',
      email: 'pooja@acme.com',
      role: 'Viewer',
      status: 'invited',
      lastLogin: 'Never',
      permissions: ['Can Run Studies']
    },
    {
      id: 4,
      name: 'Raj Kumar',
      email: 'raj@divislabs',
      role: 'Planner',
      status: 'blocked',
      lastLogin: '1 week ago',
      permissions: ['Can Run Studies']
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: 'User Created',
      user: 'Karthik V',
      target: 'Pooja R',
      timestamp: '2024-07-19 14:30:00',
      details: 'Created new user with Viewer role'
    },
    {
      id: 2,
      action: 'Role Changed',
      user: 'Karthik V',
      target: 'Ankit Goyal',
      timestamp: '2024-07-18 16:45:00',
      details: 'Changed role from Viewer to Planner'
    },
    {
      id: 3,
      action: 'User Login',
      user: 'Ankit Goyal',
      target: 'Self',
      timestamp: '2024-07-18 09:15:00',
      details: 'Successful login from 192.168.1.100'
    },
    {
      id: 4,
      action: 'User Blocked',
      user: 'Karthik V',
      target: 'Raj Kumar',
      timestamp: '2024-07-17 11:20:00',
      details: 'User blocked due to policy violation'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      invited: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      blocked: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const icons: Record<string, React.ReactNode> = {
      active: <CheckCircle className="h-3 w-3" />,
      invited: <Clock className="h-3 w-3" />,
      blocked: <Lock className="h-3 w-3" />
    };

    return (
      <Badge variant="outline" className={variants[status] || ''}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'Planner':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'Viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-muted-foreground">Manage Users & Roles</p>
            </div>
          </div>
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Login</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                <span className="text-primary-foreground font-medium text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.permissions.join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-foreground">{user.email}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <span className="text-foreground">{user.role}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                          <td className="py-4 px-4 text-foreground">{user.lastLogin}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.status === 'active' ? (
                                <Button variant="ghost" size="sm">
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : user.status === 'blocked' ? (
                                <Button variant="ghost" size="sm">
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Role Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">1</div>
                      <div className="text-sm text-muted-foreground">Admins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Edit className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">2</div>
                      <div className="text-sm text-muted-foreground">Planners</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-500/10">
                      <Eye className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">1</div>
                      <div className="text-sm text-muted-foreground">Viewers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-secondary/50">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{log.action}</span>
                          <Badge variant="outline" className="text-xs">{log.user}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Target: {log.target}</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;