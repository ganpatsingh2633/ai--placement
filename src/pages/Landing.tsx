import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: <GraduationCap size={22} />, title: 'Student Portal', desc: 'Track attendance, view marks, and download assignments in one place.' },
  { icon: <BookOpen size={22} />, title: 'Teacher Tools', desc: 'Manage attendance, upload marks, and share study materials effortlessly.' },
  { icon: <Shield size={22} />, title: 'Admin Control', desc: 'Full oversight of students, teachers, departments, and notices.' },
  { icon: <Users size={22} />, title: 'Unified Platform', desc: 'One system connecting students, teachers, and administrators.' },
];

const benefits = [
  'Eliminate manual paperwork',
  'Real-time attendance tracking',
  'Instant marks & results access',
  'Secure role-based login',
  'Centralized notice board',
  'Digital assignment management',
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">EduManager</span>
          </div>
          <Button onClick={() => navigate('/login')} size="sm">
            Sign In <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              College Management System
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-5">
              Streamline Your
              <span className="gradient-hero bg-clip-text text-transparent"> Academic </span>
              Operations
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              A centralized platform connecting students, teachers, and administrators to digitalize attendance, marks, assignments, and more.
            </p>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
                Get Started <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-3">Everything You Need</h2>
          <p className="text-muted-foreground max-w-md mx-auto">One platform to manage all academic and administrative processes efficiently.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="p-5 rounded-xl border border-border/60 bg-card shadow-card hover:shadow-elevated transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-card border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-3">
                Why Go Digital?
              </h2>
              <p className="text-muted-foreground mb-8">
                Replace manual paperwork with a modern, efficient system that saves time and reduces errors.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map(b => (
                  <div key={b} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-success shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="gradient-hero rounded-2xl p-8 lg:p-10 text-primary-foreground">
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-display font-bold">87%</p>
                  <p className="text-sm opacity-80">Reduction in paperwork</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold">3x</p>
                  <p className="text-sm opacity-80">Faster record management</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold">100%</p>
                  <p className="text-sm opacity-80">Transparent & accessible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">© 2026 EduManager. College Management System.</p>
      </footer>
    </div>
  );
}
