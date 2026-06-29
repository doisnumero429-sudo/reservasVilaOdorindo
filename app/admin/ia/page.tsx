'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function IaPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [a, setA] = useState<any>({
    enabled: true,
    mode: 'hibrido',
    cascade_config: { cheap_model: '', mid_model: '', strong_model: '', timeout_ms: 12000, cost_limit_usd: 5 },
    system_prompt: '',
    fallback_message: '',
    human_transfer_message: '',
    max_tokens: 400,
    temperature: 0.6,
  });
  const [msg, setMsg] = useState('');
  const [teste, setTeste] = useState('');
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    (async () => {
      const { data: rest } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
      setRid(rest?.id || null);
      const { data } = await supabase.from('ai_settings').select('*').maybeSingle();
      if (data) setA({ ...a, ...data, cascade_config: { ...a.cascade_config, ...(data.cascade_config || {}) } });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(''), 3000);
  }
  function setCascade(k: string, v: any) {
    setA({ ...a, cascade_config: { ...a.cascade_config, [k]: v } });
  }

  async function salvar() {
    if (!rid) return;
    const { id, created_at, updated_at, ...rest } = a;
    await supabase.from('ai_settings').upsert({ restaurant_id: rid, ...rest }, { onConflict: 'restaurant_id' });
    flash('Configurações salvas.');
  }

  async function testarLorena() {
    if (!teste.trim()) return;
    setResposta('Pensando...');
    const r = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: teste }] }),
    }).then((r) => r.json());
    setResposta(r.ok ? `(${r.step}${r.model ? ' · ' + r.model : ''}) ${r.reply}` : 'Erro: ' + r.error);
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">IA (Lorena)</h1>
      <p className="adm-sub">A chave da OpenRouter fica só no servidor. O cliente nunca a vê.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Geral</h2>
        <label>
          <input type="checkbox" checked={a.enabled} onChange={(e) => setA({ ...a, enabled: e.target.checked })} /> IA ativada
        </label>
        <label className="adm-label">Modo</label>
        <select className="adm-select" style={{ maxWidth: 280 }} value={a.mode} onChange={(e) => setA({ ...a, mode: e.target.value })}>
          <option value="local">Regras locais (sem OpenRouter)</option>
          <option value="hibrido">Híbrido (local + OpenRouter)</option>
          <option value="openrouter">OpenRouter</option>
        </select>
      </div>

      <div className="adm-card">
        <h2>Cascata de modelos (OpenRouter)</h2>
        <p className="adm-sub">Tenta do mais barato ao mais forte. Use os nomes da OpenRouter (ex.: openai/gpt-4o-mini).</p>
        <div className="adm-grid">
          <div>
            <label className="adm-label">Modelo barato (etapa 1)</label>
            <input className="adm-input" value={a.cascade_config.cheap_model || ''} onChange={(e) => setCascade('cheap_model', e.target.value)} />
          </div>
          <div>
            <label className="adm-label">Modelo intermediário (etapa 2)</label>
            <input className="adm-input" value={a.cascade_config.mid_model || ''} onChange={(e) => setCascade('mid_model', e.target.value)} />
          </div>
          <div>
            <label className="adm-label">Modelo forte (etapa 3)</label>
            <input className="adm-input" value={a.cascade_config.strong_model || ''} onChange={(e) => setCascade('strong_model', e.target.value)} />
          </div>
          <div>
            <label className="adm-label">Timeout (ms)</label>
            <input className="adm-input" type="number" value={a.cascade_config.timeout_ms || 12000} onChange={(e) => setCascade('timeout_ms', Number(e.target.value))} />
          </div>
          <div>
            <label className="adm-label">Limite de custo (USD)</label>
            <input className="adm-input" type="number" value={a.cascade_config.cost_limit_usd || 5} onChange={(e) => setCascade('cost_limit_usd', Number(e.target.value))} />
          </div>
          <div>
            <label className="adm-label">Limite de chamadas por dia</label>
            <input className="adm-input" type="number" value={a.cascade_config.daily_call_limit ?? 900} onChange={(e) => setCascade('daily_call_limit', Number(e.target.value))} />
          </div>
          <div>
            <label className="adm-label">Limite por minuto</label>
            <input className="adm-input" type="number" value={a.cascade_config.per_minute_limit ?? 18} onChange={(e) => setCascade('per_minute_limit', Number(e.target.value))} />
          </div>
        </div>
        <label style={{ display: 'block', marginTop: 10 }}>
          <input type="checkbox" checked={a.cascade_config.cache_enabled !== false} onChange={(e) => setCascade('cache_enabled', e.target.checked)} /> Cache de respostas frequentes (economiza requisições)
        </label>
        <p className="adm-sub" style={{ marginTop: 6 }}>
          Dica: o modelo da etapa 1 pode ser um modelo grátis da OpenRouter (nome terminando em <b>:free</b>).
          O grátis tem limites (≈20/min e 50/dia, ou 1000/dia com US$ 10 em créditos). Os limites acima protegem você.
        </p>
      </div>

      <div className="adm-card">
        <h2>Parâmetros e mensagens</h2>
        <div className="adm-grid">
          <div>
            <label className="adm-label">Máx. tokens</label>
            <input className="adm-input" type="number" value={a.max_tokens} onChange={(e) => setA({ ...a, max_tokens: Number(e.target.value) })} />
          </div>
          <div>
            <label className="adm-label">Temperatura</label>
            <input className="adm-input" type="number" step="0.1" value={a.temperature} onChange={(e) => setA({ ...a, temperature: Number(e.target.value) })} />
          </div>
        </div>
        <label className="adm-label">Prompt do sistema (deixe vazio para usar o padrão)</label>
        <textarea className="adm-textarea" value={a.system_prompt || ''} onChange={(e) => setA({ ...a, system_prompt: e.target.value })} />
        <label className="adm-label">Mensagem de fallback</label>
        <input className="adm-input" value={a.fallback_message || ''} onChange={(e) => setA({ ...a, fallback_message: e.target.value })} />
        <label className="adm-label">Mensagem para transferir a humano</label>
        <input className="adm-input" value={a.human_transfer_message || ''} onChange={(e) => setA({ ...a, human_transfer_message: e.target.value })} />
      </div>

      <div className="adm-row">
        <button className="adm-btn gold" onClick={salvar}>
          Salvar configurações
        </button>
      </div>

      <div className="adm-card" style={{ marginTop: 16 }}>
        <h2>Testar Lorena</h2>
        <div className="adm-row">
          <input className="adm-input" style={{ maxWidth: 360 }} placeholder="Digite uma pergunta de cliente" value={teste} onChange={(e) => setTeste(e.target.value)} />
          <button className="adm-btn" onClick={testarLorena}>
            Enviar
          </button>
        </div>
        {resposta && <p style={{ marginTop: 12 }}>{resposta}</p>}
      </div>
    </AdminShell>
  );
}
