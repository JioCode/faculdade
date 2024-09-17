from collections import deque

# Função para verificar se o estado já foi visitado
def is_visited(state, visited):
    return state in visited

# Função para realizar a busca em largura e encontrar todos os caminhos
def bfs_all_paths():
    # Fila de estados a serem explorados junto com o caminho percorrido até cada estado
    queue = deque([((0, 0), [])])
    # Conjunto de estados visitados
    visited = set()
    visited.add((0, 0))
    
    # Lista para armazenar todos os caminhos que levam ao estado objetivo
    all_paths = []
    
    while queue:
        (x, y), path = queue.popleft()
        
        # Atualiza o caminho com o estado atual
        current_path = path + [(x, y)]
        
        # Verifica se alcançou o estado objetivo
        if x == 2:
            all_paths.append(current_path)
            # Não retorna, pois queremos encontrar todos os caminhos possíveis
        
        # Operações possíveis
        # 1. Encher o jarro de 4 litros
        if not is_visited((4, y), visited):
            queue.append(((4, y), current_path))
            visited.add((4, y))
        
        # 2. Encher o jarro de 3 litros
        if not is_visited((x, 3), visited):
            queue.append(((x, 3), current_path))
            visited.add((x, 3))
        
        # 3. Esvaziar o jarro de 4 litros
        if not is_visited((0, y), visited):
            queue.append(((0, y), current_path))
            visited.add((0, y))
        
        # 4. Esvaziar o jarro de 3 litros
        if not is_visited((x, 0), visited):
            queue.append(((x, 0), current_path))
            visited.add((x, 0))
        
        # 5. Transferir água do jarro de 4 litros para o de 3 litros
        transfer = min(x, 3 - y)
        new_x, new_y = x - transfer, y + transfer
        if not is_visited((new_x, new_y), visited):
            queue.append(((new_x, new_y), current_path))
            visited.add((new_x, new_y))
        
        # 6. Transferir água do jarro de 3 litros para o de 4 litros
        transfer = min(y, 4 - x)
        new_x, new_y = x + transfer, y - transfer
        if not is_visited((new_x, new_y), visited):
            queue.append(((new_x, new_y), current_path))
            visited.add((new_x, new_y))
    
    return all_paths  # Retorna todos os caminhos encontrados

# Execução da busca e exibição de todos os caminhos encontrados
result = bfs_all_paths()

if result:
    print("Caminhos até o estado objetivo:")
    for idx, path in enumerate(result):
        print(f"Caminho {idx + 1}:")
        for step in path:
            print(step)
        print("-------------")
else:
    print("Nenhuma solução encontrada.")
