"use client"

import { BookItem } from "@/app/page";
import { useEffect, useState, use } from "react";

export default function BookInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ book, setBook ] = useState<BookItem | null>();

  useEffect(() => {
    const getBookDetail = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data from external API");
        }
        const bookData = await response.json();
        console.log(bookData);
        setBook(bookData.rss.channel.item);
      } catch (error) {
        console.error(error);
      }
    }
    getBookDetail();  
  }, []);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Book Info</h1>

      <div className="w-[700px] flex justify-evenly">
        <img src={book.image} alt={book.title} className="w-36 h-56 pb-3" />
        <div className="max-w-[350px]">
          <div className="font-bold text-lg">{book.title}</div>
          <div>저자: {book.author}</div>
          <div>가격: {book.discount}원</div>
          <div>ISBN: {book.isbn}</div>
          <div>출판일: {book.pubdate}</div>
          <div>출판사: {book.publisher}</div>
        </div>
      </div>
      <div className="w-[700px]">
        <div>
          {book.description}
        </div>
      </div>
    </div>
  );
}