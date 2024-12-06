"use client";

import mockData from '@/mockData.json';
import { BookDetail } from './list/BookDetail';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  count?: number;
}

export interface BookListData {
  items: BookItem[];
}

const bookData: BookListData = mockData;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [store, setStore] = useState<string>('');
  const [temp, setTemp] = useState<string>('');
  const router = useRouter();
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

  const handleStoreSearch = async () => {
    setTemp('');
    if (store.trim()) {
      const filteredBooks = currentContents.filter((book: BookItem) =>
          book.title.includes(store) || book.author.includes(store)
      );
      setCurrentContents(filteredBooks);
    }
  };

  const handleSearch = async () => {
    setStore('');
    if (temp.trim()) {
      try {
        const response = await fetch(`/api/books?search=${encodeURIComponent(temp.trim())}`);
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

  useEffect(() => {
    
  }, [])

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/" className='flex text-lg h-12 pt-2 px-3 border rounded-lg' onClick={() => {
        setStore('');
        setTemp('');
        setCurrentPage(1);
        setCurrentContents([...bookData.items].reverse());
        router.push('/');
      }}>🏠</Link>
      

      <div className='flex justify-around'>
        <div className='' style={{borderRight:'1px solid #000'}} >
          <div className='font-bold text-left'>현재 책에서 검색</div>
          <input
            value={store}
            onChange={(e) => {setStore(e.target.value)}}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {handleStoreSearch();}
            }}
            className={'h-12 pl-12 text-base border rounded-lg'}
            placeholder={'제목 또는 저자 검색'}
          />
          <button className='text-lg h-12 p-4' onClick={handleStoreSearch}>🔍</button>
        </div>

        <div className='pl-5'>
          <div className='font-bold text-left'>새로 추가할 책 검색</div>
          <input
            value={temp}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {handleSearch();}
            }}
            className={'h-12 pl-12 text-base border rounded-lg'}
            placeholder={'책 검색'}
          />
          <button className='text-lg h-12 p-4' onClick={handleSearch}>🔍</button>
        </div>
      </div>

      <div className='grid grid-cols-5 gap-x-5 gap-y-10 min-w-[1100px]'>
        {paginatedContents.map((item, index) => <BookDetail book={item} key={index} />)}
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
