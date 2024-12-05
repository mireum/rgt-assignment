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

      <div>
        <img src={book.image} alt={book.title} className="w-36 h-56 pb-3" />
      </div>
      {/* <p>ISBN: {id}</p> */}
    </div>
  );
}