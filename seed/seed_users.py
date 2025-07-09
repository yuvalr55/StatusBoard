from passlib.hash import bcrypt
from pymongo import MongoClient
from os import environ
from csv import DictReader
from dotenv import load_dotenv
load_dotenv()

def load_users_from_csv(file_path="input_users.csv"):
    users = []
    with open(file_path, newline='') as csvfile:
        reader = DictReader(csvfile)
        for row in reader:
            users.append({
                "username": row["username"],
                "password": bcrypt.hash(row["password"]),
                "status": row["status"]
            })
    return users

def main():
    mongo_uri = environ.get("MONGODB_URI")
    # mongo_uri = "mongodb://root:root@localhost:27017/?authSource=admin"
    client = MongoClient(mongo_uri)

    db = client[environ.get("DB_NAME", 'test')]

    users_collection = db["users"]
    users_collection.create_index("username", unique=True)
    users = load_users_from_csv()
    inserted_ids = []
    for user in users:
        if not users_collection.find_one({"username": user["username"]}):
            result = users_collection.insert_one(user)
            inserted_ids.append(result.inserted_id)
    return inserted_ids
def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)

if __name__ == "__main__":
    print("Inserted IDs:", main())