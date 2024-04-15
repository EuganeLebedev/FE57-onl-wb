import json
import uvicorn
import random

from typing import Union
from fastapi import FastAPI
from fastapi.responses import FileResponse
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

@app.get("/product")
def read_items(item_id: int):
    result = [p for p in PRODUCT_DATA if p["id"] == item_id]
    return len(result) > 0 and result[0] or {}


@app.get("/products")
def read_items(search: str):
    return [p for p in PRODUCT_DATA if search in p["name"]]

@app.get("/file/product")
def download_file(id):
  return FileResponse(path=f'{id}.webp')