import { BookItem } from "../page";

interface BookDetailProps {
  book: BookItem; 
}

export function BookDetail({ book }: BookDetailProps) {

  return (
    <div className="w-52 h-72 place-content-center hover:bg-sky-100 pointer">
        <div className="flex justify-center">
          <img className="w-36 h-56 pb-3" src={book.image} alt="book_image" />
        </div>
        <div className="px-8 text-center ellipsis">{book.title}</div>
    </div>
  )

}