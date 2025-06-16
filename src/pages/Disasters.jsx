import DisasterMap from '../components/maps/DisasterMap';

const Disasters = () => {
  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-bold mb-4">
        🌍 Global Disasters Map
      </h2>
      <DisasterMap />
    </div>
  );
};

export default Disasters;
