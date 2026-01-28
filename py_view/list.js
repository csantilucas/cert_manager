import { connect_sql } from './config.js';
import { load_base, load_cert_bd, load_cert_emp, load_emp } from './emp.js';
import { mostrarInstalacao } from './install.js';

function mostrarSecao(secaoId) {
    // Lista com os IDs de TODAS as suas telas (divs)
    const telas = ['search', 'install', 'emp-certs'];

    telas.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Se for o ID que clicamos, mostra (block). Se não, esconde (none).
            elemento.style.display = (id === secaoId) ? 'block' : 'none';
        }
    });
}

window.addEventListener('DOMContentLoaded', function () {

    // buscar empresa 
    const selectBases = document.getElementById("bases");
    if (selectBases) {
        selectBases.addEventListener("change", async () => {
            console.log("Banco mudou, carregando empresas...");
            await load_emp();
            await load_cert_emp()
            
        });
    }

    
    //-------------------------------------------------------------------------------------

    const menus = document.querySelectorAll('.title_menu');
    if (menus[0]) {
        // --- Botão Certificados Instalados ---
        menus[0].addEventListener('click', () => {
            mostrarSecao('search');
            atualizarCertificados();

        });
    }

    if (menus[1]) {
        menus[1].addEventListener('click', () => {
            mostrarSecao('install');
            mostrarInstalacao();
        });
    }

    if (menus[2]) {
        menus[2].addEventListener('click', () => {
            alert("Função de converter ainda não implementada");
        });
    }

    if (menus[3]) {
        menus[3].addEventListener('click', () => {
            
            
            mostrarSecao('emp-certs');
            load_base();
            load_cert_bd()

            // 3. Ativa os monitores (clique e change) - só precisa rodar uma vez, mas não tem problema chamar aqui
            //monitorar_select_base();
        });
    }



    //------------------------------------------------------------------------------------------------------


    // --- Botão reconectar sql  ---
    const btnConectar = document.getElementById("conectar");
    if (btnConectar) {
        btnConectar.addEventListener("click", () => {
            connect_sql();
        });
    }

    document.getElementById("btnRefreshBase").addEventListener("click", () => {

        load_base()
    });

    // --- Botão Abrir Configuração  ---
    document.getElementById("config_sql").addEventListener("click", () => {

        document.querySelector(".all").style.display = "block";
    });

    // --- Botão Sair da Configuração ---
    document.getElementById("sair").addEventListener("click", () => {
        document.querySelector(".all").style.display = "none";
    });

});




// regex para extrair o CN de uma string
function extrairCN(texto) {
    const match = texto.match(/CN=([^,]+)/);
    return match ? match[1] : texto; // se não achar CN, retorna o texto original
}

function buscarCertificados() {
    window.pywebview.api.list_certs_install("MY")
        .then(response => {

            const container = document.querySelector('.certificados');
            container.innerHTML = ""; // limpa antes de inserir

            response.forEach(cert => {

                //dados do certificado
                let local = "";

                const emissorCN = extrairCN(cert.emissor || "");
                const requerenteCN = extrairCN(cert.requerente || "");
                const emitido = cert.validade_de;
                const expiracao = cert.validade_ate;
                let statusClass = "";
                let localcert = cert.local || "";
                let statuscert = cert.status || "";

                //cria a div do certificado
                const certDiv = document.createElement('div');
                certDiv.className = 'cert';


                //lógica para status do certificado

                if (statuscert === "Expirado") {
                    statusClass = "expirado";
                } else if (statuscert === "A expirar") {
                    statusClass = "a_expirar";
                } else {
                    statusClass = "valido";
                }

                if (localcert === "Machine") {
                    local = "icons/desktop.svg";
                } else {
                    local = "icons/user.svg";
                }



                certDiv.innerHTML = `
                <div class="top">
                    <div class="valor">${requerenteCN}</div>
                    <div class="valor">${emissorCN}</div>
                    <div class="valor">${emitido || ""}</div>
                    <div class="valor">${expiracao || ""}</div>
                    <div class="valor ${statusClass}">${statuscert}</div>
                </div>
                <div class="bottom">
                    <img class="icon" src="${local}" alt="imgem do local do certificado">
                    <button class ="excluir">excluir</button>
                </div>

                                `;

                certDiv.querySelector('.excluir').addEventListener('click', () => { excluirCertificado(cert); });

                container.appendChild(certDiv);
            });
        })
        .catch(err => {
            const container = document.querySelector('.certificados');
            container.innerHTML = `<p style="color:red;">Erro: ${err}</p>`;
        });
}

