import { NextResponse } from 'next/server';
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  
  if (!search) {
    return NextResponse.json({ message: "Missing search query" }, { status: 400 });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(search)}&display=20`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id": `${process.env.NAVER_ID}`,
        "X-Naver-Client-Secret": `${process.env.NAVER_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from external API");
    }
    const data = await response.json();  
    return NextResponse.json(data);

  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "src", "mockData.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const books = JSON.parse(fileData);
    
    const body = await req.json(); 
    books.items.push(body);
    
    await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8");
  
    return NextResponse.json({ message: "Books added successfully"});
  } catch (err) {
    console.error(err);
  }
}