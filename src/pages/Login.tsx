import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, User, BookOpen, Shield } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'student' | 'teacher' | 'admin';

const roles: { role: Role; label: string; icon: React.ReactNode; color: string }[] = [
  { role: 'student', label: 'Student', icon: <User size={20} />, color: 'bg-primary/10 text-primary border-primary/20' },
  { role: 'teacher', label: 'Teacher', icon: <BookOpen size={20} />, color: 'bg-accent/10 text-accent border-accent/20' },
  { role: 'admin', label: 'Admin', icon: <Shield size={20} />, color: 'bg-success/10 text-success border-success/20' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, {
        full_name: fullName,
        role: selectedRole,
        department: department || undefined,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Check your email to confirm.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate(`/${selectedRole}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <span className="font-display font-bold text-xl">EduManager</span>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Welcome to Your College Portal</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Access attendance records, marks, assignments, and notices all in one centralized platform.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-elevated border-border/60">
          <CardHeader className="text-center pb-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 lg:hidden">
              <GraduationCap size={20} className="text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-xl">{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Register with your college credentials' : 'Select your role and enter your credentials'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedRole === r.role
                      ? `${r.color} border-current`
                      : 'border-border/60 text-muted-foreground hover:border-border'
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept">Department</Label>
                    <Input id="dept" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : `Sign In as ${roles.find(r => r.role === selectedRole)?.label}`}
              </Button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
