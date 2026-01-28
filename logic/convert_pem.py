from cryptography.hazmat.primitives.serialization import pkcs12, Encoding, PrivateFormat, NoEncryption
from cryptography.hazmat.primitives.serialization import BestAvailableEncryption
import sys

# Caminho do arquivo PFX
pfx_path = r"C:\Users\lucas\Desktop\cert.pfx"
pfx_password = b"Nativa@1"  # senha do PFX em bytes

# Ler o arquivo PFX
with open(pfx_path, "rb") as f:
    pfx_data = f.read()

# Carregar o PFX
private_key, certificate, additional_certs = pkcs12.load_key_and_certificates(
    pfx_data, pfx_password
)

# Exportar certificado para PEM
with open("certificado.pem", "wb") as f:
    f.write(certificate.public_bytes(Encoding.PEM))


print("✅ Conversão concluída! Arquivo gerado: certificado.pem")
