let listaAtividades = [];

    // Habilita/Desabilita os campos de hora conforme o dia é selecionado
    function toggleHorario(checkbox) {
      const parentRow = checkbox.closest('.dia-row');
      const timeInicio = parentRow.querySelector('.time-inicio');
      const timeFim = parentRow.querySelector('.time-fim');

      timeInicio.disabled = !checkbox.checked;
      timeFim.disabled = !checkbox.checked;
    }

    function atualizarDocente() {
      const select = document.getElementById('disciplina');
      const optionSelecionada = select.options[select.selectedIndex];
      const docente = optionSelecionada.getAttribute('data-docente') || '';
      document.getElementById('professor').value = docente;
    }

    function adicionarAtividade() {
      const dataInput = document.getElementById('dataAtividade');
      const planejamentoInput = document.getElementById('planejamento');
      const realizadasInput = document.getElementById('atividadesRealizadas');

      const dataVal = dataInput.value;
      const planVal = planejamentoInput.value.trim();
      const realVal = realizadasInput.value.trim();

      if (!dataVal || !planVal || !realVal) {
        alert('Por favor, preencha a data, o planejamento e a atividade realizada antes de adicionar!');
        return;
      }

      const partesData = dataVal.split('-');
      const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

      const idAtividade = Date.now();
      listaAtividades.push({
        id: idAtividade,
        data: dataFormatada,
        planejamento: planVal,
        realizada: realVal
      });

      renderizarTabela();

      dataInput.value = '';
      planejamentoInput.value = '';
      realizadasInput.value = '';
    }

    function renderizarTabela() {
      const corpoTabela = document.getElementById('corpoTabela');
      
      if (listaAtividades.length === 0) {
        corpoTabela.innerHTML = `
          <tr id="linhaVazia">
            <td colspan="4" class="empty-msg">Nenhuma atividade inserida até o momento.</td>
          </tr>
        `;
        return;
      }

      corpoTabela.innerHTML = '';
      listaAtividades.forEach(item => {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
          <td><strong>${item.data}</strong></td>
          <td>${item.planejamento}</td>
          <td>${item.realizada}</td>
          <td><button type="button" class="btn-danger" onclick="removerAtividade(${item.id})">Excluir</button></td>
        `;
        corpoTabela.appendChild(novaLinha);
      });
    }

    function removerAtividade(id) {
      listaAtividades = listaAtividades.filter(item => item.id !== id);
      renderizarTabela();
    }

    document.getElementById('relatorioForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const disciplinaSelect = document.getElementById('disciplina');
      const disciplinaNome = disciplinaSelect.value;
      if (!disciplinaNome) {
        alert('Selecione uma disciplina!');
        return;
      }

      // Validação da seleção dos dias da semana
      const linhasDias = document.querySelectorAll('.dia-row');
      let horaiosFormatadosArray = [];

      linhasDias.forEach(row => {
        const chk = row.querySelector('.chk-dia');
        if (chk.checked) {
          const diaNome = chk.value;
          const inicio = row.querySelector('.time-inicio').value;
          const fim = row.querySelector('.time-fim').value;
          horaiosFormatadosArray.push(`${diaNome}: ${inicio}-${fim}`);
        }
      });

      if (horaiosFormatadosArray.length === 0) {
        alert('Selecione pelo menos um dia da semana e defina os horários da monitoria!');
        return;
      }

      if (listaAtividades.length === 0) {
        alert('Adicione pelo menos uma atividade ao relatório antes de salvar!');
        return;
      }

      const optionSelecionada = disciplinaSelect.options[disciplinaSelect.selectedIndex];
      const codigoDisciplina = optionSelecionada.getAttribute('data-codigo') || '';
      const professorNome = document.getElementById('professor').value;
      const monitorNome = document.getElementById('monitor').value;
      const mesAnoVal = document.getElementById('mesAno').value;
      const chSemanal = document.getElementById('chSemanal').value;
      const chMensal = document.getElementById('chMensal').value;

      const partesMes = mesAnoVal.split('-');
      const mesesExtenso = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
      const mesExtenso = mesesExtenso[parseInt(partesMes[1], 10) - 1] + " DE " + partesMes[0];

      const datasAgrupadas = "Dias " + listaAtividades.map(a => a.data.split('/')[0]).join(', ') + " de " + mesesExtenso[parseInt(partesMes[1], 10) - 1].toLowerCase();

      let linhasTabelaHtml = '';
      listaAtividades.forEach(act => {
        linhasTabelaHtml += `
          <tr>
            <td style="text-align: center; font-weight: bold;">${act.data}</td>
            <td>${act.planejamento}</td>
            <td>${act.realizada}</td>
          </tr>
        `;
      });

      const horariosHtml = horaiosFormatadosArray.join('<br>');

      const conteudoRelatorio = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>RELATÓRIO MENSAL DE MONITORIA - ${mesExtenso}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11px;
              color: #000;
              margin: 0;
              padding: 20px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            .header-table td {
              border: none;
              padding: 4px;
            }
            .title-box {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
            }
            .subtitle {
              font-size: 11px;
              margin-top: 5px;
            }
            table.main-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            table.main-table th, table.main-table td {
              border: 1px solid #000;
              padding: 6px 8px;
              vertical-align: top;
            }
            .bg-gray {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .text-center {
              text-align: center;
            }
            .signature-container {
              margin-top: 50px;
              display: flex;
              justify-content: space-around;
              align-items: flex-end;
            }
            .signature-box {
              text-align: center;
              width: 40%;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-bottom: 5px;
            }
            .btn-print {
              margin-bottom: 15px;
              padding: 8px 16px;
              background-color: #1b5e20;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            }
            @media print {
              .btn-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <button class="btn-print" onclick="window.print()">Imprimir / Salvar em PDF</button>

          <table class="header-table">
            <tr>
              <td style="width: 25%;">
                <strong style="font-size: 14px; color: #1b5e20;">INSTITUTO FEDERAL<br>Paraíba</strong>
              </td>
              <td class="title-box">
                RELATÓRIO MENSAL DE MONITORIA<br>
                <div class="subtitle">MÊS: ${mesExtenso} | CAMPUS ESPERANÇA - DIREÇÃO DE DESENVOLVIMENTO DE ENSINO</div>
              </td>
            </tr>
          </table>

          <table class="main-table">
            <tr>
              <td colspan="2" class="bg-gray">COMPONENTE CURRICULAR</td>
              <td class="bg-gray text-center">HORÁRIO</td>
              <td colspan="2" class="bg-gray text-center">CARGA HORÁRIA</td>
            </tr>
            <tr>
              <td style="width: 15%;"><strong>CÓDIGO:</strong> ${codigoDisciplina}</td>
              <td style="width: 45%;"><strong>NOME:</strong> ${disciplinaNome}</td>
              <td style="width: 20%; font-size: 10px;">
                ${horariosHtml}
              </td>
              <td class="text-center" style="width: 10%;"><strong>SEMANAL</strong><br>${chSemanal}h</td>
              <td class="text-center" style="width: 10%;"><strong>MENSAL</strong><br>${chMensal}h</td>
            </tr>
            <tr>
              <td colspan="5"><strong>DATAS DE MONITORIA:</strong> ${datasAgrupadas}</td>
            </tr>
            <tr>
              <td colspan="5"><strong>CURSO:</strong> TECNÓLOGO EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS</td>
            </tr>
            <tr>
              <td colspan="2"><strong>PROFESSOR:</strong> ${professorNome}</td>
              <td colspan="3"><strong>MONITOR:</strong> ${monitorNome}</td>
            </tr>
          </table>

          <table class="main-table">
            <thead>
              <tr class="bg-gray">
                <th style="width: 12%;">DATAS</th>
                <th style="width: 44%;">PLANEJAMENTO DE ATIVIDADES</th>
                <th style="width: 44%;">ATIVIDADES REALIZADAS</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabelaHtml}
            </tbody>
          </table>

          <div class="signature-container">
            <div class="signature-box">
              <div class="signature-line"></div>
              <strong>${monitorNome}</strong><br>Monitor
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <strong>${professorNome}</strong><br>Professor Orientador
            </div>
          </div>
        </body>
        </html>
      `;

      const novaGuia = window.open('', '_blank');
      novaGuia.document.write(conteudoRelatorio);
      novaGuia.document.close();
    });