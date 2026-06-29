'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro('E-mail ou senha incorretos.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="adm-login">
      <div className="adm-brand" style={{ textAlign: 'center' }}>
        Villa Grill
        <small>Acesso do administrador</small>
      </div>
      <form className="adm-card" onSubmit={entrar}>
        {erro && <div className="adm-msg err">{erro}</div>}
        <label className="adm-label">E-mail</label>
        <input
          className="adm-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <label className="adm-label">Senha</label>
        <input
          className="adm-input"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div style={{ marginTop: 18 }}>
          <button className="adm-btn gold" type="submit" disabled={carregando} style={{ width: '100%' }}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
