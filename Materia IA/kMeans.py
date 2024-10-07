import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Organizar os dados como um DataFrame
data = {
    'Comprimento': [8.5, 9, 7.8, 8.2, 8.9, 9.2, 8.4, 9, 8.7, 9.1, 8.6, 8.9, 9.2, 8.8, 8.4, 9.1, 8.7, 9, 8.6, 9.2, 10.5, 10, 8.3, 8.2, 8.8, 10.1, 8.7, 10.9, 8.2, 10.2, 8.5, 8, 8.5, 10.3, 8.6, 10.4, 8.7, 8.5, 8.9, 10, 8, 7.5, 8.3, 7.8, 8.2, 7.7, 8.5, 8.1, 7.9, 8.3, 7.6, 8, 7.4, 8.1, 7.9, 8.4, 7.8, 8.2, 7.5, 8],
    'Altura': [8.4, 9.1, 7.9, 8.3, 8.8, 9.1, 8.3, 9, 8.6, 9.2, 8.5, 8.7, 9.2, 8.7, 8.5, 9, 8.8, 9, 8.7, 9.1, 4.5, 5, 4.8, 4.7, 4.3, 5.1, 4.9, 5, 4.4, 5.2, 4.5, 4.6, 4.2, 5.1, 4.7, 5.3, 4.6, 4.8, 4.4, 5, 12.5, 13.8, 13.5, 10.3, 11.7, 12.6, 12.2, 13.9, 10.5, 11.3, 10.1, 11, 14, 11.5, 14.5, 11.3, 10.9, 11.4, 10, 11.1]
    
}

df = pd.DataFrame(data)

# Aplicando o KMeans com k = 3 (laranja, banana e abacaxi)
kmeans = KMeans(n_clusters=3, random_state=0)
clusters = kmeans.fit_predict(df)

# Adicionando o resultado dos clusters ao DataFrame
df['Cluster'] = clusters

# Exibindo o DataFrame com os grupos identificados
print(df)

# Sumário das cores que representam cada fruta
cluster_colors = {0: 'Banana', 1: 'Abacaxi', 2: 'Laranja'}

print("\nResumo das cores e suas frutas:")
for cluster, fruit in cluster_colors.items():
    print(f"Cluster {cluster}: {fruit}")

# Plot para visualização dos clusters
plt.scatter(df['Comprimento'], df['Altura'], c=df['Cluster'], cmap='viridis')
plt.xlabel('Comprimento')
plt.ylabel('Altura')
plt.title('K-Means Clustering of Fruits')

# Adicionando legenda de cores para cada fruta
handles = [plt.Line2D([0], [0], marker='o', color='w', label=fruit, markerfacecolor=plt.cm.viridis(i / 2), markersize=10) for i, fruit in cluster_colors.items()]

plt.legend(handles=handles)
plt.show()