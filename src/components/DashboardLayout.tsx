import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, Bell, FileText,
  BarChart3, Settings, LogOut, GraduationCap, UserCog, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navByRole: Record<string, NavItem[]> = {
  student: [
    { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} /> },
    { label: 'Attendance', path: '/student/attendance', icon: <ClipboardList size={18} /> },
    { label: 'Marks', path: '/student/marks', icon: <BarChart3 size={18} /> },
    { label: 'Assignments', path: '/student/assignments', icon: <FileText size={18} /> },
    { label: 'Notices', path: '/student/notices', icon: <Bell size={18} /> },
  ],
  teacher: [
    { label: 'Dashboard', path: '/teacher', icon: <LayoutDashboard size={18} /> },
    { label: 'Attendance', path: '/teacher/attendance', icon: <ClipboardList size={18} /> },
    { label: 'Marks', path: '/teacher/marks', icon: <BarChart3 size={18} /> },
    { label: 'Assignments', path: '/teacher/assignments', icon: <FileText size={18} /> },
    { label: 'Students', path: '/teacher/students', icon: <Users size={18} /> },
    { label: 'Notices', path: '/teacher/notices', icon: <Bell size={18} /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Students', path: '/admin/students', icon: <GraduationCap size={18} /> },
    { label: 'Teachers', path: '/admin/teachers', icon: <UserCog size={18} /> },
    { label: 'Departments', path: '/admin/departments', icon: <BookOpen size={18} /> },
    { label: 'Notices', path: '/admin/notices', icon: <Bell size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!profile) return null;

  const navItems = navByRole[profile.role] || [];
  const initials = profile.full_name.split(' ').map(n => n[0]).join('');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-sidebar-primary-foreground">EduManager</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-primary-foreground text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{profile.full_name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 capitalize">{profile.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 mt-1"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
