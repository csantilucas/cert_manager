class Cert:
    def __init__(self, numero_serie, emissor, requerente, validade_de, validade_ate, local, status):
        self.numero_serie = numero_serie
        self.emissor = emissor
        self.requerente = requerente
        self.validade_de = validade_de
        self.validade_ate = validade_ate
        self.local = local
        self.status = status
        

    def __str__(self):
        return (
            f"=== Certificado ===\n"
            f"Número de Série: {self.numero_serie}\n"
            f"Emissor: {self.emissor}\n"
            f"Requerente: {self.requerente}\n"
            f"Validade de: {self.validade_de}\n"
            f"Validade até: {self.validade_ate}\n"
            f"Local: {self.local}\n"
            f"Status: {self.status}\n"
            f"-------------------\n"
        )
