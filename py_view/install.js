export function mostrarInstalacao() {
    const installSection = document.getElementById('install');
    installSection.innerHTML = ""; // limpa qualquer conteúdo anterior

    // bloco título
    const tituloDiv = document.createElement('div');
    tituloDiv.className = 'bloco-titulo';
    tituloDiv.innerHTML = "<h2>Instalar Certificado</h2>";
    installSection.appendChild(tituloDiv);

    // bloco input com botão
    const inputDiv = document.createElement('div');
    inputDiv.className = 'bloco-input';

    // input file
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.accept = ".cer,.crt,.pfx"; // restringe tipos
    inputDiv.appendChild(fileInput);

    // botão
    const btn = document.createElement('button');
    btn.id = "installBtn";
    btn.textContent = "Selecione um Certificado";
    inputDiv.appendChild(btn);

    installSection.appendChild(inputDiv);

    // container de resultado
    const resultDiv = document.createElement('div');
    resultDiv.id = "installResult";
    resultDiv.className = "install-result";
    installSection.appendChild(resultDiv);

    // mostra a seção
    installSection.style.display = "block";

    // liga o botão à função instalarCertificado
    btn.addEventListener('click', instalarCertificado);


}


export function instalarCertificado() {
    window.pywebview.api.escolher_certificado()
        .then(caminho => {
            if (caminho) {
                window.pywebview.api.install_cert_file(caminho)
                    .then(result => {
                        if (result === true) {
                            // mostra a seção
                            document.getElementById('install').style.display = "block";

                            const certDiv = document.createElement('div');
                            certDiv.className = 'install-result';
                            certDiv.innerHTML = `
                                <h3>Instalação iniciada</h3>
                                <p>O assistente do Windows foi aberto. Conclua a instalação do certificado.</p>
                            `;

                            const container = document.getElementById('installResult');
                            container.innerHTML = "";
                            container.appendChild(certDiv);
                        } else {
                            alert("Não foi possível abrir o certificado");
                        }
                    });
            } else {
                alert("Nenhum arquivo selecionado");
            }
        });
}



