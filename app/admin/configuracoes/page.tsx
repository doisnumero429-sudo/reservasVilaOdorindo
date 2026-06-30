'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const toArr = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
const toStr = (a: any[] | null) => (a || []).join(', ');

export default function ConfiguracoesPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [rest, setRest] = useState<any>(null);
  const [rules, setRules] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('*').limit(1).maybeSingle();
    setRest(r);
    setRid(r?.id || null);
    if (r) {
      const { data: rl } = await supabase.from('reservation_rules').select('*').eq('restaurant_id', r.id).maybeSingle();
      setRules(rl || { restaurant_id: r.id });
      const { data: sec } = await supabase.from('sectors').select('*').eq('restaurant_id', r.id).order('sort_order');
      setSectors(sec || []);
      const { data: ds } = await supabase.from('restaurant_settings').select('value').eq('restaurant_id', r.id).eq('key', 'delivery_url').maybeSingle();
      setDeliveryUrl(typeof ds?.value === 'string' ? ds.value : '');
    }
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(''), 3000);
  }

  async function salvarUnidade() {
    const { id, created_at, updated_at, ...rest2 } = rest;
    await supabase.from('restaurants').update(rest2).eq('id', id);
    if (rid) await supabase.from('restaurant_settings').upsert({ restaurant_id: rid, key: 'delivery_url', value: deliveryUrl }, { onConflict: 'restaurant_id,key' });
    flash('Dados da unidade salvos.');
  }

  async function salvarRegras() {
    if (!rid) return;
    const payload = {
      restaurant_id: rid,
      lunch_enabled: rules.lunch_enabled,
      dinner_enabled: rules.dinner_enabled,
      lunch_times: rules.lunch_times || [],
      dinner_times: rules.dinner_times || [],
      min_people: Number(rules.min_people) || 1,
      max_people: Number(rules.max_people) || 20,
      tolerance_minutes: Number(rules.tolerance_minutes) || 15,
      large_group_threshold: Number(rules.large_group_threshold) || 12,
      large_group_message: rules.large_group_message || '',
      awareness_text: rules.awareness_text || '',
    };
    if (rules.id) await supabase.from('reservation_rules').update(payload).eq('id', rules.id);
    else await supabase.from('reservation_rules').insert(payload);
    flash('Regras de reserva salvas.');
    carregar();
  }

  async function salvarSetor(s: any) {
    const { id, restaurant_id, created_at, updated_at, ...rest2 } = s;
    await supabase.from('sectors').update(rest2).eq('id', id);
    flash('Setor salvo.');
  }
  async function addSetor() {
    if (!rid) return;
    const code = prompt('Código do setor (curto, sem espaços). Ex: varanda');
    if (!code) return;
    await supabase.from('sectors').insert({
      restaurant_id: rid,
      code: code.trim(),
      public_name: code.trim(),
      sort_order: sectors.length + 1,
      active: true,
      allow_reservation: true,
    });
    carregar();
  }

  if (!rest) return <AdminShell><p className="adm-sub">Carregando...</p></AdminShell>;

  return (
    <AdminShell>
      <h1 className="adm-h1">Configurações</h1>
      <p className="adm-sub">Dados da unidade, regras de reserva e setores.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Dados da unidade</h2>
        <div className="adm-grid">
          {[
            ['name', 'Nome'],
            ['short_name', 'Nome curto'],
            ['whatsapp_number', 'WhatsApp (só números, ex: 5518996524860)'],
            ['public_phone', 'Telefone público'],
            ['address', 'Endereço'],
            ['google_maps_url', 'Link do mapa (Google Maps)'],
            ['instagram_handle', 'Instagram (@)'],
            ['instagram_url', 'Link do Instagram'],
            ['timezone', 'Fuso horário'],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="adm-label">{label}</label>
              <input className="adm-input" value={rest[k] || ''} onChange={(e) => setRest({ ...rest, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <label className="adm-label">Link do cardápio / delivery (Goomer) — o Bento indica este link para pedidos</label>
        <input className="adm-input" value={deliveryUrl} onChange={(e) => setDeliveryUrl(e.target.value)} placeholder="https://villa-grill-restaurante.goomer.app/" />
        <div style={{ marginTop: 14 }}>
          <button className="adm-btn gold" onClick={salvarUnidade}>Salvar dados da unidade</button>
        </div>
      </div>

      {rules && (
        <div className="adm-card">
          <h2>Regras de reserva</h2>
          <div className="adm-row">
            <label><input type="checkbox" checked={!!rules.lunch_enabled} onChange={(e) => setRules({ ...rules, lunch_enabled: e.target.checked })} /> Almoço ativo</label>
            <label><input type="checkbox" checked={!!rules.dinner_enabled} onChange={(e) => setRules({ ...rules, dinner_enabled: e.target.checked })} /> Noite ativa</label>
          </div>
          <label className="adm-label">Horários do almoço (separados por vírgula)</label>
          <input className="adm-input" defaultValue={toStr(rules.lunch_times)} onBlur={(e) => setRules({ ...rules, lunch_times: toArr(e.target.value) })} />
          <label className="adm-label">Horários da noite (separados por vírgula)</label>
          <input className="adm-input" defaultValue={toStr(rules.dinner_times)} onBlur={(e) => setRules({ ...rules, dinner_times: toArr(e.target.value) })} />
          <div className="adm-grid">
            <div><label className="adm-label">Mínimo de pessoas</label><input className="adm-input" type="number" value={rules.min_people ?? 1} onChange={(e) => setRules({ ...rules, min_people: e.target.value })} /></div>
            <div><label className="adm-label">Máximo de pessoas</label><input className="adm-input" type="number" value={rules.max_people ?? 20} onChange={(e) => setRules({ ...rules, max_people: e.target.value })} /></div>
            <div><label className="adm-label">Tolerância de atraso (min)</label><input className="adm-input" type="number" value={rules.tolerance_minutes ?? 15} onChange={(e) => setRules({ ...rules, tolerance_minutes: e.target.value })} /></div>
            <div><label className="adm-label">Grupo grande a partir de</label><input className="adm-input" type="number" value={rules.large_group_threshold ?? 12} onChange={(e) => setRules({ ...rules, large_group_threshold: e.target.value })} /></div>
          </div>
          <label className="adm-label">Mensagem para grupo grande</label>
          <textarea className="adm-textarea" value={rules.large_group_message || ''} onChange={(e) => setRules({ ...rules, large_group_message: e.target.value })} />
          <label className="adm-label">Texto de ciência (regras da reserva)</label>
          <textarea className="adm-textarea" value={rules.awareness_text || ''} onChange={(e) => setRules({ ...rules, awareness_text: e.target.value })} />
          <div style={{ marginTop: 14 }}>
            <button className="adm-btn gold" onClick={salvarRegras}>Salvar regras</button>
          </div>
        </div>
      )}

      <div className="adm-card">
        <h2>Setores</h2>
        {sectors.map((s, i) => (
          <div key={s.id} className="adm-card" style={{ background: '#0b0907' }}>
            <div className="adm-grid">
              <div><label className="adm-label">Nome público</label><input className="adm-input" value={s.public_name || ''} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, public_name: e.target.value }; setSectors(n); }} /></div>
              <div><label className="adm-label">Nome interno</label><input className="adm-input" value={s.internal_name || ''} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, internal_name: e.target.value }; setSectors(n); }} /></div>
              <div><label className="adm-label">Capacidade</label><input className="adm-input" type="number" value={s.capacity ?? ''} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, capacity: e.target.value ? Number(e.target.value) : null }; setSectors(n); }} /></div>
              <div><label className="adm-label">Ordem</label><input className="adm-input" type="number" value={s.sort_order ?? 0} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, sort_order: Number(e.target.value) }; setSectors(n); }} /></div>
            </div>
            <div className="adm-row" style={{ marginTop: 8 }}>
              <label><input type="checkbox" checked={!!s.active} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, active: e.target.checked }; setSectors(n); }} /> Ativo</label>
              <label><input type="checkbox" checked={!!s.allow_reservation} onChange={(e) => { const n = [...sectors]; n[i] = { ...s, allow_reservation: e.target.checked }; setSectors(n); }} /> Permite reserva</label>
              <button className="adm-btn sm gold" onClick={() => salvarSetor(s)}>Salvar setor</button>
            </div>
          </div>
        ))}
        <button className="adm-btn" onClick={addSetor}>+ Adicionar setor</button>
      </div>
    </AdminShell>
  );
}
