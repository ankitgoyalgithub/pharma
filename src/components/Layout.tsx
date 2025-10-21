import { useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  Database,
  Settings,
  Moon,
  Sun,
  Wrench,
  User,
  LogOut,
  CreditCard,
  ChevronDown,
  Bell,
  Clock,
  BarChart3,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TopbarStepper } from "@/components/ModernStepper";
import { useStepperContext } from "@/contexts/StepperContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { name: "SynQAI", href: "/", icon: Bot, iconColor: "text-[hsl(225,84%,55%)]" },
  { name: "Study", href: "/study", icon: LayoutDashboard, iconColor: "text-[hsl(158,70%,45%)]" },
  { name: "Foundry", href: "/foundry", icon: Database, iconColor: "text-[hsl(280,65%,55%)]" },
  { name: "Workflows", href: "/workflows", icon: Wrench, iconColor: "text-[hsl(25,85%,55%)]" },
  { name: "Reports", href: "/reports", icon: BarChart3, iconColor: "text-[hsl(142,72%,29%)]" },
  { name: "Build", href: "/build", icon: Settings, iconColor: "text-[hsl(210,85%,55%)]" },
  { name: "Jobs", href: "/jobs", icon: Clock, iconColor: "text-[hsl(32,95%,44%)]" },
];

const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;
  const { setOpen } = useSidebar();

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-border" collapsible="offcanvas">
      {/* Logo Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">U</span>
          </div>
          <span className="font-semibold text-lg text-foreground">UpSynq</span>
        </div>
      </div>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.href)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      "hover:bg-primary-hover-subtle hover:scale-105",
                      isActive(item.href) && "bg-primary-hover-subtle border-l-4 border-primary font-semibold"
                    )}
                  >
                    <NavLink to={item.href}>
                      <item.icon className={cn("h-5 w-5 mr-3", item.iconColor)} />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Switcher */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start hover:bg-muted-hover transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            <span>Toggle Theme</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const TopBar = ({ topbarRef }: { topbarRef: React.RefObject<HTMLDivElement> }) => {
  const navigate = useNavigate();
  const { steps, title, showStepper, onStepClick } = useStepperContext();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
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

  return (
    <div ref={topbarRef} className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left side - Hamburger + Stepper */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-10 w-10 p-0 hover:bg-muted-hover"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {showStepper && (
          <TopbarStepper steps={steps} title={title} onStepClick={onStepClick} />
        )}
      </div>
      
      {/* Right side - Notifications and User dropdown */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 hover:bg-muted-hover">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
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
            <Button variant="ghost" className="flex items-center gap-3 h-10 hover:bg-muted-hover">
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
  );
};

export const Layout = () => {
  const topbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVar = () => {
      const h = topbarRef.current?.offsetHeight ?? 64;
      document.documentElement.style.setProperty("--topbar-height", `${h}px`);
    };
    updateVar();
    window.addEventListener("resize", updateVar);
    return () => window.removeEventListener("resize", updateVar);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/95 to-secondary/20">
        <AppSidebar />
        
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar topbarRef={topbarRef} />
          
          {/* Main content area with padding for fixed header */}
          <main className="flex-1 min-w-0 overflow-x-hidden" style={{ paddingTop: "var(--topbar-height, 64px)" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};