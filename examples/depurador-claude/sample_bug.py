"""
AI Agents Starter Kit – Exemplo de código com bugs para depurar.
Use o agente Claude para identificar e corrigir os problemas abaixo.
"""


def calcular_media(numeros):
    """Calcula a média de uma lista de números."""
    # BUG 1: Divisão por zero quando a lista está vazia
    total = sum(numeros)
    return total / len(numeros)


def buscar_usuario(usuarios, nome):
    """Busca um usuário pelo nome (case-sensitive)."""
    for usuario in usuarios:
        # BUG 2: Comparação incorreta – deveria ser case-insensitive
        if usuario["nome"] == nome:
            return usuario
    return None


def processar_pedidos(pedidos):
    """Processa uma lista de pedidos e retorna o total."""
    # BUG 3: Variável `total` usada antes de ser inicializada
    for pedido in pedidos:
        total += pedido["valor"]
    return total


def listar_arquivos(diretorio):
    """Lista arquivos de um diretório recursivamente."""
    import os
    resultado = []
    for item in os.listdir(diretorio):
        caminho = os.path.join(diretorio, item)
        if os.path.isdir(caminho):
            # BUG 4: Loop infinito potencial – falta de limite de profundidade
            resultado.extend(listar_arquivos(caminho))
        else:
            resultado.append(caminho)
    return resultado


def formatar_data(data_str):
    """Converte string de data para objeto datetime."""
    from datetime import datetime
    # BUG 5: Formato de data incorreto (usa '-' mas espera '/')
    return datetime.strptime(data_str, "%d/%m/%Y")


# Código de demonstração
if __name__ == "__main__":
    # Teste 1: divisão por zero
    print(calcular_media([]))  # Vai lançar ZeroDivisionError

    # Teste 2: busca case-sensitive
    usuarios = [{"nome": "Alice"}, {"nome": "Bob"}]
    print(buscar_usuario(usuarios, "alice"))  # Retorna None (bug)

    # Teste 3: variável não inicializada
    pedidos = [{"valor": 10}, {"valor": 20}]
    print(processar_pedidos(pedidos))  # Vai lançar UnboundLocalError
