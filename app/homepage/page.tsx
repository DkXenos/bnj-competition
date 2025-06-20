import Carousel from '@/components/carousel';
import MentorSection from '@/components/mentor-section';


export default function Homepage() {
  return (
    <div className="flex bg-sky-100 min-h-screen flex-col w-screen items-center justify-center">
      
      <div className="py-6 min-w-screen">
        <Carousel />
      </div>
      
      <MentorSection />
    </div>
  );
}
