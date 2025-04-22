
# Cognition and Information Processing in Design ( CIPD DES523)
The project repository for the course `Cognition and Information Processing in Design ( CIPD DES523)`. We came up with a collection of tools, experiments, and machine learning models  to study how experience design elements impact user cognitive load, memory recall, user engagement, decision pattern and interaction patterns. We also explored the effects of distractions (e.g., flashing elements, animations) on user performance.

---

## Overview

This repository focuses on evaluating how interface elements such as flashing banners, animated components, and label density affect users' memory recall and decision-making processes. It includes:

- **Cognitive Experiments**: Web-based tests to measure memory recall under varying levels of distraction.
- **Interaction Tracking**: Real-time monitoring of user clicks, scrolls, and engagement via JavaScript tools.
- **Data Analysis**: Visualizations and statistical analyses of user behavior and cognitive performance.
- **Machine Learning Models**: Predictive models to assess cognitive load and interaction intensity based on interface features.

---

## Repository Structure

The repository is organized into three main directories, each containing specific components of the analysis pipeline:

### 1. `Analysis_Codes`

#### Cognitive Processing
- **`cognitiveTestBusy.html`**: A memory test with a chaotic interface featuring flashing banners, animated GIFs, and popups. Users must recall the number **7281** after 10 seconds.
- **`cognitiveTestClean.html`**: A minimalistic memory test with subtle animations and a clean layout, also testing recall of **7281**.

#### Dataset
- **`clicks.json`**: Click data (x, y coordinates, color, timestamp) for `unstop.com`.
- **`memory_distraction_data.csv`**: Metrics on interface complexity (flashing elements, animated components, label density) and memory recall outcomes across various websites.
- **`plotcode.ipynb`**: Jupyter notebook visualizing recall rates and decision times (e.g., clean vs. chaotic UI, Instagram vs. LinkedIn).

#### Decision Time
- **`Decision_Confidence.js`**: Tampermonkey script tracking user decision-making confidence based on hesitation, backtracking, and help interactions.
- **`Track First 3 Decisions (Time Logger)-1.0.user.js`**: Logs the time for the first three user clicks, displayed in a fixed UI box.

#### Final_Model_Codes
- **`click.py`**: Analyzes click data to identify high-interaction regions using grid-based and site-part analysis, generating bar and line plots.
- **`cogntiveloadmlmodel.ipynb`**: Trains a RandomForestClassifier to predict memory recall success (~80% accuracy) based on interface complexity.
- **`second_code.py` & `tempCodeRunnerFile.py`**: K-Means clustering on click data to identify interactive regions and predict interaction levels.
- **`clicks_unstop.com.json`**: Click data for `unstop.com`, used for heatmap and clustering.
- **`memory_distraction_data.csv`**: Repeated dataset for cognitive load analysis.

### 2. `Experiment_Codes2`

- **`engagement_score.js`**: Tampermonkey script calculating an engagement score based on hover time, clicks, scrolling, and personalized interactions.
- **`Global Heatmap Click Tracker-2025-03-21 (1).user.js`**: Visualizes clicks as red dots for real-time heatmap generation.
- **`ScrollDepthTracker (1).user.js`**: Tracks scroll depth with a progress bar reflecting the percentage of the page scrolled.
- **`Readme.d`**: Placeholder file (likely a typo for `README.md`), currently empty.

### 3. `Heat_Map_Analysis_ML_Model`

- **`Additional_Code.py` & `ML_Prediction_Code.py`**: Scripts for K-Means clustering and RandomForestClassifier to predict interaction levels.
- **`Main_EDA_code.py`**: Exploratory data analysis (EDA) generating plots for grid-based and general site part click distributions.
- **Dataset**
  - **`Dataset2.json`**: Click data similar to `clicks_unstop.com.json`, used for heatmap analysis.
  - **`User_Dataset1.json`**: Click data for `duolingo.com` with x, y coordinates, color, and timestamps.

---

## Key Features

- **Cognitive Tests**: Compare memory recall in clean vs. chaotic interfaces to quantify distraction effects.
- **Interaction Tracking**: Monitor clicks, scroll depth, decision confidence, and engagement in real-time using JavaScript-based tools.
- **Data Analysis**: Python scripts and Jupyter notebooks for visualizing click distributions, recall rates, and decision times.
- **Machine Learning**: Predictive models for memory recall and interaction levels based on interface complexity and click coordinates.
- **Heatmap Analysis**: Identify high-interaction website regions using grid-based and quadrant-based click analysis.

---

## Usage

### 1. Running Cognitive Tests
- Open `cognitiveTestBusy.html` or `cognitiveTestClean.html` in a browser to participate in the memory test.
- **Note**: These scripts attempt to log results to `http://localhost:3000/api/log`, requiring a local server (not provided).

### 2. Analyzing Data
- Use `plotcode.ipynb` to visualize recall rates and decision times.
- Run `click.py` or `Main_EDA_code.py` to analyze click distributions and generate heatmaps.
- Execute `cogntiveloadmlmodel.ipynb` to train and test the cognitive load prediction model.

### 3. Tracking Interactions
- Install [Tampermonkey](https://www.tampermonkey.net/) and load scripts like `Decision_Confidence.js`, `engagement_score.js`, or `Global Heatmap Click Tracker-2025-03-21 (1).user.js` to monitor interactions on any website.
- Ensure JavaScript is enabled and popups are allowed in the browser.

### 4. Machine Learning
- Run `second_code.py` or `ML_Prediction_Code.py` to cluster clicks and predict interaction levels.
- Modify input coordinates in these scripts to test predictions for new click locations.

---

##  Dependencies

### Python
- Required libraries: `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `seaborn`
- Install via:
  ```bash
  pip install pandas numpy matplotlib scikit-learn seaborn
  ```

### JavaScript
- No external dependencies; scripts run via Tampermonkey or directly in browsers.

### Browser
- Chrome, Firefox, or any modern browser with JavaScript enabled.
- Tampermonkey extension for user scripts.

---

## Data Description

### Click Data
- Files: `clicks_unstop.com.json`, `Dataset2.json`, `User_Dataset1.json`
- Fields: `x`, `y` (coordinates), `color` (green, yellow, red for interaction intensity), `timestamp`
- Purpose: Heatmap generation and clustering analysis

### Memory Distraction Data
- File: `memory_distraction_data.csv`
- Columns: `url`, `timestamp`, `flashing_elements`, `animated_components`, `label_density`, `memory_code`, `user_answer`, `right_answer`
- Purpose: Tracks memory recall success across websites with varying interface complexity

---

## Results

- **Cognitive Tests**: 
  - Clean UI (`cognitiveTestClean.html`): 73% recall rate
  - Chaotic UI (`cognitiveTestBusy.html`): 37% recall rate
  - Source: `plotcode.ipynb`
- **Decision Times**:
  - Duolingo: 5 seconds to first three interactions
  - LinkedIn: 7 seconds
  - Source: `plotcode.ipynb`
- **Engagement**:
  - Instagram average engagement score: 42.3/50
  - Source: `plotcode.ipynb`
- **Heatmaps**:
  - Most interactive regions on `unstop.com`: Top-left and bottom-right quadrants
  - Source: `click.py`
- **ML Model**:
  - RandomForestClassifier predicts memory recall with 80% accuracy
  - Source: `cogntiveloadmlmodel.ipynb`


