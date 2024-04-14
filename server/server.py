import json
import uvicorn

from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



PRODUCT_DATA = json.loads(open("./generated_products.json", "r").read())



@app.get("/")
def read_root():
    return PRODUCT_DATA

@app.get("/")
def read_root():
    return [p for p in PRODUCT_DATA if p["id"] == item_id]

@app.get("/products")
def read_item(search: str):
    return [p for p in PRODUCT_DATA if search in p["name"]]
