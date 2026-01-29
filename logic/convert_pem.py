import os
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import pkcs12

def convert_cert_toPem(caminho_pfx, senha):
    try:
        # 1. Verifica existência
        if not os.path.exists(caminho_pfx):
            return {"sucesso": False, "erro": "Arquivo PFX não encontrado."}

        # 2. Define nomes de saída baseados no original
        nome_base = os.path.splitext(caminho_pfx)[0]
        caminho_cert = f"{nome_base}.pem"      # Arquivo "Sem chave" (Público)
        caminho_key = f"{nome_base}_key.pem"   # Arquivo "Com chave" (Privado)

        # 3. Trata a senha
        if isinstance(senha, str):
            senha_bytes = senha.encode('utf-8')
        else:
            senha_bytes = senha

        # 4. Lê e Carrega o PFX
        with open(caminho_pfx, "rb") as f:
            pfx_data = f.read()

        private_key, certificate, additional_certs = pkcs12.load_key_and_certificates(
            pfx_data, senha_bytes
        )

        arquivos_gerados = []

        # 5. Exporta o CERTIFICADO (Sem chave)
        if certificate:
            with open(caminho_cert, "wb") as f:
                f.write(certificate.public_bytes(serialization.Encoding.PEM))
            arquivos_gerados.append(caminho_cert)

        # 6. Exporta a CHAVE PRIVADA (Com chave) exportando sem senha (NoEncryption) para ser fácil de usar em sistemas
        if private_key:
            with open(caminho_key, "wb") as f:
                f.write(private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                ))
            arquivos_gerados.append(caminho_key)

        print(arquivos_gerados)
        return {
            "sucesso": True, 
            "mensagem": "Arquivos extraídos com sucesso!", 
            "arquivos": arquivos_gerados
        }

    except ValueError:
        return {"sucesso": False, "erro": "Senha incorreta."}
    except Exception as e:
        return {"sucesso": False, "erro": str(e)}


