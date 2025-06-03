import Navbar from "../components/Navbar";
import useUserStore from "../store";
import ImageGallery from '../components/ImageGallery';

const Home = () => {
  const user = useUserStore((state) => state.user);
  console.log(user)
  
  return (
    <div>
      <Navbar />
      {user && user.email ? (
        <ImageGallery />
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Welcome to the Image Gallery App</h2>
          <p className="text-gray-600 text-lg">
            Please <span className="text-blue-600 font-medium">log in</span> to view and manage your images.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
