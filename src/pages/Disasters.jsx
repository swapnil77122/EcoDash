import DisasterMap from '../components/maps/DisasterMap';

const Disasters = () => {
  return (
    <div className="p-4 bg-white min-h-screen text-black">
      <h2 className="text-xl font-bold mb-4">
        🌍 Global Disasters Map
      </h2>
      <DisasterMap />
    </div>
  );
};

export default Disasters;
