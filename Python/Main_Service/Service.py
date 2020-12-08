from passlib.hash import bcrypt
from quizModel.quiz_model import quizDetails, updateMarks
from sections.section_model import section
from user_models.user_models import UserInDB, login, verification
import json
import os
import random
import string
import datetime
import jwt
import uvicorn
from bson import json_util
from fastapi import FastAPI
from fastapi_mail import FastMail
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from starlette import status
from starlette.background import BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from Configs.Config import MONGODB_URL, MONGODB_DB_NAME, MAIL_PASS, SUBJECT, ISS
import datetime


app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
client = AsyncIOMotorClient(MONGODB_URL)
db = client.get_database("MONGODB_DB_NAME")
collection = db.get_collection("users")
pwd_context = CryptContext(schemes=["sha256_crypt", "md5_crypt", "des_crypt"])
verificationCode = ""



@app.post("/signUp", tags=["Users"], summary="Add Users", description=" Addding Users to DB")
async def signUp(user: UserInDB):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("users")
  row = await collection.find_one({"username": user.username})
  if row:
    print("User Already Exists")
    return {"message": "userExists"}
  else:
    print("No User Exists")
    usr = {'username': user.username, 'role': user.role, 'firstName': user.firstName,
           'lastName': user.lastName,
           'password': bcrypt.hash(user.password),
           'id':user.id,
           'section':user.section}

    dbuser = UserInDB(**usr)
    collection.insert_one(dbuser.dict())


    sec = {'studentName': user.firstName+" "+user.lastName}
    sectionname = "section-"+user.section
    Scollection = db.get_collection(sectionname)
    suser = section(**sec)
    Scollection.insert_one(suser.dict())

  return {"message": "userCreated"}


