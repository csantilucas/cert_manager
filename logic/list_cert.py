import os
import subprocess
import re
from models.cert_class import Cert
from datetime import datetime, timedelta, UTC

def run_certutil(comando): return subprocess.run( comando, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW )

def cert_exists(numero_serie, store="MY", user=False):
    comando = ["certutil"]
    if user:
        comando.append("-user")
    comando.extend(["-store", store])
    resultado = run_certutil(comando)
    return numero_serie in resultado.stdout

def parse_data(data_str):
    """Tenta converter a string de data em datetime, aceitando com ou sem segundos."""
    for fmt in ("%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M"):
        try:
            return datetime.strptime(data_str, fmt)
        except ValueError:
            continue
    return None


class certs:

        #lisatar certificados em uma pasta
    @staticmethod
    def list_cert_files(pasta: str):
    
        local_arquivos = [] 
        for raiz, dirs, files in os.walk(pasta):
            for arquivo in files:
                if arquivo.endswith((".pem", ".crt", ".cer", ".pfx")):
                    caminho_completo = os.path.join(raiz, arquivo)
                    print(caminho_completo)
                    local_arquivos.append(caminho_completo)
        return local_arquivos


        # Processar a saída do comando certutil que busca certificados instalados
    @staticmethod
    def load_certs_install(output, origem):
        blocos = output.split("=============== Certificado")
        certificados = []

        for bloco in blocos[1:]:
            numero_serie = re.search(r"Número de Série:\s*(.+)", bloco)
            emissor = re.search(r"Emissor:\s*(.+)", bloco)
            requerente = re.search(r"Requerente:\s*(.+)", bloco)
            validade_de = re.search(r"NotBefore:\s*(.+)", bloco)
            validade_ate = re.search(r"NotAfter:\s*(.+)", bloco)
            local = origem

            validade_de_str = validade_de.group(1).strip() if validade_de else None
            validade_ate_str = validade_ate.group(1).strip() if validade_ate else None

            validade_de_dt = parse_data(validade_de_str) if validade_de_str else None
            validade_ate_dt = parse_data(validade_ate_str) if validade_ate_str else None

            # calcular status
            agora = datetime.now()
            if validade_ate_dt and validade_ate_dt < agora:
                status = "Expirado"
            elif validade_ate_dt and validade_ate_dt <= agora + timedelta(days=30):
                status = "A expirar"
            else:
                status = "Válido"

            cert = Cert(
                numero_serie.group(1).strip() if numero_serie else None,
                emissor.group(1).strip() if emissor else None,
                requerente.group(1).strip() if requerente else None,
                validade_de_str,
                validade_ate_str,
                local,
                status  # novo campo
            )
            certificados.append(cert)

        return certificados


        #Listar certificados instalados a partir da saida do certutil
    @staticmethod
    def list_certs_install(store="MY"):
        # Usuário
        result_user = subprocess.run(["certutil", "-user", "-store", store], capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW )
        certs_user = certs.load_certs_install(result_user.stdout, "User")

        # Máquina
        result_machine = subprocess.run(["certutil", "-store", store], capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW )
        certs_machine = certs.load_certs_install(result_machine.stdout, "Machine")

        # Junta tudo
        return certs_user + certs_machine
    @staticmethod
    def delete_cert_user(numero_serie, store="MY"):
        if not numero_serie:
            return {"success": False, "erro": "Número de série não informado"}
        if not store:
            store = "MY"

        resultado = run_certutil(["certutil", "-user", "-delstore", str(store), str(numero_serie)])
        stdout = resultado.stdout.strip()

        check = run_certutil(["certutil", "-user", "-store", str(store)])
        if str(numero_serie) not in check.stdout:
            return {"success": True, "mensagem": f"Removido do usuário: {stdout}"}
        else:
            return {"success": False, "erro": "Não foi possível remover do usuário"}

    @staticmethod
    def delete_cert_machine(numero_serie, store="MY"):
        """Remove certificado do Machine Store"""
        if not numero_serie:
            return {"success": False, "erro": "Número de série não informado"}
        if not store:
            store = "MY"

        # tenta excluir
        resultado = run_certutil(["certutil", "-delstore", str(store), str(numero_serie)])
        stdout = resultado.stdout.strip()

        # checa se realmente sumiu
        check = run_certutil(["certutil", "-store", str(store)])
        if str(numero_serie) not in check.stdout:
            return {"success": True, "mensagem": f"Removido da máquina: {stdout}"}
        else:
            return {"success": False, "erro": "Não foi possível remover da máquina (verifique permissões de administrador)"}


    @staticmethod
    def install_cert_file(caminho_arquivo: str):
        if not caminho_arquivo:
            return None
        os.startfile(caminho_arquivo)   # abre o assistente de instalação do Windows
        return True   # só indica que o comando foi disparado



