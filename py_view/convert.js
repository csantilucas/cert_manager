

export function mostrarCerts() {
    const btnColetar = document.getElementById("btnBuscarPfx");
    const inputCaminho = document.getElementById("input_caminho_pfx");

    if (btnColetar && inputCaminho) {
        // O evento de clique deve ser ASYNC pois vamos chamar o Python
        btnColetar.addEventListener("click", async () => {
            
            const caminhoRetornado = await window.pywebview.api.caminho_convert_cert();

            if (caminhoRetornado) {
                inputCaminho.value = caminhoRetornado; // Input usa .value
            }
        });
    }
}


export async function convert_cert() {
    
    // Pega os valores do HTML
    const inputCaminho = document.getElementById("input_caminho_pfx");
    const inputSenha = document.getElementById("input_senha_pfx");
    const statusMsg = document.getElementById("status_conversao");

    const caminho = inputCaminho.value;
    const senha = inputSenha.value;

    // Validação básica antes de chamar o Python
    if (!caminho) {
        alert("Por favor, selecione um arquivo PFX primeiro.");
        return;
    }

    // Feedback visual (Carregando...)
    statusMsg.innerText = "Processando...";
    statusMsg.style.color = "yellow";
    statusMsg.style.display = "block";

    try {
        // Chama o Python e espera a resposta
        // Nota: O padrão é 'window.pywebview.api', verifique se o seu não é apenas 'window.webview.api'
        const response = await window.pywebview.api.convert_cert(caminho, senha);

        // Verifica o resultado vindo do Python
        if (response.sucesso) {
            // SUCESSO
            statusMsg.innerHTML = `✅ Sucesso!<br>Arquivos gerados em: ${response.arquivo_gerado || 'mesma pasta'}`;
            statusMsg.style.color = "#00ff00"; // Verde
            alert(response.mensagem);
        } else {
            // ERRO (Senha errada ou arquivo ruim)
            statusMsg.innerText = `❌ Erro: ${response.erro}`;
            statusMsg.style.color = "#ff4d4f"; // Vermelho
        }

    } catch (error) {
        console.error(error);
        statusMsg.innerText = "❌ Erro crítico de comunicação com o Python.";
        statusMsg.style.color = "#ff4d4f";
    }
}