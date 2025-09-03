 
 // Função chamada automaticamente quando o script é carregado
document.addEventListener("DOMContentLoaded", carregarRanking);

 function carregarRanking() {
  const csvPath = `${location.origin}/desafio-suporte-ti/assets/ranking_geral.csv`;

  fetch(csvPath)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar o arquivo CSV');
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
      let tbody = document.querySelector('#rankingTable tbody');
      if (!tbody) {
        tbody = document.createElement('tbody');
        document.querySelector('#rankingTable').appendChild(tbody);
      }
      tbody.innerHTML = ''; // Limpa conteúdo anterior

      // Converte o CSV em um array de objetos com total calculado
      const ranking = lines.map(line => {
        const [email, nickname, nome, email_padrao, foto, suporte, proposta, avatar, total] = line.split(',').map(val => val.trim());
        const total_calculado = (parseInt(nome) || 0) + (parseInt(email_padrao) || 0) + (parseInt(foto) || 0) + + (parseInt(suporte) || 0) + + (parseInt(proposta) || 0) + + (parseInt(avatar) || 0);
        console.log(total)
        return { email, nickname, nome, email_padrao, foto, suporte, proposta, avatar,total_calculado, total };
      });

      // Ordena do maior para o menor total
      //ranking.sort((a, b) => b.total_calculado - a.total_calculado);
      var total_geral = 0.0;
      // Monta cada linha da tabela
      ranking.forEach((aluno, index) => {
        var foguinho = index < 3 ? ' 🔥' : ''; // Top 3 com fogo
        const isPrimeiroLugar = index === 0;
        const row = document.createElement('tr');

        // Se for o primeiro colocado, aplica estilo especial
        if (isPrimeiroLugar) {
          //foguinho = '🥇';
          row.style.backgroundColor = '#fff8e1'; // fundo amarelo claro
          row.style.fontWeight = 'bold';
        }

        row.innerHTML = `
          <td>${index}</td>
          <td><img src="./images/avatar/${aluno.nickname}.png" alt="Avatar"> <br> ${aluno.nickname}</td>
          <td>${aluno.nome}</td>
          <td>${aluno.email_padrao}</td>
          <td>${aluno.foto}</td>
          <td>${aluno.suporte}</td>
          <td>${aluno.proposta}</td>
          <td>${aluno.avatar}</td>
          <td class="highlight">${aluno.total_calculado}${foguinho}</td>
        `;
        tbody.appendChild(row);
        total_geral = total_geral + aluno.total_calculado;
      });
      const row2 = document.createElement('tr')
      row2.innerHTML = `<td colspan="8">Total Geral</td><td>${total_geral}</td>`;
      tbody.appendChild(row2);
    })
    .catch(error => {
      console.error('Erro ao processar o CSV:', error);
      document.querySelector('#rankingTable').insertAdjacentHTML(
        'afterend',
        `<p style="color: red;">❌ Erro ao carregar os dados do ranking. Verifique o caminho do arquivo CSV.</p>`
      );
    });
}
/*
 function carregarRankingAtividade() {
  const csvPath = `${location.origin}/desafio-suporte-ti/assets/ranking_geral_atividade.csv`;

  fetch(csvPath)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar o arquivo CSV');
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
      let tbody = document.querySelector('#rankingTable tbody');
      if (!tbody) {
        tbody = document.createElement('tbody');
        document.querySelector('#rankingTable').appendChild(tbody);
      }
      tbody.innerHTML = ''; // Limpa conteúdo anterior

      // Converte o CSV em um array de objetos com total calculado
      const ranking = lines.map(line => {
        const IFPRPoints = line.split(',').map(val => val.trim());
        const total_calculado = 0; 
        IFPRPoints.array.forEach(IFPRPoint => {
          total_calculado = total_calculado + (parseInt(IFPRPoint || 0));
        });
          
      
        return IFPRPoints;
      });

      // Monta cada linha da tabela
      ranking.forEach((aluno, index) => {
        var foguinho = index < 3 ? ' 🔥' : ''; // Top 3 com fogo
        const isPrimeiroLugar = index === 0;
        const row = document.createElement('tr');

        // Se for o primeiro colocado, aplica estilo especial
        if (isPrimeiroLugar) {
          //foguinho = '🥇';
          row.style.backgroundColor = '#fff8e1'; // fundo amarelo claro
          row.style.fontWeight = 'bold';
        }

        row.innerHTML = `
          <td>${aluno.email}</td>
          <td>${aluno.nome}</td>
          <td>${aluno.email_padrao}</td>
          <td>${aluno.foto}</td>
          <td class="highlight">${aluno.total_calculado}${foguinho}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao processar o CSV:', error);
      document.querySelector('#rankingTable').insertAdjacentHTML(
        'afterend',
        `<p style="color: red;">❌ Erro ao carregar os dados do ranking. Verifique o caminho do arquivo CSV.</p>`
      );
    });*/