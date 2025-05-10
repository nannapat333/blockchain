import Header from '../components/Header';
import Footer from '../components/Footer';
import NFTCard from '../components/NFTCard';

export default function MarketplacePage() {
  const amulets = [
    {
      id: 1,
      title: 'Golden Buddha Amulet',
      price: '0.5',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/710896-00-allonline-amulet.jpg-oGTdSgY6ZHZL4EPYi3XSAdoKaMIGRK.jpeg',
    },
    {
      id: 2,
      title: 'Stone Buddha Amulet',
      price: '0.3',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/710894-00-allonline-amulet.jpg-tO3Oa0pbuOL75XhLJJr1SgrBGClNCa.jpeg',
    },
    {
      id: 3,
      title: 'Ornate Temple Amulet',
      price: '0.8',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6708efdc3c618-%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87.jpg-gOkFcXsFgi5PVPSfmKVxUq88JIXKoy.jpeg',
    },
    {
      id: 4,
      title: 'Antique Gold Frame Amulet',
      price: '1.2',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1722157347.jpg-18veHu239oIETs0i4GAH7EqAT8GpAX.jpeg',
    },
    {
      id: 5,
      title: 'Crystal Encased Amulet',
      price: '0.7',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AM103100-2.jpg-rbQC4w36lS1xkcY5S1fLv2aICum3zA.jpeg',
    },
    {
      id: 6,
      title: 'Clay Buddha Amulet',
      price: '0.25',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67rl3c.jpg-Uxlz48nDIqHwvzRQuEhqbSATa1mngc.jpeg',
    },
  ];

  const handleBuyNow = (id) => {
    alert(`Buy Now clicked for product #${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-amber-900">Marketplace</h1>
        <p className="mb-8 text-amber-700">Discover and collect sacred Buddha amulet NFTs</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amulets.map((amulet) => (
            <NFTCard key={amulet.id} nft={amulet} onBuy={handleBuyNow} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}