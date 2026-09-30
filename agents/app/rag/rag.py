from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from pathlib import Path
load_dotenv()

embeddings = HuggingFaceEmbeddings(model = "sentence-transformers/all-MiniLM-L6-v2")

def build_retriever(pdf_path : str,chroma_db_path)->str:

    presist_directory = chroma_db_path

    if Path(presist_directory).exists():
        vectorStore = Chroma(persist_directory=presist_directory,embedding_function=embeddings)
    else:    
                
        loader = PyPDFLoader(pdf_path)
        document = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=800,chunk_overlap=100)
        chunks = splitter.split_documents(document)

        vectorStore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=presist_directory
        )



    return vectorStore.as_retriever(search_kwargs={"k":4})
