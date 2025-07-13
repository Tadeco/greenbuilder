import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const STORAGE_KEY_PREFIX = 'inventario_gee_';

const etapas = [
  'Limites Organizacionais',
  'Limites Operacionais',
  'Metodologia e Fatores de Emissão',
  'Coleta de Dados',
  'Cálculo das Emissões',
  'Relatório Final',
];

const ETAPA_ICONS = [
  '🏢', // Limites Organizacionais
  '⚙️', // Limites Operacionais
  '📊', // Metodologia
  '📝', // Coleta de Dados
  '🧮', // Cálculo
  '📄', // Relatório
];

// Fatores de emissão de exemplo (valores fictícios)
const FATORES = {
  combustivel: 2.5, // tCO2e por 1000 litros
  energia: 0.1,     // tCO2e por 1000 kWh
  frota: 2.0,       // tCO2e por 1000 km
  refrigeracao: 1.0 // tCO2e por kg de gás
};

// SVG do logo estilizado inspirado na imagem enviada
const LogoGreenBuilder = () => (
  <svg width="180" height="80" viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px auto' }}>
    {/* Mar */}
    <path d="M10 120 Q 40 130 80 120 Q 120 110 160 125" stroke="#00bcd4" strokeWidth="4" fill="none" />
    {/* Pão de Açúcar */}
    <path d="M80 120 Q 120 80 180 110 Q 220 130 260 120" stroke="#43a047" strokeWidth="5" fill="none" />
    {/* Cristo Redentor */}
    <path d="M270 120 Q 300 100 320 110 Q 340 120 350 130" stroke="#ff9800" strokeWidth="5" fill="none" />
    <path d="M320 110 Q 322 100 324 110" stroke="#ff9800" strokeWidth="4" fill="none" />
    <path d="M323 105 Q 318 105 328 105" stroke="#ff9800" strokeWidth="3" fill="none" />
  </svg>
);

