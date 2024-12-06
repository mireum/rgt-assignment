import { NextResponse } from 'next/server';
import { parseStringPromise } from "xml2js";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  console.log(`Received ID: ${id}`);
  
  if (!id) {
    return NextResponse.json({ message: "No ISBN" }, { status: 400 });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/book_adv.xml?d_isbn=${id}`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id": `${process.env.NAVER_ID}`,
        "X-Naver-Client-Secret": `${process.env.NAVER_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from external API");
    }
    const xmlText = await response.text();
    const data = await parseStringPromise(xmlText, { explicitArray: false });

    return NextResponse.json(data);

  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "No ISBN" }, { status: 400 });
  }
  
  try {
    const filePath = path.join(process.cwd(), "src", "mockData.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const books = JSON.parse(fileData);
    
    const body = await req.json(); 
    const bookIndex = books.items.findIndex((book: any) => book.isbn === id);
    const book = books.items[bookIndex];

    book.count = body;

    books.items[bookIndex] = { ...book };
    console.log(books.items[bookIndex]);
    
    // 수정된 데이터를 mockData.json에 저장
    await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8");

    return NextResponse.json({ message: "Book updated successfully", book: books.items[bookIndex] });

  } catch (error) {
    console.error(error);
    
  }
}