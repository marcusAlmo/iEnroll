import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CarouselItem = {
  id: number;
  subject: string;
  message: string;
}
type CarouselProps = {
  carouselItems: CarouselItem[];
}

const CustomCarousel = ({ carouselItems }: CarouselProps) => {
  return (
    <Carousel className="w-screen px-8">
      <CarouselContent>
        {carouselItems.map((item) => (
          <CarouselItem key={item.id} className="flex justify-center">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-[10px] border border-container_1">
              <h1 className="text-lg font-semibold text-primary">{item.subject}</h1>
              <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200" />
      <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200" />
    </Carousel>
  )
}

export default CustomCarousel
