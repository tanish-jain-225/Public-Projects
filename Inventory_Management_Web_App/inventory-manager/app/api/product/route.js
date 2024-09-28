import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


const stockStr = "stock"
const collections = "inventory"
const key = "d951LKEgCInJ2kPK"

const uri = `mongodb+srv://${collections}:${key}@cluster0.578qvco.mongodb.net/`;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(request) {
    try {
        const client = await clientPromise;
        const database = client.db(`${stockStr}`);
        const inventory = database.collection(`${collections}`);
        const products = await inventory.find({}).toArray();
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const database = client.db(`${stockStr}`);
        const inventory = database.collection(`${collections}`);
        const result = await inventory.insertOne(body);
        return NextResponse.json({ result, ok: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
