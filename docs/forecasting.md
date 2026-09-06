# CampusBite — Demand Forecasting Methodology & Viva Defense Guide
## Simple Moving Average (SMA) Analysis in Canteen Operations

---

## 1. Mathematical Formulation

The **Simple Moving Average (SMA)** is a quantitative statistical time-series forecasting technique. For a menu item $F$, let $D_t$ denote the actual demand (quantity sold) on day $t$.

Given an $N$-period window, the forecast demand $\hat{D}_{t+1}$ for the upcoming day $t+1$ is calculated as the arithmetic mean of the most recent $N$ contiguous observations:

$$\hat{D}_{t+1} = \frac{1}{N} \sum_{i=0}^{N-1} D_{t-i} = \frac{D_t + D_{t-1} + \dots + D_{t-N+1}}{N}$$

### Example Calculation:
Consider the historical sales of **Chicken Biriyani** over the last 7 days:
- Day 1 (Monday): 42 portions
- Day 2 (Tuesday): 38 portions
- Day 3 (Wednesday): 45 portions
- Day 4 (Thursday): 40 portions
- Day 5 (Friday): 52 portions
- Day 6 (Saturday): 30 portions
- Day 7 (Sunday): 35 portions

For $N = 7$:
$$\text{Sum} = 42 + 38 + 45 + 40 + 52 + 30 + 35 = 282$$
$$\hat{D} = \frac{282}{7} \approx 40.285 \implies \mathbf{40\text{ portions}}$$

---

## 2. Kitchen Preparation Buffer Formulation

In college food operations, producing strictly the exact historical mean risks stockouts during peak lunch breaks. Conversely, over-preparation leads to food spoilage and economic loss.

CampusBite incorporates a **Safety Stock Buffer ($B$)** of $8\%$:

$$\text{Buffer Units } (U) = \left\lceil \hat{D} \times \frac{B}{100} \right\rceil$$
$$\text{Minimum Batch} = \hat{D}$$
$$\text{Maximum Batch} = \hat{D} + U$$
$$\text{Recommended Batch} = \text{round}\left(\frac{\text{Min} + \text{Max}}{2}\right)$$

For $\hat{D} = 40$ and $B = 8\%$:
$$U = \lceil 40 \times 0.08 \rceil = \lceil 3.2 \rceil = 4\text{ portions}$$
$$\text{Suggested Range: } 40 \text{ to } 44\text{ portions (Recommended: } 42\text{)}$$

---

## 3. Why Simple Moving Average Instead of Complex Machine Learning?

During an MCA project defense/viva, evaluators frequently ask why deep learning or neural networks were not selected. The following table provides the academic justification:

| Factor | Simple Moving Average (CampusBite) | Complex Deep Learning / LSTM |
|---|---|---|
| **Mathematical Transparency** | 100% explainable in viva. Every data point maps directly to the arithmetic mean. | "Black box" model; weights cannot be intuitively audited during canteen kitchen shifts. |
| **Computational Footprint** | Extremely low ($O(N)$); executes in sub-millisecond time on modest canteen hardware. | Requires heavy tensor libraries, GPU acceleration, and recurring model training runs. |
| **Handling Data Scarcity** | Robust even with 7 to 14 days of data; flags "Insufficient data" gracefully. | Prone to extreme overfitting when dataset has fewer than thousands of samples. |
| **Canteen Practicality** | Directly actionable by chef (e.g., "prepare 42-45 portions today"). | Probabilistic outputs that often confuse kitchen staff. |

---

## 4. Key Viva Questions & Answers

**Q1: What happens when a canteen item has less historical data than the window size $N$?**  
*Answer:* CampusBite prevents misleading outputs. The `MovingAverageService` inspects the contiguous date record. If `totalDays < windowSize`, it outputs an explicit status: `"Insufficient historical data"`, preserving system auditability.

**Q2: How does window size $N$ affect forecasting sensitivity?**  
*Answer:* 
- A smaller window (e.g., $N=3$) responds rapidly to recent surges (e.g., college festival week).
- A larger window (e.g., $N=7$) smooths out day-to-day randomness and provides stable baseline trends.
CampusBite allows kitchen staff and administrators to toggle between 3-day and 7-day windows dynamically.

**Q3: Does the system use synthetic numbers in the UI?**  
*Answer:* No. All dashboard figures, moving averages, and charts are calculated on the fly by executing Prisma aggregation queries against actual historical order tables.
