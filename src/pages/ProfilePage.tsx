import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, CreditCard, Phone, Calendar, Shield, LogOut, Edit, Lock, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, logout, updateUserProfile } = useApp();
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  if (!user) return null;

  const handleChangePassword = () => {
    if (newPass.length < 6) { setPassMsg('Password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { setPassMsg('Passwords do not match'); return; }
    // Update in savedUsers
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const idx = savedUsers.findIndex((u: { email: string }) => u.email === user.email);
    if (idx >= 0) savedUsers[idx].password = newPass;
    localStorage.setItem('surya_users', JSON.stringify(savedUsers));
    setPassMsg('Password changed successfully!');
    setTimeout(() => { setEditingPassword(false); setPassMsg(''); setCurrentPass(''); setNewPass(''); setConfirmPass(''); }, 1500);
  };

  const fields: [typeof User, string, string][] = [
    [User, 'Full Name', user.name],
    [Phone, 'Mobile', user.phone],
    [Calendar, 'Date of Birth', user.dob],
    [CreditCard, 'PAN', user.pan],
    [Shield, 'Aadhaar', user.aadhaar.replace(/\d(?=\d{4})/g, '•')],
  ];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="flex items-center gap-4 bg-card border rounded-2xl p-5 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">{user.name.charAt(0)}</div>
        <div>
          <p className="font-bold text-lg">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded font-semibold mt-1 inline-block ${user.kycStatus === 'approved' ? 'bg-gain/10 text-gain' : 'bg-warning/10 text-warning'}`}>KYC {user.kycStatus}</span>
        </div>
        <Link to="/settings" className="ml-auto p-2 rounded-lg hover:bg-muted"><Edit className="w-4 h-4" /></Link>
      </div>

      <div className="bg-card border rounded-2xl p-5 mb-4">
        <h3 className="font-bold mb-4">Account Details</h3>
        <div className="space-y-3">
          {fields.map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b last:border-0">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium text-sm">{value}</p></div>
            </div>
          ))}
        </div>
      </div>

      {user.nominee && (
        <div className="bg-card border rounded-2xl p-5 mb-4">
          <h3 className="font-bold mb-3">Nominee Details</h3>
          <p className="font-medium">{user.nominee.name}</p>
          <p className="text-sm text-muted-foreground">{user.nominee.relation} · DOB: {user.nominee.dob}</p>
        </div>
      )}

      <div className="bg-card border rounded-2xl p-5 mb-4">
        <h3 className="font-bold mb-3">Virtual Account</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-xl p-3"><p className="text-xs text-muted-foreground">Available Balance</p><p className="font-bold text-primary">₹{(user.virtualBalance).toLocaleString('en-IN', {maximumFractionDigits: 0})}</p></div>
          <div className="bg-muted/40 rounded-xl p-3"><p className="text-xs text-muted-foreground">Account Type</p><p className="font-bold">Paper Trading</p></div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card border rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /><h3 className="font-bold">Change Password</h3></div>
          {!editingPassword && <Button size="sm" variant="outline" onClick={() => setEditingPassword(true)}>Change</Button>}
        </div>
        {editingPassword && (
          <div className="space-y-3">
            <div><Label className="text-xs">Current Password</Label><Input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">New Password</Label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Confirm New Password</Label><Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="mt-1" /></div>
            {passMsg && <p className={`text-xs ${passMsg.includes('success') ? 'text-gain' : 'text-loss'}`}>{passMsg}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleChangePassword}><Save className="w-3 h-3 mr-1" />Save</Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingPassword(false); setPassMsg(''); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
            </div>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
    </div>
  );
}
