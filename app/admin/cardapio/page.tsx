'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function CardapioPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [catSel, setCatSel] = useState<string>('');
  const [itens, setItens] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const carregarCats = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
    setRid(r?.id || null);
    if (!r) return;
    const { data } = await supabase.from('menu_categories').select('*').eq('restaurant_id', r.id).order('sort_order');
    setCats(data || []);
    if (!catSel && data && data.length) setCatSel(data[0].id);
  }, [supabase, catSel]);

  const carregarItens = useCallback(async () => {
    if (!catSel) return;
    const { data } = await supabase.from('menu_items').select('*').eq('category_id', catSel).order('sort_order');
    setItens(data || []);
  }, [supabase, catSel]);

  useEffect(() => { carregarCats(); }, [carregarCats]);
  useEffect(() => { carregarItens(); }, [carregarItens]);
  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2500); }

  function up(i: number, campo: string, valor: any) {
    const n = [...itens]; n[i] = { ...n[i], [campo]: valor }; setItens(n);
  }
  async function salvarItem(it: any) {
    const { id, restaurant_id, category_id, created_at, updated_at, image_asset_id, tags, allergens, accompaniments, ...rest } = it;
    await supabase.from('menu_items').update({ ...rest, price: it.price === '' ? null : Number(it.price) }).eq('id', id);
    flash('Item salvo.');
  }
  async function addItem() {
    if (!rid || !catSel) return;
    await supabase.from('menu_items').insert({ restaurant_id: rid, category_id: catSel, name: 'Novo item', price: null, sort_order: itens.length + 1, active: true, available: true });
    carregarItens();
  }
  async function addCategoria() {
    if (!rid) return;
    const nome = prompt('Nome da nova categoria:');
    if (!nome) return;
    const { data } = await supabase.from('menu_categories').insert({ restaurant_id: rid, name: nome.trim(), sort_order: cats.length + 1, active: true }).select().single();
    await carregarCats();
    if (data) setCatSel(data.id);
  }
  async function removerItem(id: string) {
    if (!confirm('Excluir este item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    carregarItens();
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Cardápio</h1>
      <p className="adm-sub">Categorias, itens, preços, disponibilidade e destaque.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <div className="adm-row">
          <select className="adm-select" style={{ maxWidth: 280 }} value={catSel} onChange={(e) => setCatSel(e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="adm-btn sm" onClick={addCategoria}>+ Categoria</button>
          <button className="adm-btn sm gold" onClick={addItem}>+ Item nesta categoria</button>
        </div>
      </div>

      <div className="adm-card">
        {itens.length === 0 ? <p className="adm-sub">Nenhum item nesta categoria.</p> : (
          <table className="adm-table">
            <thead><tr><th>Nome</th><th>Variação</th><th>Preço</th><th>Disp.</th><th>Destaque</th><th>Ativo</th><th></th></tr></thead>
            <tbody>
              {itens.map((it, i) => (
                <tr key={it.id}>
                  <td><input className="adm-input" style={{ padding: '5px 8px' }} value={it.name || ''} onChange={(e) => up(i, 'name', e.target.value)} /></td>
                  <td><input className="adm-input" style={{ padding: '5px 8px', maxWidth: 110 }} value={it.variation || ''} onChange={(e) => up(i, 'variation', e.target.value)} /></td>
                  <td><input className="adm-input" style={{ padding: '5px 8px', maxWidth: 80 }} type="number" step="0.01" value={it.price ?? ''} onChange={(e) => up(i, 'price', e.target.value)} /></td>
                  <td><input type="checkbox" checked={!!it.available} onChange={(e) => up(i, 'available', e.target.checked)} /></td>
                  <td><input type="checkbox" checked={!!it.featured} onChange={(e) => up(i, 'featured', e.target.checked)} /></td>
                  <td><input type="checkbox" checked={!!it.active} onChange={(e) => up(i, 'active', e.target.checked)} /></td>
                  <td>
                    <div className="adm-row" style={{ gap: 6 }}>
                      <button className="adm-btn sm gold" onClick={() => salvarItem(it)}>Salvar</button>
                      <button className="adm-btn sm" onClick={() => removerItem(it.id)}>×</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
