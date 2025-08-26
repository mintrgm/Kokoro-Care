import pandas as pd
import pickle
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train():
    df = pd.read_csv("dataset.csv")
    df['cleaned'] = df['text'].apply(clean_text)

    vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
    X = vectorizer.fit_transform(df['cleaned'])
    y = df['intent']

    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    with open("intent_model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)

if __name__ == "__main__":
    train()
