interface Game {
  id: string;
  bannerUrl: string;
  title: string;
  _count: {
    ads: number;
  };
}

interface GameBannerProps {
  game: Game;
}

export const GameBanner = ({ game: { bannerUrl, title, _count: { ads } } }: GameBannerProps) => {
  return (
    <a href="" className="relative rounded-lg overflow-hidden">
      <img src={bannerUrl} alt="" />
      <div className="w-full pt-16 pb-4 px-4 bg-game absolute bottom-0 left-0 right-0">
        <strong className="font-bold text-white block">{title}</strong>
        <strong className="text-sm text-zinc-300 block">{ads} anúncios</strong>
      </div>
    </a>
  )
}