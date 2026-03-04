import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { TrendingUp, User, Mail, Phone, Lock, Calendar, CreditCard, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STEPS = ['Personal Info', 'KYC Details', 'Set Password'];

export default function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'male' as 'male' | 'female' | 'other',
    pan: '', aadhaar: '', password: '', confirmPassword: '',
    nomineeName: '', nomineeRelation: '', nomineeDob: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.email.includes('@')) e.email = 'Valid email required';
      if (form.phone.length !== 10) e.phone = '10-digit phone required';
      if (!form.dob) e.dob = 'Date of birth required';
    }
    if (step === 1) {
      if (form.pan.length !== 10) e.pan = 'Valid PAN (10 chars) required';
      if (form.aadhaar.replace(/-/g, '').length !== 12) e.aadhaar = 'Valid 12-digit Aadhaar required';
    }
    if (step === 2) {
      if (form.password.length < 8) e.password = 'Min 8 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validate()) return;
    signup({
      name: form.name, email: form.email, phone: form.phone, dob: form.dob, gender: form.gender,
      pan: form.pan.toUpperCase(), aadhaar: form.aadhaar,
      nominee: form.nomineeName ? { name: form.nomineeName, relation: form.nomineeRelation, dob: form.nomineeDob } : undefined,
    }, form.password);
    setDone(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Account Created!</h2>
        <p className="text-muted-foreground">You have ₹10,00,000 virtual balance to start trading.</p>
        <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Surya Broker</span>
        </div>

        <h2 className="text-2xl font-bold mb-1">Create Account</h2>
        <p className="text-muted-foreground mb-6">Start paper trading with ₹10 Lakh virtual balance</p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
              <p className={`text-xs mt-1.5 font-medium ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <>
              <div>
                <Label>Full Name *</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="As per Aadhaar" className="pl-9" />
                </div>
                {errors.name && <p className="text-xs text-loss mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="pl-9" />
                </div>
                {errors.email && <p className="text-xs text-loss mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" className="pl-9" />
                </div>
                {errors.phone && <p className="text-xs text-loss mt-1">{errors.phone}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date of Birth *</Label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className="pl-9" />
                  </div>
                  {errors.dob && <p className="text-xs text-loss mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={v => update('gender', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-sm text-muted-foreground">
                🔒 Your KYC details are stored locally and used only for simulation purposes.
              </div>
              <div>
                <Label>PAN Number *</Label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" className="pl-9 uppercase" />
                </div>
                {errors.pan && <p className="text-xs text-loss mt-1">{errors.pan}</p>}
              </div>
              <div>
                <Label>Aadhaar Number *</Label>
                <Input value={form.aadhaar} onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 12);
                  update('aadhaar', v.replace(/(\d{4})(?=\d)/g, '$1-'));
                }} placeholder="XXXX-XXXX-XXXX" />
                {errors.aadhaar && <p className="text-xs text-loss mt-1">{errors.aadhaar}</p>}
              </div>
              <div className="border-t pt-4">
                <p className="font-medium text-sm mb-3">Nominee Details (Optional)</p>
                <div className="space-y-3">
                  <Input value={form.nomineeName} onChange={e => update('nomineeName', e.target.value)} placeholder="Nominee Name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={form.nomineeRelation} onChange={e => update('nomineeRelation', e.target.value)} placeholder="Relation (Spouse, Parent...)" />
                    <Input type="date" value={form.nomineeDob} onChange={e => update('nomineeDob', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>Password *</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 8 characters" className="pl-9 pr-9" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPass ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-loss mt-1">{errors.password}</p>}
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Re-enter password" className="pl-9" />
                </div>
                {errors.confirmPassword && <p className="text-xs text-loss mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="bg-muted/50 rounded-xl p-3 space-y-1 text-sm">
                <p className="font-medium">Account Summary</p>
                <p className="text-muted-foreground">Name: {form.name}</p>
                <p className="text-muted-foreground">Email: {form.email}</p>
                <p className="text-muted-foreground">Starting Balance: <span className="text-primary font-semibold">₹10,00,000</span></p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {step > 0 && <Button variant="outline" onClick={prev} className="flex-1">Back</Button>}
          {step < 2 ? (
            <Button onClick={next} className="flex-1">Continue →</Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1">🎉 Create Account</Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
