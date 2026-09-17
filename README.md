# Reddit Bot Detective

Unsupervised anomaly detection for identifying likely bot accounts on Reddit — no labelled data required.

Reddit provides no ground-truth labels for bot accounts, so this project treats bot detection as an **outlier detection** problem: accounts are profiled on behavioural features, and four unsupervised algorithms independently flag the accounts that deviate most from normal user behaviour. An interactive dashboard compares what each model catches, where they agree, and lets you inspect any flagged account.

---

## Why unsupervised?

Supervised bot detection needs a labelled corpus that is expensive to build and goes stale as bot tactics change. Unsupervised methods only need a definition of "normal" derived from the data itself, which makes them:

- deployable on any subreddit or user sample without annotation
- robust to new bot patterns that were never in a training set
- easy to re-fit as behaviour drifts

The trade-off: no precision/recall against ground truth. This project handles that by comparing models against each other and surfacing consensus, rather than claiming a single accuracy number.

---

## Features

- **Data collection** — pulls user activity via the Reddit API (PRAW): submissions, comments, timestamps, karma, and account metadata.
- **Behavioural feature engineering** — converts raw activity into signals that separate automation from human use (posting cadence, activity regularity, content repetition, karma ratios, account age vs. volume).
- **Four-model benchmark** — Isolation Forest, One-Class SVM, Elliptic Envelope, and Local Outlier Factor, each fit on the same feature matrix.
- **Consensus scoring** — accounts flagged by multiple independent models are ranked highest, reducing single-model false positives.
- **Interactive dashboard** — side-by-side model comparison, feature distributions for flagged vs. normal accounts, and drill-down into any individual account.

---

## Models

| Model | Approach | Best at catching |
|---|---|---|
| **Isolation Forest** | Randomly partitions the feature space; outliers isolate in fewer splits | Globally unusual accounts across many features |
| **One-Class SVM** | Learns a boundary around the dense region of normal accounts | Accounts just outside the normal envelope; sensitive to kernel and `nu` |
| **Elliptic Envelope** | Fits a robust Gaussian and flags high Mahalanobis distance | Outliers when features are roughly elliptical and correlated |
| **Local Outlier Factor** | Compares local density to that of a point's neighbours | Accounts unusual *relative to their peer group*, not globally |

The four disagree by design. Isolation Forest and Elliptic Envelope look for global outliers; LOF finds local ones. Comparing them is the point of the project.

---

## Features engineered

| Signal | Intuition |
|---|---|
| Posting interval mean / variance | Bots post on schedules; humans post in bursts |
| Activity hour entropy | Humans sleep; 24/7 uniform activity is suspicious |
| Comment/submission ratio | Many bots only comment, or only submit links |
| Content duplication rate | Templated or repeated text across posts |
| Karma per post | Low engagement despite high volume |
| Subreddit diversity | Narrow single-purpose activity vs. broad human interests |
| Account age vs. post volume | Very new accounts with very high output |

---

## Tech stack

`Python` · `PRAW` · `scikit-learn` · `pandas` · `NumPy` · `Matplotlib` / `Seaborn` · `Streamlit`

---

## Getting started

### Prerequisites

- Python 3.9+
- A Reddit API application — create one at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) (type: *script*)

### Installation

```bash
git clone https://github.com/Mehak3010/reddit-bot-detective.git
cd reddit-bot-detective
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the project root:

```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=bot-detective/0.1 by u/your_username
```

`.env` is gitignored — never commit credentials.

### Usage

```bash
# 1. Collect user activity from a subreddit
python src/collect.py --subreddit datascience --limit 500

# 2. Build the feature matrix
python src/features.py

# 3. Fit all four models and score accounts
python src/detect.py

# 4. Launch the dashboard
streamlit run app.py
```

---

## Project structure

```
reddit-bot-detective/
├── src/
│   ├── collect.py       # PRAW data collection
│   ├── features.py      # Behavioural feature engineering
│   ├── detect.py        # Model fitting and scoring
│   └── evaluate.py      # Cross-model agreement analysis
├── data/                # Raw and processed data (gitignored)
├── notebooks/           # Exploratory analysis
├── app.py               # Streamlit dashboard
├── requirements.txt
└── README.md
```

---

## Results

Across the sampled accounts, the four models converge on a small consensus set while each surfaces distinct candidates of its own — Local Outlier Factor in particular flags accounts that look normal globally but are anomalous within their activity peer group. The dashboard exposes this overlap directly, so a reviewer can start from the highest-consensus accounts and work outward.

> Replace this section with your actual figures: sample size, flag rate per model, pairwise agreement (Jaccard), and a screenshot of the dashboard.

---

## Limitations

- **No ground truth.** Flagged accounts are statistical anomalies, not confirmed bots. Human accounts can be unusual; sophisticated bots can be unremarkable.
- **Contamination is a hyperparameter.** Each model requires an assumed outlier proportion, which directly sets the flag rate.
- **API-limited sampling.** PRAW returns a bounded history per user, so long-lived accounts are only partially profiled.
- **Not for enforcement.** This is an investigative and research tool, not a basis for automated moderation action.

---

## Roadmap

- [ ] NLP features — perplexity and stylometric signals over comment text
- [ ] Graph features — interaction networks between flagged accounts
- [ ] Semi-supervised refinement using a small hand-labelled seed set
- [ ] Time-series drift monitoring for re-fitting on new samples

---

## Acknowledgements

Built with [PRAW](https://praw.readthedocs.io/) and [scikit-learn](https://scikit-learn.org/). Reddit data is used in accordance with the [Reddit API Terms](https://www.redditinc.com/policies/data-api-terms).
