import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


const stockStr = 'stock'
const collections = "inventory"
const key = "d951LKEgCInJ2kPK"

const uri = `mongodb+srv://${collections}:${key}@cluster0.578qvco.mongodb.net/`;
const options = {};

let client;
let clientPromise;

if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the client can be reused
    // across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function GET(request) {
    try {
        const client = await clientPromise;
        const database = client.db(`${stockStr}`);
        const collection = database.collection(`${collections}`);

        const query = {};
        const inventory = await collection.find(query).toArray();

        return NextResponse.json({ inventory });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the collection." }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const database = client.db(`${stockStr}`);
        const collection = database.collection(`${collections}`);

        const result = await collection.insertOne(body);

        return NextResponse.json({ result, ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while adding the product." }, { status: 500 });
    }
}
