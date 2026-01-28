import pyodbc


def connect_database(server, instancia,user, password):
    
    data_connect = ( 
    "Driver={SQL Server};"
    rf"Server={server}\{instancia};"
    f"UID={user};"
    f"PWD={password};"
    "Trusted_Connection=no;"
    )
    try:
        connect = pyodbc.connect(data_connect)
        print("Connexao bem sucedida")
        return connect
    except Exception as error:
        print("falha ao se conectar erro --->", error)
        return error
    

class ddl:
    @staticmethod
    def list_db(conexao):
        lista_bancos = []
        try:
            cursor = conexao.cursor()
            cursor.execute("SELECT name FROM sys.databases")
            for db in cursor.fetchall():
                lista_bancos.append(db[0])
            return lista_bancos
        except Exception as e:
            return [f"Erro: {e}"]
        finally:
            # FECHA O CURSOR PARA LIBERAR A CONEXÃO
            if cursor:
                cursor.close()    
    @staticmethod
    def select_apl(conexao, base):       
        print(f"--- INICIANDO select_apl NA BASE {base} ---") # Debug no terminal
        resultados = []
        try:
            # 1. Verifica conexão
            if not conexao:
                print("Erro: Conexão inexistente")
                return []

            cursor = conexao.cursor()
            
            # 2. Select Simplificado (Testado por você)
            sql = f"SELECT NM_FANTASIA, NM_CERTIFICADO, NFE_DATA_VENC_CERTIFICADO FROM [{base}].dbo.APL"
            
            print(f"Executando SQL: {sql}") # Debug
            cursor.execute(sql)
            
            for linha in cursor.fetchall():
                # --- TRATAMENTO DE DATA (O PULO DO GATO) ---
                date = linha[2] # Pega o objeto de data do banco
                
                if date:
                   
                    data_formatada = date.strftime('%d/%m/%Y')
                else:
                    data_formatada = "---"

                # Monta o objeto
                resultados.append({
                    "nome": str(linha[0]) if linha[0] else "Sem Nome",
                    "cert": str(linha[1]) if linha[1] else "---",
                    "venc": data_formatada  # Agora enviamos o texto formatado
                })
            
            print(f"Sucesso! Retornando {len(resultados)} linhas.") # Debug
            return resultados

        except Exception as e:
            print(f"ERRO CRÍTICO NO PYTHON: {e}") # Isso vai aparecer no seu terminal
            return []
        finally:
            # FECHA O CURSOR PARA LIBERAR A CONEXÃO
            if cursor:
                cursor.close()
    @staticmethod
    def select_apl_empresas(conexao, base):
        resultados = []
        try:
                    cursor = conexao.cursor()
                    
                    sql = f"SELECT NM_FANTASIA FROM [{base}].dbo.APL"
                    
                    cursor.execute(sql)
                    for linha in cursor.fetchall():
                        resultados.append(linha[0]) 
                        
                    
                    return resultados
        except Exception as e:
                    return [f"Erro: {e}"]
        finally:
            # FECHA O CURSOR PARA LIBERAR A CONEXÃO
            if cursor:
                cursor.close()
    
    
  
        