function buscar_certs(tipo) {
    window.pywebview.api.list_certs_install("MY")
        .then(response => {
            const container = document.querySelector('.certificados');
            container.innerHTML = ""; // limpa antes de inserir

            response.forEach(cert => {
                const status = (cert.status || "").toLowerCase();

                // decide se o certificado entra no filtro
                let incluir = false;
                if (tipo === "validos" && (status === "válido" || status === "valido")) incluir = true;
                if (tipo === "expirados" && status === "expirado") incluir = true;
                if (tipo === "a_expirar" && status === "a expirar") incluir = true;
                if (tipo === "todos") incluir = true;

                if (incluir) {
                    let local = cert.local === "Machine" ? "icons/desktop.svg" : "icons/user.svg";
                    const emissorCN = extrairCN(cert.emissor || "");
                    const requerenteCN = extrairCN(cert.requerente || "");
                    const emitido = cert.validade_de;
                    const expiracao = cert.validade_ate;

                    // define classe CSS
                    let statusClass = "";
                    if (status === "expirado") statusClass = "expirado";
                    else if (status === "a expirar") statusClass = "a_expirar";
                    else statusClass = "valido";

                    const certDiv = document.createElement('div');
                    certDiv.className = 'cert';

                    certDiv.innerHTML = `
                        <div class="top">
                            <div class="valor">${requerenteCN}</div>
                            <div class="valor">${emissorCN}</div>
                            <div class="valor">${emitido || ""}</div>
                            <div class="valor">${expiracao || ""}</div>
                            <div class="valor ${statusClass}">${cert.status}</div>
                        </div>
                        <div class="bottom">
                            <img class="icon" src="${local}" alt="imagem do local do certificado">
                            <button class="excluir">excluir</button>
                        </div>
                    `;

                    certDiv.querySelector('.excluir').addEventListener('click', () => { excluirCertificado(cert); });
                    container.appendChild(certDiv);
                }
            });
        })
        .catch(err => {
            const container = document.querySelector('.certificados');
            container.innerHTML = `<p style="color:red;">Erro ao buscar certificados: ${err}</p>`;
        });
}


function contarCertificados() {
    window.pywebview.api.list_certs_install("MY")
        .then(response => {

            //criar contagem total de certificados
            // total de certificados 
            let totalCerts = response.length;
            let totalExpirados = 0;
            let a_ser_expirados = 0;
            let validos = 0;



            response.forEach(cert => {

                let status = cert.status || "";

                if (status === "Expirado") {
                    totalExpirados += 1;

                }

                if (status === "A expirar") {
                    a_ser_expirados += 1;
                }
                if (status === "Válido") {
                    validos += 1;
                }
            })

            const blocos = document.querySelector('.blocos');
            blocos.innerHTML = "";

            const blocoDiv = document.createElement('div');
            blocoDiv.className = 'bloco-titulo';
            blocoDiv.innerHTML = `<h2>Estatísticas de Certificados</h2>`;
            blocos.appendChild(blocoDiv);


            //criar uma nova div para os cards
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'cards-container';
            blocos.appendChild(cardsContainer);

            const totalDiv = document.createElement('div');
            totalDiv.className = 'bloco-total';
            totalDiv.innerHTML = `<p>Total de Certificados</p><h3>${totalCerts}</h3>`;
            totalDiv.addEventListener("click", () => buscar_certs("todos"));
            cardsContainer.appendChild(totalDiv);

            const expiradosDiv = document.createElement('div');
            expiradosDiv.className = 'bloco-total';
            expiradosDiv.innerHTML = `<p>Certificados Expirados</p><h3>${totalExpirados}</h3>`;
            expiradosDiv.addEventListener("click", () => buscar_certs("expirados"));
            cardsContainer.appendChild(expiradosDiv);

            const validosDiv = document.createElement('div');
            validosDiv.className = 'bloco-total';
            validosDiv.innerHTML = `<p>Certificados Válidos</p><h3>${validos}</h3>`;
            validosDiv.addEventListener("click", () => buscar_certs("validos"));
            cardsContainer.appendChild(validosDiv);

            const a_ser_expiradosDiv = document.createElement('div');
            a_ser_expiradosDiv.className = 'bloco-total';
            a_ser_expiradosDiv.innerHTML = `<p>Expira em 30 dias</p><h3>${a_ser_expirados}</h3>`;
            a_ser_expiradosDiv.addEventListener("click", () => buscar_certs("a_expirar"));
            cardsContainer.appendChild(a_ser_expiradosDiv);


        })
}


function atualizarCertificados() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block'; // mostra imediatamente

    const startTime = Date.now();

    Promise.all([
        buscarCertificados(),
        contarCertificados()
    ]).then(() => {
        const elapsed = Date.now() - startTime;
        const remaining = 1000 - elapsed; // tempo que falta para completar 1s

        if (remaining > 0) {
            setTimeout(() => {
                loading.style.display = 'none';
            }, remaining);
        } else {
            loading.style.display = 'none';
        }
    }).catch(() => {
        loading.style.display = 'none';
    });
}


function excluirCertificado(cert) {
    const confirmar = confirm(
        `Deseja realmente excluir o certificado ${cert.numeroSerie} do ${cert.local === "User" ? "usuário" : "máquina"}?`
    );

    if (!confirmar) {
        alert("Exclusão cancelada pelo usuário.");
        return;
    }

    const local = cert.local.toLowerCase();

    if (local === "user") {
        window.pywebview.api.delete_cert_user(cert.numero_serie, "MY")
            .then(res => {
                console.log("Resposta recebida:", res);
                if (res.success) {
                    alert(res.mensagem || "Certificado do usuário removido com sucesso!");
                    atualizarCertificados();
                } else {
                    alert("Erro ao deletar do usuário: " + res.erro);
                }
            })
            .catch(err => console.error(err));
    } else if (local === "machine") {
        window.pywebview.api.delete_cert_machine(cert.numero_serie, "MY")
            .then(res => {
                console.log("Resposta recebida:", res);
                if (res.success) {
                    alert(res.mensagem || "Certificado da máquina removido com sucesso!");
                    atualizarCertificados();
                } else {
                    alert("Erro ao deletar da máquina: " + res.erro);
                }
            })
            .catch(err => console.error(err));
    }
}



