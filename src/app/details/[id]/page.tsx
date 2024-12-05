interface BookDetailsPageProps {
  params: { id: string };
}

export default async function BookInfoPage({ params }: BookDetailsPageProps) {
  const { id } = await params;  

  return (
    <div>
      <h1 className="text-3xl font-bold">Book Info</h1>
      {/* <p>ISBN: {id}</p> */}
    </div>
  );
}