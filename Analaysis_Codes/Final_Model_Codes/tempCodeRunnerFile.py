import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import json

# Step 1: Load and Prepare the Data
# Assuming 'clicks.json' contains click data with x, y, color, and timestamp
with open('clicks_unstop.com.json', 'r') as f:
    data = json.load(f)

clicks = data['clicks']
df = pd.DataFrame(clicks)

# Step 2: Exploratory Data Analysis (EDA)
# Check for missing values
print("Missing Values:\n", df.isnull().sum())

# Summary statistics for numerical columns
print("\nSummary Statistics:\n", df.describe())

# Distribution of colors (proxy for click density)
print("\nColor Distribution:\n", df['color'].value_counts())

# Visualize click coordinates with color coding
plt.figure(figsize=(10, 6))
plt.scatter(df['x'], df['y'], c=df['color'].map({'green': 'green', 'yellow': 'yellow', 'red': 'red'}), alpha=0.5)
plt.xlabel('X Coordinate')
plt.ylabel('Y Coordinate')
plt.title('Spatial Distribution of Clicks')
plt.savefig('click_distribution.png')

# Step 3: Feature Engineering
# Map colors to interaction levels (green=1, yellow=2, red=3)
color_map = {'green': 1, 'yellow': 2, 'red': 3}
df['interaction_level'] = df['color'].map(color_map)

# Step 4: Clustering to Identify Site Regions
# Use K-Means to group clicks into 5 clusters
kmeans = KMeans(n_clusters=5, random_state=42)
df['cluster'] = kmeans.fit_predict(df[['x', 'y']])

# Step 5: Calculate Interaction Scores per Cluster
# Average interaction level per cluster
cluster_interaction = df.groupby('cluster')['interaction_level'].mean()
print("\nAverage Interaction Level per Cluster:\n", cluster_interaction)

# Identify the most interactive cluster
most_interactive_cluster = cluster_interaction.idxmax()
print(f"\nMost Interactive Cluster: {most_interactive_cluster}")

# Step 6: Visualize Clusters with Highlight
plt.figure(figsize=(10, 6))
plt.scatter(df['x'], df['y'], c=df['cluster'], cmap='viridis', alpha=0.5)
plt.scatter(df[df['cluster'] == most_interactive_cluster]['x'],
            df[df['cluster'] == most_interactive_cluster]['y'],
            c='red', label='Most Interactive', edgecolor='black')
plt.xlabel('X Coordinate')
plt.ylabel('Y Coordinate')
plt.title('Click Clusters with Most Interactive Region Highlighted')
plt.legend()
plt.savefig('cluster_interaction.png')

# Step 7: Simple ML Model (Optional Classification)
# For demonstration, predict interaction level based on coordinates
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X = df[['x', 'y']]
y = df['interaction_level']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(random_state=42)
clf.fit(X_train, y_train)
accuracy = clf.score(X_test, y_test)
print(f"\nRandom Forest Accuracy: {accuracy:.2f}")

# Example prediction for new click coordinates
new_click = np.array([[500, 300]])
predicted_level = clf.predict(new_click)
print(f"Predicted Interaction Level for (500, 300): {predicted_level[0]}")