import json
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

# Load the JSON data
with open('clicks_unstop.com.json', 'r') as f:
    data = json.load(f)

clicks = data['clicks']
x = [click['x'] for click in clicks]
y = [click['y'] for click in clicks]
timestamps = [click['timestamp'] for click in clicks]

# --- Original Grid-Based Analysis ---
# Define grid size (e.g., 100x100 pixels per region)
grid_size = 100
max_x = max(x)
max_y = max(y)
grid_x = int(np.ceil(max_x / grid_size))
grid_y = int(np.ceil(max_y / grid_size))

# Assign clicks to grid regions
regions = [(int(click['x'] // grid_size), int(click['y'] // grid_size)) for click in clicks]

# Count clicks per region
region_counts = Counter(regions)
top_regions = sorted(region_counts.items(), key=lambda x: x[1], reverse=True)[:5]

# Create labels for top regions (e.g., "Row 2, Col 3")
region_labels = [f"Row {r[0][1]}, Col {r[0][0]}" for r in top_regions]

# Plot 1: Bar chart of top 5 grid regions by click count
plt.figure(figsize=(10, 6))
plt.bar(region_labels, [r[1] for r in top_regions], color='skyblue')
plt.title('Top 5 Most Clicked Grid Regions')
plt.xlabel('Region')
plt.ylabel('Number of Clicks')
plt.savefig('top_grid_regions.png')

# Temporal analysis for grid regions
start_time = min(timestamps)
end_time = max(timestamps)
time_bins = np.arange(start_time, end_time + 10000, 10000)  # 10-second bins

region_time_counts = {region: np.zeros(len(time_bins) - 1) for region, _ in top_regions}
for click, region in zip(clicks, regions):
    if region in [r[0] for r in top_regions]:
        bin_index = np.searchsorted(time_bins, click['timestamp'], side='right') - 1
        if 0 <= bin_index < len(time_bins) - 1:
            region_time_counts[region][bin_index] += 1

# Plot 2: Line plot of clicks over time for top 5 grid regions
plt.figure(figsize=(10, 6))
for region, counts in region_time_counts.items():
    label = f"Row {region[1]}, Col {region[0]}"
    plt.plot(time_bins[:-1], counts, label=label)
plt.title('Click Frequency Over Time for Top 5 Grid Regions')
plt.xlabel('Time (ms since start)')
plt.ylabel('Number of Clicks')
plt.legend()
plt.savefig('grid_clicks_over_time.png')

# --- New Analysis: General Site Parts ---
# Define 5 general parts based on coordinates (assuming 1400x600 page)
def assign_general_part(x, y):
    mid_x, mid_y = 700, 300
    if x < mid_x and y < mid_y:
        return "Top Left"
    elif x >= mid_x and y < mid_y:
        return "Top Right"
    elif x < mid_x and y >= mid_y:
        return "Bottom Left"
    elif x >= mid_x and y >= mid_y:
        return "Bottom Right"
    else:
        return "Center"  # Fallback, though unlikely with clear quadrants

general_parts = [assign_general_part(click['x'], click['y']) for click in clicks]
part_counts = Counter(general_parts)
top_parts = sorted(part_counts.items(), key=lambda x: x[1], reverse=True)[:5]
part_labels = [p[0] for p in top_parts]

# Plot 3: Bar chart of top 5 general parts by click count
plt.figure(figsize=(10, 6))
plt.bar(part_labels, [p[1] for p in top_parts], color='lightgreen')
plt.title('Top 5 Most Clicked General Parts of the Site')
plt.xlabel('Site Part')
plt.ylabel('Number of Clicks')
plt.savefig('top_general_parts.png')

# Temporal analysis for general parts
part_time_counts = {part: np.zeros(len(time_bins) - 1) for part, _ in top_parts}
for click, part in zip(clicks, general_parts):
    if part in part_labels:
        bin_index = np.searchsorted(time_bins, click['timestamp'], side='right') - 1
        if 0 <= bin_index < len(time_bins) - 1:
            part_time_counts[part][bin_index] += 1

# Plot 4: Line plot of clicks over time for top 5 general parts
plt.figure(figsize=(10, 6))
for part, counts in part_time_counts.items():
    plt.plot(time_bins[:-1], counts, label=part)
plt.title('Click Frequency Over Time for Top 5 General Parts')
plt.xlabel('Time (ms since start)')
plt.ylabel('Number of Clicks')
plt.legend()
plt.savefig('general_parts_clicks_over_time.png')