import webview
import sys
import os

# garante que a pasta raiz está no path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from logic.list_cert import certs as lc
from sql_connect.connect import connect_database, ddl


class Api:
    
    def __init__(self):
        self.conexao_ativa = None
        
    def conectar_sql(self, server, instancia, user, password):
        print("Criando conexao...")
        resultado = connect_database(server, instancia, user, password)
        #Cria a conexao se for bem sucedida guarda na memoria o resultado
        if isinstance(resultado,Exception):
            self.connexao_ativa = None
            return f"❌ Erro: {resultado}"
        else:
            self.conexao_ativa = resultado
            return "✅ Conectado! Credenciais salvas na memória."
       
    def listar_bancos(self):
        if self.conexao_ativa is None:
            return ["⚠️ Erro: Você precisa conectar primeiro!"]
        return ddl.list_db(self.conexao_ativa)

    def listar_cert_banco(self, base):
        if self.conexao_ativa is None:
            return ["⚠️ Erro: Você precisa conectar primeiro!"]
        return ddl.select_apl(self.conexao_ativa,base)
    
    def listar_emp(self, base):
        if self.conexao_ativa is None:
            return ["⚠️ Erro: Você precisa conectar primeiro!"]
        return ddl.select_apl_empresas(self.conexao_ativa,base)
    
    def list_certs_install(self, store="MY"):
        certs_list = lc.list_certs_install(store)
        return [c.__dict__ for c in certs_list]

    def install_cert_file(self, caminho_arquivo):
        print(">>> Recebi caminho:", caminho_arquivo)
        if not caminho_arquivo:
            print(">>> Nenhum caminho recebido")
            return None
        cert = lc.install_cert_file(caminho_arquivo)
        print(">>> Resultado da instalação:", cert)
        if cert:
            return cert.__dict__
        return None

    def delete_cert_user(self, numero_serie, store="MY"):
        return lc.delete_cert_user(numero_serie, store=store)

    def delete_cert_machine(self, numero_serie, store="MY"):
        return lc.delete_cert_machine(numero_serie, store=store)

    def escolher_certificado(self):
        caminho = window.create_file_dialog(
            webview.OPEN_DIALOG,
            allow_multiple=False,
            file_types=['Certificados (*.cer;*.crt;*.pfx)']
        )
        print(">>> Caminho retornado:", caminho)
        return caminho[0] if caminho else None
    
    



api = Api()
window = webview.create_window(
    'Certificados',
    "index.html",
    js_api=api,
    height=728,
    width=1366,
    resizable=True
)
webview.start()
