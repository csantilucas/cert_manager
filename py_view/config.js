export function connect_sql() {
    let server = document.getElementById('servidor').value;
    let instancia = document.getElementById('instancia').value;
    let user = document.getElementById('user').value;
    let pass = document.getElementById('password').value;

    window.pywebview.api.conectar_sql(server, instancia, user, pass)
        .then(response => { // 1. Variável definida como 'response'
            
            console.log("Resposta do Python:", response);

            // 2. Correção: Trocado 'respose' por 'response'


            const divResultado = document.getElementById("resultado_conexao");
            divResultado.innerHTML = response; 
            
            // 3. Correção: Trocado 'resposta' por 'response'
            // 4. Correção: Trocado 'resultado_conexao' por 'resultado' (que é o ID real do seu HTML)
            if (response.includes("Erro") || response.includes("❌")) {
                divResultado.style.color = "#ff5555"; // Vermelho
                document.getElementById("config_sql").innerHTML=`<img id="config_ico" src="./icons/config_erro.svg" alt="config">`


            } else {
                divResultado.style.color = "#55ff55"; // Verde
                document.getElementById("config_sql").innerHTML=`<img id="config_ico" src="./icons/config_connect.svg" alt="config">`

            }
        })
        .catch(err => {
            console.error("Erro ao chamar Python:", err);
        });
}