@app.get("/login", tags=["Users"], summary="Login", description=" Verifying User Credentials")
async def login(username: str, password: str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("users")
  row = await collection.find_one({"username": username})
  print(username, password)
  if row:
    mpassword = row['password']
    role = row['role']
    if bcrypt.verify(password, mpassword):
      token = jwt.encode(
        {'user': username, 'scope': row['role'], 'iss': ISS,
         'sub': SUBJECT,
         'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)},
        'SECRET_KEY')

      return {'message': 'True', 'token': token, 'username': username, 'role': role, 'firstname':row['firstName'], 'lastname':row['lastName']}
    else:
      return {'message': "False"}
  return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content="Authentication Failed")


@app.get("/checkUser", tags=["Users"], summary="Validating Email ID",
         description=" Checking for Existence of Email ID")
async def checkUser(username: str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("users")
  row = await collection.find_one({"username": username})
  if row:
    return {"message": "validUser"}
  else:
    return {"message": "notValid"}


@app.get("/genpassword", tags=["Users"], summary="Verification",
         description=" Generating and sending verification code")
async def genpassword(background_tasks: BackgroundTasks, username: str) -> JSONResponse:
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("users")
  row = await collection.find_one({"username": username})
  if row:
    length = 13
    chars = string.ascii_letters + string.digits + '!@#$%^&*()'
    random.seed = (os.urandom(1024))
    newpass = (''.join(random.choice(chars) for i in range(length)))
    mail = FastMail(email="paidipraneethkumar@gmail.com", password=MAIL_PASS, tls=True, port="587",
                    service="gmail")
    background_tasks.add_task(mail.send_message, recipient=row["username"], subject="QUIZ Password Reset",
                              body="Verification code is :  " + newpass, text_format="html")
    global verificationCode
    verificationCode = newpass

    return {"message": "verificationCodeSent"}

  else:
    return {"message": "invalidUsername"}


@app.put("/updatePassword", tags=["Users"], summary="Change password", description=" Update password in DB")
async def updatePassword(user: verification):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("users")
  row = await collection.find_one({"username": user.username})
  global verificationCode
  if row:
    if user.code == verificationCode:
      await collection.update_one({'username': user.username},
                                  {'$set': {'password': bcrypt.hash(user.password)}})
      return {"message": "passwordUpdated"}
    return {"message": "verification code mismatch"}


@app.post("/uploadQuiz", tags=["Quiz"], summary="Add quiz", description=" Addding Users to DB")
async def uploadQuiz(quiz: quizDetails):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("quizData")
  row = await collection.find_one({"createdBy": quiz.createdBy, "quizname":quiz.quizname} )
  if row:
    return {"message": "Quiz Already Present with Same Name"}
  else:

    usr = {'createdBy': quiz.createdBy,
           'quizname':quiz.quizname,
           'quizduration':quiz.quizduration,
           'quizSection':quiz.quizSection,
           'quizFile':quiz.quizFile}

    quizUsr = quizDetails(**usr)
    collection.insert_one(quizUsr.dict())

    time = datetime.datetime.now()
    time = str(time.strftime("%c"))


    scollection = db.get_collection("section-"+quiz.quizSection)
    srow = scollection.find()
    x = {}
    x.update({"QuizName": quiz.quizname})
    x.update({"CreatedBy": quiz.createdBy})
    x.update({"CreatedTime": time})
    x.update({'quizDuration': quiz.quizduration})
    async for item in srow:
      x.update({str(item['studentName']): 'Not Attempted'})
    print(x)
    qCollection = db.get_collection("Quizes")
    qCollection.insert_one(x)
    return {"message": "Quiz Created"}


@app.get("/getQuiz", tags=["Quiz"], summary="Getting All Quizes",description=" Getting All Quizes")
async def getQuiz(username: str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("quizData")
  row = collection.find({"createdBy": username})
  x = []
  async for item in row:
    x.append(item)
  return json.loads(json_util.dumps(x))


@app.delete("/deleteQuiz", tags=["Quiz"], summary="Delete quiz", description="Removing Quiz from DB")
async def deleteQuiz(createdBy :str , quizname:str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("quizData")
  row = await collection.find_one({"createdBy": createdBy, "quizname":quizname})
  if row:

    qcollection = db.get_collection("Quizes")
    await qcollection.delete_one({"CreatedBy": createdBy, "QuizName": quizname})

    data = quizDetails(**row)
    await collection.delete_one(data.dict())

    return {"message": "Quiz Deleted"}
  else:
    return {"message": "Quiz Not Exsists"}



@app.get("/getStudentQuiz", tags=["Quiz"], summary="Getting All Quizes",description=" Getting All Quizes")
async def getStudentQuiz(studentName: str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("Quizes")
  row = collection.find({ studentName: {"$exists" : True}})
  x = []
  async for item in row:
    x.append({"quizName": item['QuizName'], "createdBy": item['CreatedBy'], "createdTime":item['CreatedTime'], "Marks":item[studentName]})
  return json.loads(json_util.dumps(x))


@app.get("/getStudentPendingQuiz", tags=["Quiz"], summary="Getting All Quizes",description=" Getting All Quizes")
async def getStudentPendingQuiz(studentName: str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("Quizes")
  row = collection.find({ studentName: {"$exists" : True}, studentName: {"$eq": "Not Attempted"}})
  x = []
  async for item in row:
    x.append({"quizName" : item['QuizName'], "createdBy": item['CreatedBy'], "quizDuration": item['quizDuration']})

  return json.loads(json_util.dumps(x))


@app.put("/updateMarks", tags=["Quiz"], summary="Getting All Quizes",description=" Getting All Quizes")
async def updateMarks(marks:updateMarks):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("Quizes")
  row = await collection.find_one({"CreatedBy": marks.createdBy, "QuizName": marks.quizname})
  if row:
    await collection.update_one({"CreatedBy": marks.createdBy, "QuizName": marks.quizname},
                                {'$set': {marks.studentName: marks.marks}})

    return {"message": "Marks Updated"}

  else:
    return {"message": " No User Exists"}


@app.get("/viewResults", tags=["Quiz"], summary="Getting All Quizes",description=" Getting All Quizes")
async def viewResults(quizname: str, createdby:str):
  client = AsyncIOMotorClient(MONGODB_URL)
  db = client.get_database(MONGODB_DB_NAME)
  collection = db.get_collection("Quizes")
  row = await collection.find_one({"CreatedBy": createdby, "QuizName": quizname})
  if row:
    del row["_id"]
    del row["QuizName"]
    del row["CreatedBy"]
    del row["CreatedTime"]
    del row["quizDuration"]

  return json.loads(json_util.dumps(row))

if __name__ == '__main__':
  uvicorn.run(app)
