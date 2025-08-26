from src.helper import load_pdf_file, text_split, download_embeddings
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os


load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

extracted_data = load_pdf_file(data="Data/")
text_chunks = text_split(extracted_data)
embeddings = download_embeddings()

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "genai-medical-chatbot"

pc.create_index(
    name=index_name,
    dimension=384, # Replace with your model dimensions
    metric="cosine", # Replace with your model metric
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    ) 
)

# Embed each chunk and upsert the embeddings into your Pinecone index
docsearch = PineconeVectorStore.from_documents(
    text_chunks,
    embeddings,
    index_name=index_name,
    namespace="genai-medical-chatbot"
)