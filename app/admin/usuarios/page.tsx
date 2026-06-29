'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const ROLES: Record<string, string> = { owner: 'Dono', manager: 'Gerente', reception: 'Recepção', viewer: 'Visualizador' };

export default function UsuariosPage() {
  const supabase = supabaseBrowser();
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'reception' });
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);

  const carregar = useCallback(async () => {
    const { data } = await supabase.from('admin_users').select('*').order('created_at');
    setUsers(data || []);
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string, ok = true) { setMsg({ t, ok }); setTimeout(() => setMsg(null), 4000); }

  async function alterar(id: string, campo: string, valor: any) {
    await supabase.from('admin_users').update({ [campo]: valor }).eq('id', id);
    carregar();
  }

  async function criar() {
    if (!form.email || !form.password) return flash('Informe e-mail e senha.', false);
    const r = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then((r) => r.json());
    if (r.ok) {
      flash('Usuário criado!');
      setForm({ email: '', password: '', name: '', role: 'reception' });
      carregar();
    } else {
      flash('Erro: ' + r.error, false);
    }
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Usuários</h1>
      <p className="adm-sub">Administradores e permissões. Só dono/gerente podem criar usuários.</p>
      {msg && <div className={`adm-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.t}</div>}

      <div className="adm-card">
        <h2>Novo administrador</h2>
        <div className="adm-grid">
          <div><label className="adm-label">Nome</label><input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="adm-label">E-mail</label><input className="adm-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="adm-label">Senha (mín. 6)</label><input className="adm-input" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div><label className="adm-label">Função</label>
            <select className="adm-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 14 }}><button className="adm-btn gold" onClick={criar}>Criar usuário</button></div>
      </div>

      <div className="adm-card">
        <h2>Administradores</h2>
        {users.length === 0 ? <p className="adm-sub">Nenhum usuário (crie o primeiro pelo Supabase — veja o README).</p> : (
          <table className="adm-table">
            <thead><tr><th>Nome</th><th>Função</th><th>Ativo</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name || '—'}</td>
                  <td>
                    <select className="adm-select" style={{ maxWidth: 160 }} value={u.role} onChange={(e) => alterar(u.id, 'role', e.target.value)}>
                      {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td><input type="checkbox" checked={!!u.active} onChange={(e) => alterar(u.id, 'active', e.target.checked)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
