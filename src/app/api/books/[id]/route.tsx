import { NextResponse } from 'next/server';
import { parseStringPromise } from "xml2js";

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
    console.log(data);
    
    
    return NextResponse.json(data);

  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}
