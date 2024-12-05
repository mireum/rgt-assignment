import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  
  if (!search) {
    return NextResponse.json({ message: "Missing search query" }, { status: 400 });
  }

  try {
    // 외부 API 호출
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
