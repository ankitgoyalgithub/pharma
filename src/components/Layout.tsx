import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Bot, 
  Database,
  ChevronLeft,
  ChevronRight,
  Settings,
  Moon,
  Sun,
  Wrench,
  Users,
  User,
  LogOut,
  CreditCard,
  ChevronDown,
  Bell,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TopbarStepper } from "@/components/ModernStepper";
import { useStepperContext } from "@/contexts/StepperContext";

const navigation = [
  { name: "SynQAI", href: "/", icon: Bot },
  { name: "Study", href: "/study", icon: LayoutDashboard },
  { name: "Foundry", href: "/foundry", icon: Database },
  { name: "Workflows", href: "/workflows", icon: Wrench },
  { name: "Build", href: "/build", icon: Settings },
  { name: "Jobs", href: "/jobs", icon: Clock },
];

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { steps, title, showStepper, onStepClick } = useStepperContext();

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
  };

  const userInfo = {
    name: "Karthik V",
    company: "Divi's Labs",
    avatar: "KV"
  };

  const notifications = [
    { id: 1, title: "Forecast job complete", time: "2 min ago", type: "success" },
    { id: 2, title: "Foundry Data Synced", time: "5 min ago", type: "success" },
    { id: 3, title: "Data health alert: Missing values detected", time: "10 min ago", type: "warning" },
    { id: 4, title: "Production scheduling completed", time: "15 min ago", type: "success" },
  ];

  // Listen for auto-collapse events from usecase pages
  useEffect(() => {
    const handleCollapse = () => setSidebarCollapsed(true);
    window.addEventListener('collapseSidebar', handleCollapse);
    return () => window.removeEventListener('collapseSidebar', handleCollapse);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/20">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <span className="font-semibold text-lg text-foreground">UpSynq</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0 hover:bg-secondary hover:text-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-secondary hover:text-foreground",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className={cn("h-5 w-5", sidebarCollapsed ? "mx-auto" : "mr-3")} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Theme switcher at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "w-full justify-start hover:bg-secondary hover:text-foreground",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            {theme === "dark" ? <Sun className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} /> : <Moon className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />}
            {!sidebarCollapsed && <span>Toggle Theme</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "ml-16" : "ml-64")}>
        {/* Fixed Top navigation bar with stepper and user dropdown */}
        <div className={cn(
          "fixed top-0 right-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur-md flex items-center justify-between px-6 glaze-subtle transition-all duration-300",
          sidebarCollapsed ? "left-16" : "left-64"
        )}>
          {/* Left side - Stepper */}
          <div className="flex-1">
            {showStepper && (
              <TopbarStepper steps={steps} title={title} compact={sidebarCollapsed} onStepClick={onStepClick} />
            )}
          </div>
          
          {/* Right side - Notifications and User dropdown */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-3 py-2 border-b border-border">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1",
                          notification.type === "success" ? "bg-green-500" : "bg-yellow-500"
                        )} />
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-10">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">{userInfo.avatar}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{userInfo.name}</div>
                    <div className="text-xs text-muted-foreground">{userInfo.company}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        
        {/* Main content area with padding for fixed header */}
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};