export default function WizardInventarioGEE() {
  // Login state
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuario_gee');
    return u ? JSON.parse(u) : null;
  });
  const [loginForm, setLoginForm] = useState({ empresa: '', senha: '' });
  const [loginErro, setLoginErro] = useState('');

  // Wizard state
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [dados, setDados] = useState(() => {
    if (!usuario) return {};
    const salvo = localStorage.getItem(STORAGE_KEY_PREFIX + usuario.empresa);
    return salvo ? JSON.parse(salvo) : {};
  });
  const [erros, setErros] = useState({});
  const [emissoes, setEmissoes] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Login/cadastro handler
  function handleLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleLogin(e) {
    e.preventDefault();
    if (!loginForm.empresa || !loginForm.senha) {
      setLoginErro('Preencha todos os campos.');
      return;
    }
    // Simples: salva senha no localStorage (não seguro, só para demo)
    const key = 'usuario_gee_' + loginForm.empresa;
    const salvo = localStorage.getItem(key);
    if (salvo) {
      const { senha } = JSON.parse(salvo);
      if (senha !== loginForm.senha) {
        setLoginErro('Senha incorreta.');
        return;
      }
    } else {
      localStorage.setItem(key, JSON.stringify({ empresa: loginForm.empresa, senha: loginForm.senha }));
    }
    localStorage.setItem('usuario_gee', JSON.stringify({ empresa: loginForm.empresa }));
    setUsuario({ empresa: loginForm.empresa });
    setLoginErro('');
    setDados(() => {
      const salvo = localStorage.getItem(STORAGE_KEY_PREFIX + loginForm.empresa);
      return salvo ? JSON.parse(salvo) : {};
    });
    setEtapaAtual(0);
    setEmissoes(null);
  }
  function handleLogout() {
    localStorage.removeItem('usuario_gee');
    setUsuario(null);
    setDados({});
    setEtapaAtual(0);
    setEmissoes(null);
  }

  // Barra de progresso (calculada dinamicamente no componente ProgressoWizard)

  // Validação básica dos campos obrigatórios por etapa
  function validarEtapa() {
    let e = {};
    if (etapaAtual === 0) {
      if (!dados.empresa) e.empresa = 'Obrigatório';
      if (!dados.cnpj) e.cnpj = 'Obrigatório';
      if (!dados.setor) e.setor = 'Obrigatório';
      if (!dados.ano_base) e.ano_base = 'Obrigatório';
      if (!dados.responsavel) e.responsavel = 'Obrigatório';
    }
    if (etapaAtual === 1) {
      if (!dados.atividades) e.atividades = 'Obrigatório';
      if (!dados.fontes) e.fontes = 'Obrigatório';
      if (!dados.escopos || (!dados.escopos.escopo1 && !dados.escopos.escopo2 && !dados.escopos.escopo3)) e.escopos = 'Selecione pelo menos um escopo';
    }
    if (etapaAtual === 2) {
      if (!dados.metodologia) e.metodologia = 'Obrigatório';
      if (!dados.fatores) e.fatores = 'Obrigatório';
    }
    setErros(e);
    // Rolar para o primeiro erro, se houver
    if (Object.keys(e).length > 0) {
      setTimeout(() => {
        const el = document.querySelector('.campo-erro');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    return Object.keys(e).length === 0;
  }

  // Avançar etapa
  function proximaEtapa() {
    if (validarEtapa()) {
      if (etapaAtual === 4) calcularEmissoes();
      setEtapaAtual((prev) => Math.min(prev + 1, etapas.length - 1));
    }
  }
  // Voltar etapa
  function etapaAnterior() {
    setEtapaAtual((prev) => Math.max(prev - 1, 0));
  }

  // Salvar campo
  function handleChange(e) {
    const { name, value, checked } = e.target;
    if (name.startsWith('escopo')) {
      setDados((prev) => ({
        ...prev,
        escopos: { ...prev.escopos, [name]: checked }
      }));
    } else {
      setDados((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Cálculo simulado das emissões
  function calcularEmissoes() {
    const combustivel = Number(dados.combustivel_qtd || 0);
    const energia = Number(dados.energia_qtd || 0);
    const frota = Number(dados.frota_km || 0);
    const refrigeracao = Number(dados.refrigeracao_qtd || 0);
    const outras = Number(dados.outras_qtd || 0);
    const total =
      (combustivel * FATORES.combustivel) / 1000 +
      (energia * FATORES.energia) / 1000 +
      (frota * FATORES.frota) / 1000 +
      (refrigeracao * FATORES.refrigeracao) +
      outras;
    setEmissoes({
      escopo1: (combustivel * FATORES.combustivel) / 1000 + (frota * FATORES.frota) / 1000,
      escopo2: (energia * FATORES.energia) / 1000,
      escopo3: outras,
      total: total
    });
  }

  // Exportação real para Excel
  function exportarExcel() {
    const escoposSelecionados = Object.entries(dados.escopos || {}).filter(([k,v])=>v).map(([k])=>k).join(', ');
    const resumo = [
      ['Empresa', dados.empresa],
      ['CNPJ', dados.cnpj],
      ['Setor', dados.setor],
      ['Ano-base', dados.ano_base],
      ['Responsável', dados.responsavel],
      ['Escopos', escoposSelecionados],
      ['Metodologia', dados.metodologia],
      ['Fatores de emissão', dados.fatores],
      ['Total de emissões (tCO2e)', emissoes ? emissoes.total.toFixed(2) : '--'],
    ];
    const emissoesDetalhe = [
      ['Escopo', 'Emissões (tCO2e)'],
      ['Escopo 1', emissoes ? emissoes.escopo1.toFixed(2) : '--'],
      ['Escopo 2', emissoes ? emissoes.escopo2.toFixed(2) : '--'],
      ['Escopo 3', emissoes ? emissoes.escopo3.toFixed(2) : '--'],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
    const wsEmissoes = XLSX.utils.aoa_to_sheet(emissoesDetalhe);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
    XLSX.utils.book_append_sheet(wb, wsEmissoes, 'Emissões');
    XLSX.writeFile(wb, 'inventario_gee.xlsx');
  }

  // Exportação real para PDF
  function exportarPDF() {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text('Relatório de Inventário de GEE', 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('Resumo do Inventário:', 10, y);
    y += 8;
    const escoposSelecionados = Object.entries(dados.escopos || {}).filter(([k,v])=>v).map(([k])=>k).join(', ');
    const resumo = [
      ['Empresa', dados.empresa],
      ['CNPJ', dados.cnpj],
      ['Setor', dados.setor],
      ['Ano-base', dados.ano_base],
      ['Responsável', dados.responsavel],
      ['Escopos', escoposSelecionados],
      ['Metodologia', dados.metodologia],
      ['Fatores de emissão', dados.fatores],
      ['Total de emissões (tCO2e)', emissoes ? emissoes.total.toFixed(2) : '--'],
    ];
    resumo.forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, 12, y);
      y += 7;
    });
    y += 2;
    doc.setFontSize(12);
    doc.text('Emissões por Escopo:', 10, y);
    y += 8;
    doc.text(`Escopo 1: ${emissoes ? emissoes.escopo1.toFixed(2) : '--'} tCO2e`, 12, y); y += 7;
    doc.text(`Escopo 2: ${emissoes ? emissoes.escopo2.toFixed(2) : '--'} tCO2e`, 12, y); y += 7;
    doc.text(`Escopo 3: ${emissoes ? emissoes.escopo3.toFixed(2) : '--'} tCO2e`, 12, y); y += 10;
    doc.setFontSize(12);
    doc.text('Sugestões de Compensação e Redução:', 10, y); y += 8;
    const sugestoes = [
      '🌳 Reflorestamento: Compense suas emissões plantando árvores. Exemplo: 1.000 árvores compensam cerca de 15 tCO2e/ano.',
      '💳 Compra de Créditos de Carbono: Adquira créditos certificados em projetos ambientais.',
      '💡 Eficiência Energética: Invista em equipamentos mais eficientes.',
      '🔄 Uso de Energias Renováveis: Migre para fontes renováveis.',
      '🚛 Otimização de Frotas: Renove a frota para veículos mais eficientes.',
      '🏭 Redução de Vazamentos e Perdas: Implemente manutenção preventiva.',
      '📊 Monitoramento Contínuo: Implemente sistemas de monitoramento.',
    ];
    sugestoes.forEach((s) => {
      doc.text(s, 12, y);
      y += 7;
    });
    if (dados.setor && dados.setor.toLowerCase().includes('óleo')) {
      doc.text('🛢️ Redução de Emissões Fugitivas: Implemente sistemas de detecção e reparo de vazamentos.', 12, y); y += 7;
      doc.text('🔥 Otimização da Queima em Tochas: Reduza a queima de gás em tochas.', 12, y); y += 7;
    }
    y += 4;
    if (emissoes) {
      doc.setFontSize(11);
      doc.text(`Estimativa: Para compensar ${emissoes.total.toFixed(2)} tCO2e, seriam necessárias aproximadamente ${Math.ceil(emissoes.total / 0.015)} árvores plantadas (1 árvore = 0,015 tCO2e/ano).`, 12, y);
    }
    doc.save('inventario_gee.pdf');
  }

  // Exportação simulada
  function exportar(tipo) {
    if (tipo === 'Excel') {
      exportarExcel();
    } else {
      alert(`Exportação simulada para ${tipo}`);
    }
  }

  // Salvar inventário no localStorage
  function salvarInventario() {
    if (!usuario) return;
    localStorage.setItem(STORAGE_KEY_PREFIX + usuario.empresa, JSON.stringify(dados));
    setFeedback('Inventário salvo com sucesso!');
    setTimeout(() => setFeedback(''), 2000);
  }
  // Carregar inventário salvo
  function carregarInventario() {
    if (!usuario) return;
    const salvo = localStorage.getItem(STORAGE_KEY_PREFIX + usuario.empresa);
    if (salvo) {
      setDados(JSON.parse(salvo));
      setFeedback('Inventário carregado!');
      setTimeout(() => setFeedback(''), 2000);
    } else {
      setFeedback('Nenhum inventário salvo encontrado.');
      setTimeout(() => setFeedback(''), 2000);
    }
  }
  // Limpar inventário salvo
  function limparInventario() {
    if (!usuario) return;
    localStorage.removeItem(STORAGE_KEY_PREFIX + usuario.empresa);
    setDados({});
    setEtapaAtual(0);
    setEmissoes(null);
    setFeedback('Inventário limpo!');
    setTimeout(() => setFeedback(''), 2000);
  }

  // Barra de progresso com ícones/números
  function ProgressoWizard() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 32px 0' }}>
        {etapas.map((etapa, idx) => (
          <div key={etapa} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: idx === etapaAtual ? '#4caf50' : idx < etapaAtual ? '#a5d6a7' : '#eee',
                color: idx === etapaAtual ? '#fff' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                margin: '0 auto',
                border: idx === etapaAtual ? '2px solid #388e3c' : '2px solid #ccc',
                transition: 'background 0.2s, border 0.2s',
                zIndex: 2
              }}
            >
              {ETAPA_ICONS[idx]}<span style={{ fontSize: 13, marginLeft: 4 }}>{idx + 1}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: idx === etapaAtual ? '#388e3c' : '#888', minHeight: 32 }}>{etapa}</div>
            {idx < etapas.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  left: '50%',
                  width: '100%',
                  height: 4,
                  background: idx < etapaAtual ? '#4caf50' : '#eee',
                  zIndex: 1,
                  marginLeft: 19,
                  marginRight: -19
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001' }}>
        <h2 style={{ textAlign: 'center', color: '#388e3c', marginBottom: 24 }}>Acesso ao Inventário de GEE</h2>
        <form onSubmit={handleLogin}>
          <label>Empresa:<br />
            <input type="text" name="empresa" value={loginForm.empresa} onChange={handleLoginChange} style={{ width: '100%', marginBottom: 12 }} />
          </label><br />
          <label>Senha:<br />
            <input type="password" name="senha" value={loginForm.senha} onChange={handleLoginChange} style={{ width: '100%', marginBottom: 12 }} />
          </label><br />
          {loginErro && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{loginErro}</div>}
          <button type="submit" style={{ width: '100%', padding: '10px 0', borderRadius: 6, border: 'none', background: '#388e3c', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Entrar</button>
        </form>
        <div style={{ marginTop: 18, fontSize: 13, color: '#888', textAlign: 'center' }}>
          <b>Dica:</b> Se for o primeiro acesso, basta escolher uma senha.<br />Se já existe, use a senha cadastrada.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32, background: '#fafdff', borderRadius: 16, boxShadow: '0 2px 16px #0001', border: '2px solid #e0f2f1' }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <LogoGreenBuilder />
        <h2 style={{ color: '#2e7d32', fontWeight: 800, margin: 0, fontSize: '2.1rem', letterSpacing: 1 }}>GreenBuilder <span style={{ color: '#1976d2', fontWeight: 700 }}>BR</span></h2>
        <div style={{ color: '#388e3c', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Inventário de Emissões de GEE</div>
      </div>
      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <span style={{ color: '#888', fontSize: 13, marginRight: 12 }}>Empresa: <b>{usuario?.empresa}</b></span>
        {usuario && <button type="button" onClick={handleLogout} style={{ padding: '4px 14px', borderRadius: 5, border: 'none', background: '#d32f2f', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Sair</button>}
      </div>
      <ProgressoWizard />
      {/* Feedback visual */}
      {feedback && <div style={{ background: '#e0f2f1', color: '#00695c', padding: 8, borderRadius: 6, marginBottom: 12, textAlign: 'center' }}>{feedback}</div>}
      {/* Botões de persistência */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <button type="button" onClick={salvarInventario} style={{ marginRight: 8, padding: '6px 18px', borderRadius: 5, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Salvar</button>
        <button type="button" onClick={carregarInventario} style={{ marginRight: 8, padding: '6px 18px', borderRadius: 5, border: 'none', background: '#388e3c', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Carregar</button>
        <button type="button" onClick={limparInventario} style={{ padding: '6px 18px', borderRadius: 5, border: 'none', background: '#d32f2f', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Limpar</button>
      </div>
      <form onSubmit={e => e.preventDefault()}>
        {/* Etapa 1 */}
        {etapaAtual === 0 && (
          <div>
            <h3>1. Limites Organizacionais</h3>
            <label>Nome da empresa:<br />
              <input type="text" name="empresa" value={dados.empresa || ''} onChange={handleChange} style={{ width: '100%', border: erros.empresa ? '2px solid #d32f2f' : undefined }} className={erros.empresa ? 'campo-erro' : ''} />
              {erros.empresa && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.empresa}</span>}
            </label><br />
            <label>CNPJ:<br />
              <input type="text" name="cnpj" value={dados.cnpj || ''} onChange={handleChange} style={{ width: '100%', border: erros.cnpj ? '2px solid #d32f2f' : undefined }} className={erros.cnpj ? 'campo-erro' : ''} />
              {erros.cnpj && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.cnpj}</span>}
            </label><br />
            <label>Setor de atuação:<br />
              <input type="text" name="setor" value={dados.setor || ''} onChange={handleChange} style={{ width: '100%', border: erros.setor ? '2px solid #d32f2f' : undefined }} className={erros.setor ? 'campo-erro' : ''} />
              {erros.setor && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.setor}</span>}
            </label><br />
            <label>Unidades/filiais incluídas:<br />
              <input type="text" name="unidades" value={dados.unidades || ''} onChange={handleChange} style={{ width: '100%' }} />
            </label><br />
            <label>Ano-base do inventário:<br />
              <input type="number" name="ano_base" value={dados.ano_base || ''} onChange={handleChange} style={{ width: '100%', border: erros.ano_base ? '2px solid #d32f2f' : undefined }} className={erros.ano_base ? 'campo-erro' : ''} />
              {erros.ano_base && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.ano_base}</span>}
            </label><br />
            <label>Responsável pelo inventário:<br />
              <input type="text" name="responsavel" value={dados.responsavel || ''} onChange={handleChange} style={{ width: '100%', border: erros.responsavel ? '2px solid #d32f2f' : undefined }} className={erros.responsavel ? 'campo-erro' : ''} />
              {erros.responsavel && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.responsavel}</span>}
            </label><br />
          </div>
        )}
        {/* Etapa 2 */}
        {etapaAtual === 1 && (
          <div className="wizard-flex-etapa2" style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
            {/* Legendas dos Escopos empilhadas à esquerda */}
            <div className="wizard-legendas-etapa2" style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 270, maxWidth: 320 }}>
              <div style={{ background: '#e8f5e9', border: '2px solid #388e3c', borderRadius: 12, padding: 16, color: '#2e7d32', fontSize: 16, fontWeight: 500, boxShadow: '0 2px 8px #0001' }}>
                <b>Escopo 1</b><br/>
                <span style={{ fontWeight: 400, color: '#388e3c' }}>
                  Emissões diretas: fontes que pertencem ou são controladas pela empresa (ex: combustão em caldeiras, veículos próprios, processos industriais).
                </span>
              </div>
              <div style={{ background: '#e3f2fd', border: '2px solid #1976d2', borderRadius: 12, padding: 16, color: '#1565c0', fontSize: 16, fontWeight: 500, boxShadow: '0 2px 8px #0001' }}>
                <b>Escopo 2</b><br/>
                <span style={{ fontWeight: 400, color: '#1976d2' }}>
                  Emissões indiretas associadas à compra de energia elétrica, vapor, aquecimento ou refrigeração consumidos pela empresa.
                </span>
              </div>
              <div style={{ background: '#fffde7', border: '2px solid #fbc02d', borderRadius: 12, padding: 16, color: '#b28704', fontSize: 16, fontWeight: 500, boxShadow: '0 2px 8px #0001' }}>
                <b>Escopo 3</b><br/>
                <span style={{ fontWeight: 400, color: '#b28704' }}>
                  Emissões indiretas não incluídas nos escopos 1 e 2 (ex: cadeia de fornecedores, viagens a trabalho, transporte de produtos).<br/>
                  <b>Necessário fornecer dados específicos da empresa.</b>
                </span>
              </div>
            </div>
            {/* Formulário principal à direita */}
            <div className="wizard-form-etapa2" style={{ flex: 1 }}>
              <h3>2. Limites Operacionais</h3>
              <label>Atividades incluídas:<br />
                <input type="text" name="atividades" value={dados.atividades || ''} onChange={handleChange} style={{ width: '100%', border: erros.atividades ? '2px solid #d32f2f' : undefined }} className={erros.atividades ? 'campo-erro' : ''} />
                {erros.atividades && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.atividades}</span>}
              </label><br />
              <label>Fontes de emissão consideradas:<br />
                <input type="text" name="fontes" value={dados.fontes || ''} onChange={handleChange} style={{ width: '100%', border: erros.fontes ? '2px solid #d32f2f' : undefined }} className={erros.fontes ? 'campo-erro' : ''} />
                {erros.fontes && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.fontes}</span>}
              </label><br />
              <label>Escopos selecionados:<br />
                <input type="checkbox" name="escopo1" checked={dados.escopos?.escopo1 || false} onChange={handleChange} /> Escopo 1
                <input type="checkbox" name="escopo2" checked={dados.escopos?.escopo2 || false} onChange={handleChange} /> Escopo 2
                <input type="checkbox" name="escopo3" checked={dados.escopos?.escopo3 || false} onChange={handleChange} /> Escopo 3
                {erros.escopos && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.escopos}</span>}
              </label><br />
              <label>Justificativa para exclusões:<br />
                <input type="text" name="justificativa" value={dados.justificativa || ''} onChange={handleChange} style={{ width: '100%' }} />
              </label><br />
            </div>
          </div>
        )}
        {/* Etapa 3 */}
        {etapaAtual === 2 && (
          <div>
            <h3>3. Metodologia e Fatores de Emissão</h3>
            <button type="button" onClick={() => setDados(prev => ({
              ...prev,
              metodologia: 'GHG Protocol',
              fatores: 'CETESB/FGV',
              unidades: 'tCO2e',
              referencias: 'IPCC, ANP, Inventário Nacional'
            }))} style={{
              marginBottom: 16,
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '7px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15
            }}>
              Preencher com sugestão
            </button>
            <label>Metodologia utilizada:<br />
              <input type="text" name="metodologia" value={dados.metodologia || ''} onChange={handleChange} style={{ width: '100%', border: erros.metodologia ? '2px solid #d32f2f' : undefined }} className={erros.metodologia ? 'campo-erro' : ''} />
              {erros.metodologia && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.metodologia}</span>}
            </label><br />
            <label>Fatores de emissão adotados:<br />
              <input type="text" name="fatores" value={dados.fatores || ''} onChange={handleChange} style={{ width: '100%', border: erros.fatores ? '2px solid #d32f2f' : undefined }} className={erros.fatores ? 'campo-erro' : ''} />
              {erros.fatores && <span style={{ color: '#d32f2f', fontWeight: 500, marginLeft: 8 }}>{erros.fatores}</span>}
            </label><br />
            <label>Unidades de medida:<br />
              <input type="text" name="unidades" value={dados.unidades || ''} onChange={handleChange} style={{ width: '100%' }} />
            </label><br />
            <label>Referências dos fatores:<br />
              <input type="text" name="referencias" value={dados.referencias || ''} onChange={handleChange} style={{ width: '100%' }} />
            </label><br />
          </div>
        )}
        {/* Etapa 4 */}
        {etapaAtual === 3 && (
          <div>
            <h3>4. Coleta de Dados</h3>
            {/* Dica para setor óleo e gás */}
            {dados.setor && dados.setor.toLowerCase().includes('óleo') && (
              <div style={{ background: '#fffde7', padding: 10, borderRadius: 6, marginBottom: 12, border: '1px solid #ffe082' }}>
                <b>Dica para Óleo e Gás:</b> Inclua dados de queima de gás em tochas, processos industriais (ex: craqueamento, refino), emissões fugitivas e transporte de combustíveis.<br />
                Utilize fatores de emissão específicos da ANP, IPCC ou CETESB para o setor.
              </div>
            )}
            <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <legend>Consumo de combustíveis</legend>
              <label>Tipo de combustível:<br /><input type="text" name="combustivel_tipo" value={dados.combustivel_tipo || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Quantidade consumida (litros):<br /><input type="number" name="combustivel_qtd" value={dados.combustivel_qtd || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Período de consumo (dias):<br /><input type="number" name="combustivel_periodo" value={dados.combustivel_periodo || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
            </fieldset>
            {/* Campos extras para óleo e gás */}
            {dados.setor && dados.setor.toLowerCase().includes('óleo') && (
              <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
                <legend>Queima de Gás em Tochas</legend>
                <label>Volume queimado (Nm³):<br /><input type="number" name="queima_gas" value={dados.queima_gas || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
                <label>Fator de emissão (tCO₂e/Nm³):<br /><input type="number" step="any" name="fator_queima_gas" value={dados.fator_queima_gas || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              </fieldset>
            )}
            <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <legend>Consumo de energia elétrica</legend>
              <label>Quantidade (kWh):<br /><input type="number" name="energia_qtd" value={dados.energia_qtd || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Fonte:<br /><input type="text" name="energia_fonte" value={dados.energia_fonte || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Período de consumo (dias):<br /><input type="number" name="energia_periodo" value={dados.energia_periodo || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
            </fieldset>
            <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <legend>Uso de frota própria</legend>
              <label>Tipo de veículo:<br /><input type="text" name="frota_tipo" value={dados.frota_tipo || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Quilometragem rodada:<br /><input type="number" name="frota_km" value={dados.frota_km || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Consumo de combustível:<br /><input type="number" name="frota_combustivel" value={dados.frota_combustivel || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
            </fieldset>
            <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <legend>Refrigeração e ar condicionado</legend>
              <label>Tipo de gás:<br /><input type="text" name="refrigeracao_gas" value={dados.refrigeracao_gas || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Quantidade recarregada (kg):<br /><input type="number" name="refrigeracao_qtd" value={dados.refrigeracao_qtd || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
            </fieldset>
            <fieldset style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <legend>Outras fontes relevantes</legend>
              <label>Descrição:<br /><input type="text" name="outras_desc" value={dados.outras_desc || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
              <label>Quantidade:<br /><input type="number" name="outras_qtd" value={dados.outras_qtd || ''} onChange={handleChange} style={{ width: '100%' }} /></label><br />
            </fieldset>
          </div>
        )}
        {/* Etapa 5 */}
        {etapaAtual === 4 && (
          <div>
            <h3>5. Cálculo das Emissões</h3>
            <p>Os cálculos automáticos das emissões serão exibidos aqui, conforme os dados preenchidos nas etapas anteriores.</p>
            {emissoes && (
              <div style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <strong>Resumo das Emissões:</strong>
                <ul>
                  <li>Escopo 1: {emissoes.escopo1.toFixed(2)} tCO₂e</li>
                  <li>Escopo 2: {emissoes.escopo2.toFixed(2)} tCO₂e</li>
                  <li>Escopo 3: {emissoes.escopo3.toFixed(2)} tCO₂e</li>
                  <li><strong>Total: {emissoes.total.toFixed(2)} tCO₂e</strong></li>
                </ul>
              </div>
            )}
            <ul>
              <li>Resumo por escopo (1, 2, 3)</li>
              <li>Total de emissões (tCO₂e)</li>
              <li>Possibilidade de editar dados antes de finalizar</li>
            </ul>
          </div>
        )}
        {/* Etapa 6 */}
        {etapaAtual === 5 && (
          <div>
            <h3>6. Relatório Final</h3>
            {/* Gráfico de pizza das emissões por escopo */}
            {emissoes && (
              <div style={{ maxWidth: 340, margin: '0 auto 18px auto', background: '#f5f5f5', borderRadius: 8, padding: 12 }}>
                <Pie
                  data={{
                    labels: ['Escopo 1', 'Escopo 2', 'Escopo 3'],
                    datasets: [
                      {
                        data: [emissoes.escopo1, emissoes.escopo2, emissoes.escopo3],
                        backgroundColor: ['#388e3c', '#1976d2', '#ffa000'],
                        borderColor: '#fff',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed.toFixed(2)} tCO₂e` } }
                    }
                  }}
                />
                <div style={{ textAlign: 'center', fontSize: 13, color: '#333', marginTop: 6 }}>
                  Distribuição das emissões por escopo
                </div>
              </div>
            )}
            <p>Resumo executivo, tabelas detalhadas, gráficos e sugestões de compensação serão gerados aqui.</p>
            <div style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
              <strong>Resumo do Inventário:</strong>
              <ul>
                <li><b>Empresa:</b> {dados.empresa}</li>
                <li><b>CNPJ:</b> {dados.cnpj}</li>
                <li><b>Setor:</b> {dados.setor}</li>
                <li><b>Ano-base:</b> {dados.ano_base}</li>
                <li><b>Responsável:</b> {dados.responsavel}</li>
                <li><b>Escopos:</b> {Object.entries(dados.escopos || {}).filter(([k,v])=>v).map(([k])=>k).join(', ')}</li>
                <li><b>Metodologia:</b> {dados.metodologia}</li>
                <li><b>Fatores de emissão:</b> {dados.fatores}</li>
                <li><b>Total de emissões:</b> {emissoes ? emissoes.total.toFixed(2) : '--'} tCO₂e</li>
              </ul>
            </div>
            {/* Sugestões automáticas de compensação/redução */}
            {emissoes && (
              <div style={{ background: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <strong>Sugestões de Compensação e Redução:</strong>
                <ul>
                  <li>🌳 <b>Reflorestamento:</b> Compense suas emissões plantando árvores. Exemplo: 1.000 árvores compensam cerca de 15 tCO₂e/ano.</li>
                  <li>💳 <b>Compra de Créditos de Carbono:</b> Adquira créditos certificados em projetos ambientais para neutralizar parte ou totalidade das emissões.</li>
                  <li>💡 <b>Eficiência Energética:</b> Invista em equipamentos mais eficientes e reduza o consumo de energia elétrica.</li>
                  <li>🔄 <b>Uso de Energias Renováveis:</b> Migre para fontes renováveis (solar, eólica, biomassa) para reduzir emissões do escopo 2.</li>
                  <li>🚛 <b>Otimização de Frotas:</b> Renove a frota para veículos mais eficientes ou híbridos e otimize rotas para reduzir consumo de combustíveis.</li>
                  <li>🏭 <b>Redução de Vazamentos e Perdas:</b> Implemente manutenção preventiva em equipamentos industriais e sistemas de refrigeração.</li>
                  <li>📊 <b>Monitoramento Contínuo:</b> Implemente sistemas de monitoramento para identificar oportunidades de redução contínua.</li>
                  {/* Sugestão extra para óleo e gás */}
                  {dados.setor && dados.setor.toLowerCase().includes('óleo') && (
                    <li>🛢️ <b>Redução de Emissões Fugitivas:</b> Implemente sistemas de detecção e reparo de vazamentos em dutos, válvulas e tanques.</li>
                  )}
                  {dados.setor && dados.setor.toLowerCase().includes('óleo') && (
                    <li>🔥 <b>Otimização da Queima em Tochas:</b> Reduza a queima de gás em tochas com reaproveitamento energético e controle operacional.</li>
                  )}
                </ul>
                <div style={{ marginTop: 8, color: '#388e3c' }}>
                  <b>Estimativa:</b> Para compensar <b>{emissoes.total.toFixed(2)} tCO₂e</b>, seriam necessárias aproximadamente <b>{Math.ceil(emissoes.total / 0.015)}</b> árvores plantadas (considerando 1 árvore = 0,015 tCO₂e/ano).
                </div>
              </div>
            )}
            <button type="button" onClick={() => exportarPDF()} style={{ marginRight: 8 }}>Exportar para PDF</button>
            <button type="button" onClick={() => exportar('Excel')}>Exportar para Excel</button>
          </div>
        )}
      </form>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button type="button" onClick={etapaAnterior} disabled={etapaAtual === 0} style={{ marginRight: 16, padding: '8px 24px', borderRadius: 6, border: 'none', background: etapaAtual === 0 ? '#ccc' : '#a5d6a7', color: '#222', fontWeight: 600, cursor: etapaAtual === 0 ? 'not-allowed' : 'pointer' }}>
          Anterior
        </button>
        <button type="button" onClick={proximaEtapa} disabled={etapaAtual === etapas.length - 1} style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: etapaAtual === etapas.length - 1 ? '#ccc' : '#388e3c', color: '#fff', fontWeight: 600, cursor: etapaAtual === etapas.length - 1 ? 'not-allowed' : 'pointer' }}>
          Próximo
        </button>
      </div>
    </div>
  );
} 