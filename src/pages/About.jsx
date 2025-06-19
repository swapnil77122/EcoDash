import { Card, CardContent } from "../components/ui/Card";

const About = () => {
  return (
    <div className="p-6 space-y-8 bg-white text-gray-800 text-sm">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-1">
          🌐 About the Environmental Dashboard
        </h1>
        <p className="text-base text-gray-600">
          Real-time insights into global environmental indicators.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dashboard Purpose */}
        <div className="border border-blue-200">
          <div className="bg-blue-700 text-white text-center py-2 font-semibold">
            📊 Dashboard Purpose
          </div>
          <Card className="!border-none !rounded-none">
            <CardContent className="p-4">
              <p>
                This dashboard provides an interactive, data-driven overview of climate and environmental trends across the globe. It empowers users with visual tools to understand complex issues like rising sea levels, CO₂ emissions, energy sources, and natural disasters. It also has map analysis and interactive maps.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="border border-blue-200">
          <div className="bg-blue-700 text-white text-center py-2 font-semibold">
            🧩 Key Features
          </div>
          <Card className="!border-none !rounded-none">
            <CardContent className="p-4">
              <ul className="list-disc list-inside space-y-1">
                <li>Live charts for CO₂, sea levels, and disaster maps</li>
                <li>Interactive filtering & real-time data visualization</li>
                <li>Downloadable PDF reports with charts & raw data</li>
                <li>Multiple chart types: Line, Bar, Map, Pie</li>
                <li>Interactive maps</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="border border-blue-200">
          <div className="bg-blue-700 text-white text-center py-2 font-semibold">
            🛠️ Technology Stack
          </div>
          <Card className="!border-none !rounded-none">
            <CardContent className="p-4">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>React</strong> + <strong>Vite</strong> for frontend SPA development</li>
                <li><strong>Recharts</strong> for responsive charting</li>
                <li><strong>Tailwind CSS</strong> for sleek, utility-first UI design</li>
                <li><strong>jsPDF</strong> + <strong>html2canvas</strong> for generating downloadable reports</li>
                <li><strong>Papaparse</strong> for processing CSV data</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Intended Users */}
        <div className="border border-blue-200">
          <div className="bg-blue-700 text-white text-center py-2 font-semibold">
            👤 Intended Users
          </div>
          <Card className="!border-none !rounded-none">
            <CardContent className="p-4">
              <ul className="list-disc list-inside space-y-1">
                <li>Researchers and data scientists</li>
                <li>Environmental policy makers</li>
                <li>Educators and students</li>
                <li>NGOs and climate activists</li>
                <li>Commercial Companies</li>
                <li>Schools</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real-World Impact - full width */}
      <div className="border border-blue-200">
        <div className="bg-blue-700 text-white text-center py-2 font-semibold">
          🌍 Real-World Impact
        </div>
        <Card className="!border-none !rounded-none">
          <CardContent className="p-4">
            <p>
              By consolidating diverse environmental datasets into one intuitive platform,
              this dashboard supports fact-based decision-making, drives awareness campaigns,
              and encourages transparency in climate science.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
