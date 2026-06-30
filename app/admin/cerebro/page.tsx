'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { defaultBrain, validateBrain, TRAINING_PROMPT, Brain } from '@/lib/brain';

function baixar(nome: string, conteudo: string) {
  const blob = new Blob([conteudo], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function CerebroPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [brain, setBrain] = useState<Brain>(defaultBrain());
  const [versoes, setVersoes] = useState<any[]>([]);
  const [preview, setPreview] = useState<{ cerebro: Brain; errors: string[] } | null>(null);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
    setRid(r?.id || null);
    if (!r) return;
    const { data: ativo } = await supabase.from('ai_brain').select('data').eq('restaurant_id', r.id).eq('active', true).maybeSingle();
    if (ativo?.data) setBrain(ativo.data as Brain);
    const { data: vs } = await supabase.from('ai_brain').select('id,version,active,note,created_at').eq('restaurant_id', r.id).order('version', { ascending: false });
    setVersoes(vs || []);
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string, ok = true) { setMsg({ t, ok }); setTimeout(() => setMsg(null), 5000); }

  function exportar() {
    const obj = {
      _LEIA: 'Cole TODO este conteúdo no ChatGPT. Ele vai te entrevistar e devolver um cérebro MAIOR. Depois, importe o arquivo que ele gerar.',
      _INSTRUCOES_CHATGPT: TRAINING_PROMPT,
      gerado_em: new Date().toISOString(),
      cerebro_atual: brain,
    };
    baixar(`cerebro-bento-v${brain.version}.json`, JSON.stringify(obj, null, 2));
    flash('Cérebro exportado. Abra o arquivo e cole no ChatGPT.');
  }

  async function copiarComando() {
    const txt = TRAINING_PROMPT + '\n\n```json\n' + JSON.stringify({ cerebro_atual: brain }, null, 2) + '\n```';
    try { await navigator.clipboard.writeText(txt); flash('Comando + cérebro copiados! Cole no ChatGPT.'); }
    catch { flash('Não consegui copiar. Use o botão Exportar.', false); }
  }

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const cerebro = (parsed.cerebro_atual || parsed) as Brain;
        const v = validateBrain(cerebro);
        setPreview({ cerebro, errors: v.errors });
        if (!v.ok) flash('Arquivo tem erros — veja abaixo. Não foi publicado.', false);
        else flash('Arquivo válido! Confira a prévia e clique em Publicar.');
      } catch (e: any) {
        setPreview(null);
        flash('Não consegui ler o arquivo (JSON inválido).', false);
      }
    };
    reader.readAsText(file);
  }

  async function publicar() {
    if (!rid || !preview || preview.errors.length) return;
    const novaVersao = (versoes[0]?.version || brain.version || 0) + 1;
    const data = { ...preview.cerebro, version: novaVersao };
    // desativa todos e publica o novo como ativo
    await supabase.from('ai_brain').update({ active: false }).eq('restaurant_id', rid);
    const { error } = await supabase.from('ai_brain').insert({ restaurant_id: rid, version: novaVersao, data, active: true, note: 'Importado' });
    if (error) return flash('Erro ao publicar: ' + error.message, false);
    // sincroniza a FAQ do cérebro com a base de conhecimento (sem duplicar)
    const novos = (data.knowledge || []).filter((k: any) => k.question && k.answer);
    if (novos.length) {
      const { data: existentes } = await supabase.from('ai_knowledge').select('question').eq('restaurant_id', rid);
      const setQ = new Set((existentes || []).map((e: any) => (e.question || '').trim().toLowerCase()));
      const inserir = novos
        .filter((k: any) => !setQ.has(k.question.trim().toLowerCase()))
        .map((k: any) => ({ restaurant_id: rid, question: k.question, answer: k.answer, keywords: k.keywords || [], active: true }));
      if (inserir.length) await supabase.from('ai_knowledge').insert(inserir);
    }
    setPreview(null);
    flash(`Publicado! O Bento agora usa a versão ${novaVersao}.`);
    carregar();
  }

  async function ativarVersao(id: string) {
    if (!rid) return;
    await supabase.from('ai_brain').update({ active: false }).eq('restaurant_id', rid);
    await supabase.from('ai_brain').update({ active: true }).eq('id', id);
    flash('Versão ativada.');
    carregar();
  }

  const stats = preview?.cerebro
    ? { cat: preview.cerebro.feedback_categories?.length || 0, trg: preview.cerebro.feedback_triggers?.length || 0, faq: preview.cerebro.knowledge?.length || 0, v: preview.cerebro.version }
    : null;

  return (
    <AdminShell>
      <h1 className="adm-h1">Cérebro do Bento</h1>
      <p className="adm-sub">Exporte o "cérebro", melhore no ChatGPT e importe de volta. O Bento fica mais inteligente sem novo deploy.</p>
      {msg && <div className={`adm-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.t}</div>}

      <div className="adm-card">
        <h2>1. Exportar (para melhorar no ChatGPT)</h2>
        <p className="adm-sub">Versão atual em uso: <b>v{brain.version}</b> · {brain.feedback_categories?.length || 0} categorias · {brain.knowledge?.length || 0} perguntas na base.</p>
        <div className="adm-row">
          <button className="adm-btn gold" onClick={exportar}>⬇️ Exportar cérebro (.json)</button>
          <button className="adm-btn" onClick={copiarComando}>📋 Copiar comando + cérebro</button>
        </div>
        <p className="adm-sub" style={{ marginTop: 8 }}>
          O arquivo já vem com o <b>comando de treino</b>: o ChatGPT vai te entrevistar e devolver um cérebro <b>maior</b>. Rode quantas vezes quiser — a cada rodada ele cresce.
        </p>
      </div>

      <div className="adm-card">
        <h2>2. Importar (o cérebro melhorado)</h2>
        <label className="adm-btn gold" style={{ cursor: 'pointer', display: 'inline-block' }}>
          ⬆️ Escolher arquivo do ChatGPT
          <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
        </label>

        {preview && (
          <div className="adm-card" style={{ background: '#0b0907', marginTop: 14 }}>
            {preview.errors.length > 0 ? (
              <>
                <p className="adm-msg err">Este arquivo não pode ser publicado — corrija no ChatGPT e tente de novo:</p>
                <ul className="adm-sub">{preview.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </>
            ) : (
              <>
                <h2>Prévia</h2>
                <p className="adm-sub">Versão <b>v{stats?.v}</b> · <b>{stats?.cat}</b> categorias · <b>{stats?.trg}</b> gatilhos · <b>{stats?.faq}</b> perguntas na base.</p>
                <p className="adm-sub">Tudo certo? Ao publicar, vira a versão ativa (a anterior fica no histórico).</p>
                <button className="adm-btn gold" onClick={publicar}>✅ Publicar esta versão</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="adm-card">
        <h2>Histórico de versões</h2>
        {versoes.length === 0 ? <p className="adm-sub">Ainda usando o cérebro padrão (nenhuma versão importada).</p> : (
          <table className="adm-table">
            <thead><tr><th>Versão</th><th>Quando</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {versoes.map((v) => (
                <tr key={v.id}>
                  <td>v{v.version}</td>
                  <td>{new Date(v.created_at).toLocaleString('pt-BR')}</td>
                  <td>{v.active ? <span className="tag confirmed">Ativa</span> : <span className="tag">Histórico</span>}</td>
                  <td>{!v.active && <button className="adm-btn sm" onClick={() => ativarVersao(v.id)}>Voltar para esta</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
