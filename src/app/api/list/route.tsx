import { NextResponse } from 'next/server';
import fs from "fs/promises";
import path from "path";
export async function GET(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "public", "mockData.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const books = JSON.parse(fileData);
    return NextResponse.json(books.items);
  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}