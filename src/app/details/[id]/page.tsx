"use client"

import { BookItem } from "@/app/page";
import { useEffect, useState, use, useRef } from "react";

export default function BookInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ book, setBook ] = useState<BookItem | null>();
  const [ count, setCount ] = useState<number>(1);
  const isInitialRender = useRef(true);
  useEffect(() => {
    const getBookDetail = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data from external API");
        }
        const bookData = await response.json();
        // console.log(bookData);
        setBook(bookData.rss.channel.item);
      } catch (error) {
        console.error(error);
      }
    }
    getBookDetail();  
  }, []);

  const handlePlusCount = () => {
    setCount((prev => prev+1));

  }
  const handleMinusCount = () => {
    if (count > 0) {
      setCount((prev => prev-1));
    }
    else {
      alert('책이 한 권도 없습니다');
    }
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; // 초기 렌더링에서 실행되지 않도록 종료
    }
    const plusCount = async () => {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(count),
        });
    
        if (!response.ok) {
          throw new Error(`Failed to update book: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Book updated successfully:", data);
        setBook(data.book);
      } catch (err) {
        console.error(err);
      }
    }
    plusCount();    
  }, [count])

  if (!book) {
    return (
      <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-3xl font-bold mb-20">Book Info</h1>

      <div className="w-[700px] flex justify-evenly mb-20">
        <img src={book.image} alt={book.title} className="w-36 h-56 pb-3" />
        <div className="max-w-[350px]">
          <div className="font-bold text-lg">{book.title}</div>
          <div>저자: {book.author}</div>
          <div>가격: {book.discount}원</div>
          <div>ISBN: {book.isbn}</div>
          <div>출판일: {book.pubdate}</div>
          <div>출판사: {book.publisher}</div>
          <div>수량</div>
          <div className="flex  py-1">
            <button className="border border-1 border-slate-400 py-1 px-2" onClick={handleMinusCount}>-</button>
            <div className="border border-1 py-1 px-2">{book.count ? book.count : 1}</div>
            <button className="border border-1 border-slate-400 py-1 px-2" onClick={handlePlusCount}>+</button>
            <div>
              <button>이 책 제거</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[700px] pb-20">{book.description}</div>
    </div>
  );
}