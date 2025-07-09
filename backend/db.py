from pymongo import MongoClient
from os import environ

client = MongoClient(environ.get("MONGODB_URI"), serverSelectionTimeoutMS=2000)
db = client[environ.get("DB_NAME", "test")]
