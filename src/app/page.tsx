"use client";

import mockData from '@/mockData.json';
import { BookDetail } from './list/BookDetail';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export interface BookItem {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  pubdate: string;
  isbn: string;
  description: string;
}

export interface BookListData {
  items: BookItem[];
}

const bookData: BookListData = mockData;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [temp, setTemp] = useState<string>('');
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const [currentContents, setCurrentContents] = useState<BookItem[]>([...bookData.items].reverse());

  const contentsPerPage = 10;
  // 페이지 수 계산
  const totalContents = currentContents.length;
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(totalContents / contentsPerPage); i++) {
    pageNumbers.push(i);
  }
  
  // 10개 씩 자르기
  const indexOfLastContent = currentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const paginatedContents = currentContents.slice(indexOfFirstContent, indexOfLastContent);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemp(e.target.value)
  };

  const handleSearch = async () => {
    if (temp.trim()) {
      try {
        const response = await fetch(`/api/search?search=${encodeURIComponent(temp.trim())}`);
        if (response.ok) {
          const results = await response.json();
          setCurrentPage(1);
          setCurrentContents(results.items);
        } else {
          console.error("데이터를 받지 못함");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h2 className='text-3xl font-bold'>책 목록</h2>

      <div>
        <input
          value={temp}
          onChange={handleInputChange}
          className={'h-12 pl-12 text-base border rounded-lg'}
          placeholder={'제목 또는 저자 검색'}
        />
        <button className='text-lg h-12 p-4' onClick={handleSearch}>🔍</button>
      </div>

      <div className='grid grid-cols-5 gap-x-5 gap-y-10 min-w-[1100px]'>
        {paginatedContents.map((item, index) => {
          return (
            <BookDetail book={item} key={index} />
          )
        })}
      </div>

      <ul className='flex'>
        {pageNumbers.map(number => (
          <li key={number} 
            className={`w-8 h-8 border border-1 border-gray-300 flex items-center justify-center mr-4
            ${currentPage === number ? `activePage` : ''}`}
          >
            <Link
              href="/"
              onClick={() => paginate(number)}
              className='px-2.5 py-1.5'
            >
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
