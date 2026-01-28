// --- FUNÇÃO AUXILIAR NO TOPO ---
function extrairCN(texto) {
    if (!texto) return "---";
    // Regex melhorada para aceitar espaços (CN = Nome)
    const match = texto.match(/CN\s*=\s*([^,]+)/);
    return match ? match[1] : texto;
}

// ----------------------------------------------------
export async function load_base() {
    const select = document.getElementById("bases");

    // 1. Feedback visual imediato
    select.innerHTML = '<option value="" disabled selected>Carregando...</option>';

    // 2. Chama o Python
    return window.pywebview.api.listar_bancos()
        .then(response => {

            select.innerHTML = "";

            select.innerHTML += '<option value="" disabled selected>Selecione a base...</option>';
            if (Array.isArray(response)) {
                response.forEach(banco => {
                    select.innerHTML += `<option value="${banco}">${banco}</option>`;
                });

            } else {
                select.innerHTML = `<option disabled>${response}</option>`;
            }

        })
        .catch(error => {
            console.error(error);
            select.innerHTML = '<option value="" disabled selected>Erro ao conectar no banco</option>';
        });
}

export async function load_emp() {

    let base = document.getElementById("bases").value
    let selectEmpresa = document.getElementById("empresa")

    if (!base || base === "") {
        selectEmpresa.innerHTML = '<option value="" disabled selected>Selecione um banco primeiro...</option>';
        return;
    }
    selectEmpresa.innerHTML = '<option value="" disabled selected>Carregando empresas...</option>';

    return window.pywebview.api.listar_emp(base).then(response => {
        selectEmpresa.innerHTML = "";

        if (Array.isArray(response)) {
            response.forEach(empresa => {
                // Se vier mensagem de erro

                if (empresa.includes && empresa.includes("Erro")) {
                    alert(empresa);
                } else {
                    selectEmpresa.innerHTML += `<option value="${empresa}">${empresa.toLowerCase()}</option>`;
                }
            });
        }

    }).catch(err => {
        console.error(err);
        selectEmpresa.innerHTML = '<option disabled>Erro ao carregar</option>';
    });
}


export async function load_cert_emp() {
    const base = document.getElementById("bases").value;
    // CORREÇÃO 1: Pegar o elemento correto pelo ID do HTML
    const tbody = document.getElementById("lista_empresas");

    if (!base || base === "") { return; }

    // Feedback visual
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>';

    return window.pywebview.api.listar_cert_banco(base).then(response => {

        tbody.innerHTML = ""; // Limpa a tabela

        if (!response || response.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
            return;
        }

        response.forEach(item => {

            // Função para formatar o Status/Validade
            const criarBadge = (texto) => {
                if (!texto || texto === "---" || texto === "None") {
                    return `<span class="status-badge status-null">---</span>`;
                }
                // DICA: Aqui você pode comparar datas para ver se venceu
                return `<span class="status-badge status-ok">${texto}</span>`;
            };

            let tr = document.createElement("tr");

            // CORREÇÃO 2 e 3: 
            // - Usamos apenas 3 colunas (para bater com o HTML)
            // - Usamos as chaves certas vindas do Python (item.cert e item.venc)
            tr.innerHTML = `
                <td style="color: white; font-weight: bold;">${item.nome}</td>
                <td>${item.cert}</td>
                <td style="text-align: center;">${criarBadge(item.venc)}</td>
            `;

            tbody.appendChild(tr);
        });

    }).catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="3" style="color:red;">Erro: ${err}</td></tr>`;
    });
}


export async function load_cert_bd() {
    
    // Tenta pegar os elementos
    const elNfe = document.getElementById("select_nfe");
    const elNfce = document.getElementById("select_nfce");
    const elCte = document.getElementById("select_cte");

    // Coloca 'Carregando' em quem existir
    if(elNfe) elNfe.innerHTML = '<option>Carregando...</option>';
    if(elNfce) elNfce.innerHTML = '<option>Carregando...</option>';
    if(elCte) elCte.innerHTML = '<option>Carregando...</option>';

    try {
        const response = await window.pywebview.api.list_certs_install("MY"); 

        if (Array.isArray(response)) {
            
            // 1. Primeiro, montamos APENAS a lista de opções dos certificados (sem o cabeçalho)
            let certsOptions = "";
            
            response.forEach(cert => {
                const nomeDisplay = extrairCN(cert.requerente || cert.emissor || "Desconhecido");
                const valor = cert.numero_serie || cert.thumbprint || nomeDisplay; 
                
                certsOptions += `<option value="${valor}">${nomeDisplay}</option>`;
            });

            // 2. Agora aplicamos em cada campo com seu TEXTO ESPECÍFICO no topo

            // Para NF-e
            if (elNfe) {
                elNfe.innerHTML = `<option value="" disabled selected>Selecione um certificado NF-e</option>` + certsOptions;
            }

            // Para NFC-e
            if (elNfce) {
                elNfce.innerHTML = `<option value="" disabled selected>Selecione um certificado NFC-e</option>` + certsOptions;
            }

            // Para CT-e
            if (elCte) {
                elCte.innerHTML = `<option value="" disabled selected>Selecione um certificado CT-e</option>` + certsOptions;
            }

        } else {
            console.error("Resposta não é array:", response);
        }

    } catch (error) {
        console.error(error);
        // Mensagem de erro genérica para quem existir
        const erroHtml = '<option>Erro ao carregar</option>';
        if(elNfe) elNfe.innerHTML = erroHtml;
        if(elNfce) elNfce.innerHTML = erroHtml;
        if(elCte) elCte.innerHTML = erroHtml;
    }
}












