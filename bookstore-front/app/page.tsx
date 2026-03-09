import Link from 'next/link'

export default function Home() {
  return (
    <div className="page" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'80vh', gap:'2rem'}}>
      <h1>Bookstore</h1>
      <Link href="/authors" className="btn">Ver autores</Link>
    </div>
  )
}