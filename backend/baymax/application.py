from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from src.helper import download_embeddings
from src.prompt import system_prompt
from langchain_pinecone import PineconeVectorStore
from langchain_ollama import OllamaLLM
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from Routes import routes

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Medical Chatbot API")
app.include_router(routes.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request and response models
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

# Initialize components on startup
@app.on_event("startup")
async def startup_event():
    global retrieval_chain
    
    # Load embeddings
    embeddings = download_embeddings()
    
    # Connect to Pinecone
    index_name = "genai-medical-chatbot"
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
        namespace="genai-medical-chatbot"
    )
    
    # Set up retriever
    retriever = docsearch.as_retriever(
        search_type="similarity", 
        search_kwargs={"k": 3}
    )
    
    # Initialize LLM
    llm = OllamaLLM(
        model="gemma:2b",
        temperature=0.4,
        num_predict=500
    )   
    
    # Create prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    # Create question answer chain
    question_answer_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
    )
    
    # Create retrieval chain
    retrieval_chain = create_retrieval_chain(
        retriever=retriever,
        combine_docs_chain=question_answer_chain,
    )

@app.post("/api/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    try:
        # Process query through retrieval chain
        response = retrieval_chain.invoke({"input": request.query})
        return QueryResponse(answer=response["answer"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Medical Chatbot API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)