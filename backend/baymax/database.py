from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb+srv://mint:thapamgr238@cluster0.jbi34zo.mongodb.net/prescripto")
db = client.prescripto  

async def get_db():
    return db
