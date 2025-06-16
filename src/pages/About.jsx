import { Card, CardContent } from "../components/ui/Card";

const About = () => {
  return (
    <div className="p-8 space-y-10 text-gray-800">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">🌐 About the Environmental Dashboard</h1>
        <p className="text-lg text-gray-600">
          Real-time insights into global environmental indicators.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">📊 Dashboard Purpose</h2>
            <p>
              This dashboard provides an interactive, data-driven overview of climate and environmental trends across the globe.
              It empowers users with visual tools to understand complex issues like rising sea levels, CO₂ emissions, energy sources, and natural disasters.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🧩 Key Features</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Live charts for CO₂, sea levels, and disaster maps</li>
              <li>Interactive filtering & real-time data visualization</li>
              <li>Downloadable PDF reports with charts & raw data</li>
              <li>Multiple chart types: Line, Bar, Map, Pie</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">🛠️ Technology Stack</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>React</strong> + <strong>Vite</strong> for frontend SPA development</li>
              <li><strong>Recharts</strong> for responsive charting</li>
              <li><strong>Tailwind CSS</strong> for sleek, utility-first UI design</li>
              <li><strong>jsPDF</strong> + <strong>html2canvas</strong> for generating downloadable reports</li>
              <li><strong>Papaparse</strong> for processing CSV data</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-3">👤 Intended Users</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Researchers and data scientists</li>
              <li>Environmental policy makers</li>
              <li>Educators and students</li>
              <li>NGOs and climate activists</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">🌍 Real-World Impact</h2>
          <p>
            By consolidating diverse environmental datasets into one intuitive platform,
            this dashboard supports fact-based decision-making, drives awareness campaigns, and encourages transparency in climate science.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
