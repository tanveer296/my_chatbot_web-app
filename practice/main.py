from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
app = FastAPI(title="My-app")
class Item(BaseModel):
    name: str
    description: str | None = None
    price: int
items_db:dict[int,Item] = {
    1: Item(name="nvr", description="A nvr", price=12000),
    2: Item(name="mobile", description="A mobile", price=15000),
    3: Item(name="camera", description="A camera", price=20000)
}
@app.get("/items")
async def read_items():
    return items_db

next_id = 4
@app.post("/items", status_code=201)
async def create_item(item: Item):
    global next_id
    items_db[next_id] = item
    response = {"id": next_id, **item.model_dump()}
    next_id += 1
    return response

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db[item_id] = item
    return {"id": item_id, **item.model_dump()}

@app.delete("/items/{item_id}", status_code=204)
async def delete_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]

#fbfbfggkojkj

 