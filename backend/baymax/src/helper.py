from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter  # Updated import
from langchain_huggingface import HuggingFaceEmbeddings

# Extract data from PDF
def load_pdf_file(data):
    loader = DirectoryLoader(data, glob="*.pdf",loader_cls=PyPDFLoader)
    documents = loader.load()
    return documents

# Split the data into text chunks
def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20,
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks


# Download the embeddings from HuggingFace
def download_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return embeddings