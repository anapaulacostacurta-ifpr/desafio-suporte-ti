    const $ = s => document.querySelector(s);
    const scriptUrl = 'https://script.google.com/a/macros/ifpr.edu.br/s/AKfycbyTlML5fSr1QiWvORI1_vQjw5npJ8TB7kwn2kORkE-PKvdHiCW5AKyG7BIg3DzPiP4Mtg/exec';
    const token = $('#token');
    const monitor = $('#monitor');
    const turma = $('#turma');
    const acao = $('#acao');
    const statusEl = $('#status');
    const respEl = $('#resp');
    const toast = $('#toast');
    const cfgStatus = $('#cfgStatus');
    const linkUso = $('#linkUso');
    const linkFoco = $('#linkFoco');
    const qrUso = $('#qrUso');
    const qrFoco = $('#qrFoco');

    // Construção de URL
    const buildUrl = (a=null) => {
        const base = (scriptUrl.value || '').trim();
        if(!base) return '';
            const params = new URLSearchParams({
            turma: turma.value,
            acao: a || acao.value,
            monitor: monitor.value || 'prof',
            token: token.value
        });
        return base + (base.includes('?') ? '&' : '?') + params.toString();
    };


    const updateLinks = () => {
        const urlUso = buildUrl('uso_inadequado');
        const urlFoco = buildUrl('foco_turma');
        linkUso.value = urlUso;
        linkFoco.value = urlFoco;
        qrUso.src = urlUso ? qrFrom(urlUso) : '';
        qrFoco.src = urlFoco ? qrFrom(urlFoco) : '';
    };

    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(()=>toast.classList.remove('show'), 2600);
    };

    const registrar = async (acaoName) => {
        const url = buildUrl(acaoName);
        if(!url){ showToast('Configure a Script URL primeiro.'); return; }
            statusEl.textContent = 'Enviando…';
            respEl.textContent = '—';
        try{
            const r = await fetch(url, { method:'GET', mode:'cors' });
            const text = await r.text();
            statusEl.textContent = r.ok ? 'Sucesso' : 'Falhou';
            respEl.textContent = text.slice(0, 180);
            showToast(r.ok ? 'Registro enviado.' : 'Falha no envio.');
        }catch(err){
            statusEl.textContent = 'Erro';
            respEl.textContent = String(err).slice(0, 180);
            showToast('Erro de rede.');
        }
    };

    // Eventos
    document.querySelectorAll('[data-quick]').forEach(btn=>{
        btn.addEventListener('click', () => registrar(btn.dataset.quick));
    });
    turma.addEventListener('change', updateLinks);
    monitor.addEventListener('change', updateLinks);
    token.addEventListener('change', updateLinks);
    scriptUrl.addEventListener('change', updateLinks);
    acao.addEventListener('change', ()=>{}); // só para consistência visual

    // Init
    updateLinks();