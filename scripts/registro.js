(function(){
  // ----- util -----
  const $ = s => document.querySelector(s);
  const qs = new URLSearchParams(window.location.search);
  const toast = $('#toast');

  const scriptParam = qs.get('script') || '';   // URL do Apps Script (…/exec) vinda do QR
  const turmaParam  = (qs.get('turma') || '').toUpperCase();

  const token   = $('#token');
  const monitor = $('#monitor');
  const turma   = $('#turma');
  const acao    = $('#acao');
  const statusEl= $('#status');
  const respEl  = $('#resp');

  // Se a turma vier na URL (?turma=INF2), seleciona automaticamente
  if (['INF1','INF2','INF3','INF4'].includes(turmaParam)) {
    turma.value = turmaParam;
  }

  // Aviso se faltou a URL do script no QR
  function needScriptUrl() {
    return !scriptParam || !/^https?:\/\/script\.google/.test(scriptParam);
  }

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 2400);
  }

  function buildUrl(actionOverride){
    const base = scriptParam.trim();
    if(!base) return '';
    const params = new URLSearchParams({
      turma: turma.value,
      acao: actionOverride || acao.value,
      monitor: monitor.value || 'prof',
      token: token.value || ''
    });
    return base + (base.includes('?') ? '&' : '?') + params.toString();
  }

  async function registrar(actionName){
    // validações básicas
    if (needScriptUrl()){
      showToast('QR sem URL do Script. Regere o QR com ?script=URL_DO_EXEC.');
      statusEl.textContent = 'Sem Script URL';
      return;
    }
    if (!token.value){
      showToast('Informe o token.');
      token.focus();
      return;
    }
    if (!monitor.value){
      showToast('Informe o nome do professor/monitor.');
      monitor.focus();
      return;
    }

    const url = buildUrl(actionName);
    if(!url){
      showToast('Link inválido.');
      return;
    }

    // UI: desabilita botões durante envio
    const btns = document.querySelectorAll('.actions .btn');
    btns.forEach(b=>b.disabled=true);

    statusEl.textContent = 'Enviando…';
    respEl.textContent = '—';
    try{
      const r = await fetch(url, { method:'GET', mode:'cors' });
      const text = await r.text();
      statusEl.textContent = r.ok ? 'Sucesso' : 'Falha';
      respEl.textContent = text.slice(0, 220);
      showToast(r.ok ? 'Registro enviado.' : 'Falha no envio.');
    }catch(err){
      statusEl.textContent = 'Erro';
      respEl.textContent = String(err).slice(0, 220);
      showToast('Erro de rede.');
    }finally{
      btns.forEach(b=>b.disabled=false);
    }
  }

  // Botões rápidos
  document.querySelectorAll('[data-quick]').forEach(btn=>{
    btn.addEventListener('click', () => registrar(btn.dataset.quick));
  });

  // Limpar status
  $('#limpar').addEventListener('click', () => { statusEl.textContent='—'; respEl.textContent='—'; });

  // Mensagem inicial caso o script não esteja na URL
  if (needScriptUrl()){
    showToast('Escaneie um QR com ?script=URL_DO_EXEC para ativar os registros.');
  }
})();
