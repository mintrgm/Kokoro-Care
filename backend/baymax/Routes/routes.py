from fastapi import APIRouter, Request, Depends, HTTPException
from database import get_db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/save-chat")
async def save_chat(request: Request, db=Depends(get_db)):
    data = await request.json()
    userId = data.get("userId")
    chat = data.get("chat")

    if not userId or not chat:
        raise HTTPException(status_code=400, detail="Missing userId or chat")

    history = {
        "userId": userId,
        "chat": chat,
        "created_at": datetime.now()
    }

    result = await db.baymax.insert_one(history) 
    return {"success": True, "chat_id": str(result.inserted_id)}


@router.get("/chat-history/{userId}")
async def get_chat_history(userId: str, db=Depends(get_db)):
    chats = await db.baymax.find({"userId": userId}).to_list(100)
    return chats


@router.get("/chat/{chat_id}")
async def get_chat(chat_id: str, db=Depends(get_db)):
    chat = await db.baymax.find_one({"_id": ObjectId(chat_id)})  
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.delete("/chat/{chat_id}")
async def delete_chat(chat_id: str, db=Depends(get_db)):
    result = await db.baymax.delete_one({"_id": ObjectId(chat_id)}) 
    return {"success": result.deleted_count == 1}
