import { useState, useEffect } from 'react';
import { rickAndMortyApi } from '../services/rickAndMortyApi';
import { Character } from '../types/character';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Dna, Globe, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const Stats = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        // First, get the first page to know how many pages there are in total
        const firstPage = await rickAndMortyApi.getCharacters(1);
        const totalPages = firstPage.info.pages;
        
        // Fetch all pages
        const promises = Array.from({ length: totalPages }, (_, i) =>
          rickAndMortyApi.getCharacters(i + 1)
        );
        const results = await Promise.all(promises);
        const allCharacters = results.flatMap((r) => r.results);
        setCharacters(allCharacters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Status data
  const statusData = [
    {
      id: 'status-alive',
      name: 'Vivos',
      value: characters.filter((c) => c.status === 'Alive').length,
      color: '#10b981',
    },
    {
      id: 'status-dead',
      name: 'Muertos',
      value: characters.filter((c) => c.status === 'Dead').length,
      color: '#ef4444',
    },
    {
      id: 'status-unknown',
      name: 'Desconocido',
      value: characters.filter((c) => c.status === 'unknown').length,
      color: '#6b7280',
    },
  ];

  // Gender data
  const genderData = [
    {
      id: 'gender-male',
      name: 'Masculino',
      value: characters.filter((c) => c.gender === 'Male').length,
      fill: '#97ce4c',
    },
    {
      id: 'gender-female',
      name: 'Femenino',
      value: characters.filter((c) => c.gender === 'Female').length,
      fill: '#00b5cc',
    },
    {
      id: 'gender-genderless',
      name: 'Sin género',
      value: characters.filter((c) => c.gender === 'Genderless').length,
      fill: '#f77f00',
    },
    {
      id: 'gender-unknown',
      name: 'Desconocido',
      value: characters.filter((c) => c.gender === 'unknown').length,
      fill: '#9d4edd',
    },
  ].filter((item) => item.value > 0);

  // Species data (top 10)
  const speciesCount = characters.reduce((acc, char) => {
    acc[char.species] = (acc[char.species] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const speciesColors = ['#97ce4c', '#00b5cc', '#f77f00', '#d62828', '#9d4edd', '#00ff88', '#ff6b9d', '#ffd60a', '#06ffa5', '#8338ec'];
  
  const speciesData = Object.entries(speciesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([species, count], index) => ({
      id: `species-${species.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      name: species,
      value: count,
      fill: speciesColors[index % speciesColors.length],
    }));

  // Radar chart data
  const radarData = [
    {
      id: 'radar-humans',
      category: 'Humanos',
      value: characters.filter((c) => c.species === 'Human').length,
    },
    {
      id: 'radar-aliens',
      category: 'Alienígenas',
      value: characters.filter((c) => c.species === 'Alien').length,
    },
    {
      id: 'radar-alive',
      category: 'Vivos',
      value: characters.filter((c) => c.status === 'Alive').length,
    },
    {
      id: 'radar-dead',
      category: 'Muertos',
      value: characters.filter((c) => c.status === 'Dead').length,
    },
    {
      id: 'radar-male',
      category: 'Masculino',
      value: characters.filter((c) => c.gender === 'Male').length,
    },
    {
      id: 'radar-female',
      category: 'Femenino',
      value: characters.filter((c) => c.gender === 'Female').length,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const StatCard = ({ icon: Icon, title, value, gradient, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <Card className={`relative overflow-hidden border-2 border-[#97ce4c]/30 bg-gradient-to-br ${gradient} shadow-2xl`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">{title}</p>
              <p className="text-4xl font-bold text-white">{value}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <style>{`
        #status-pie-chart * {
          outline: none !important;
        }
        #status-pie-chart path:focus {
          outline: none !important;
        }
        .recharts-sector:focus {
          outline: none !important;
        }
      `}</style>
      
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#97ce4c] to-[#00b5cc] p-3 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-[#0d1b2a]" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#97ce4c] via-[#00b5cc] to-[#f77f00] bg-clip-text text-transparent">
            Statistical Dashboard
          </h1>
        </div>
        <p className="text-[#98c1d9] text-lg">
          Complete analysis of {characters.length} characters from the multiverse
        </p>
      </motion.div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Characters"
          value={characters.length}
          gradient="from-[#1b263b] to-[#415a77]"
          delay={0}
        />
        <StatCard
          icon={Dna}
          title="Unique Species"
          value={Object.keys(speciesCount).length}
          gradient="from-[#97ce4c] to-[#00b5cc]"
          delay={0.1}
        />
        <StatCard
          icon={Activity}
          title="Survival Rate"
          value={`${((statusData.find((s) => s.name === 'Vivos')?.value || 0) / characters.length * 100).toFixed(1)}%`}
          gradient="from-[#00b5cc] to-[#0077b6]"
          delay={0.2}
        />
        <StatCard
          icon={Globe}
          title="Most Common"
          value={speciesData[0]?.name || 'N/A'}
          gradient="from-[#f77f00] to-[#d62828]"
          delay={0.3}
        />
      </div>

      {/* Charts Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Status Pie Chart */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="bg-[#1b263b]/90 backdrop-blur-sm border-2 border-[#97ce4c]/30 hover:border-[#97ce4c]/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-[#0d1b2a]/50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#97ce4c]" />
                <span className="text-[#e0fbfc]">
                  Character Status
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart id="status-pie-chart">
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => {
                      const colorMap: Record<string, string> = {
                        'Vivos': '#97ce4c',
                        'Muertos': '#d62828',
                        'Desconocido': '#00b5cc'
                      };
                      return <Cell key={entry.id} fill={colorMap[entry.name] || entry.color} stroke="none" strokeWidth={0} />;
                    })}
                  </Pie>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{
                      backgroundColor: '#1b263b',
                      borderRadius: '0.5rem',
                      border: '2px solid #97ce4c',
                      color: '#e0fbfc',
                    }}
                    itemStyle={{
                      color: '#e0fbfc',
                    }}
                    labelStyle={{
                      color: '#97ce4c',
                      fontWeight: 'bold',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                    iconType="circle"
                    formatter={(value, entry: any) => {
                      const item = statusData.find(d => d.name === value);
                      return <span style={{ color: '#e0fbfc' }}>{value}: {item?.value || 0}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Bar Chart */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="bg-[#1b263b]/90 backdrop-blur-sm border-2 border-[#00b5cc]/30 hover:border-[#00b5cc]/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-[#0d1b2a]/50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00b5cc]" />
                <span className="text-[#e0fbfc]">
                  Gender Distribution
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genderData} id="gender-bar-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#415a77" />
                  <XAxis dataKey="name" stroke="#98c1d9" />
                  <YAxis stroke="#98c1d9" />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: '#1b263b',
                      borderRadius: '0.5rem',
                      border: '2px solid #00b5cc',
                      color: '#e0fbfc',
                    }}
                    itemStyle={{
                      color: '#e0fbfc',
                    }}
                    labelStyle={{
                      color: '#00b5cc',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                    {genderData.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="bg-[#1b263b]/90 backdrop-blur-sm border-2 border-[#f77f00]/30 hover:border-[#f77f00]/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-[#0d1b2a]/50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#f77f00]" />
                <span className="text-[#e0fbfc]">
                  Multidimensional Analysis
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#415a77" />
                  <PolarAngleAxis dataKey="category" stroke="#98c1d9" />
                  <PolarRadiusAxis stroke="#98c1d9" />
                  <Radar
                    name="Cantidad"
                    dataKey="value"
                    stroke="#97ce4c"
                    fill="#97ce4c"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    cursor={false}
                    contentStyle={{
                      backgroundColor: '#1b263b',
                      borderRadius: '0.5rem',
                      border: '2px solid #f77f00',
                      color: '#e0fbfc',
                    }}
                    itemStyle={{
                      color: '#e0fbfc',
                    }}
                    labelStyle={{
                      color: '#f77f00',
                      fontWeight: 'bold',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Species Bar Chart */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="bg-[#1b263b]/90 backdrop-blur-sm border-2 border-[#9d4edd]/30 hover:border-[#9d4edd]/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-[#0d1b2a]/50">
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-[#9d4edd]" />
                <span className="text-[#e0fbfc]">
                  Top 10 Species
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={speciesData} layout="vertical" id="species-bar-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#415a77" />
                  <XAxis type="number" stroke="#98c1d9" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#98c1d9" style={{ fontSize: '14px' }} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: '#1b263b',
                      borderRadius: '0.5rem',
                      border: '2px solid #9d4edd',
                      color: '#e0fbfc',
                    }}
                    itemStyle={{
                      color: '#e0fbfc',
                    }}
                    labelStyle={{
                      color: '#9d4edd',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive={false}>
                    {speciesData.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="relative overflow-hidden border-2 border-[#97ce4c]/30 bg-gradient-to-br from-[#1b263b] to-[#415a77] shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#97ce4c]" />
                <h3 className="text-[#e0fbfc] font-semibold">General Data</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Human Characters:</span>
                  <span className="font-bold text-2xl text-[#97ce4c]">
                    {characters.filter((c) => c.species === 'Human').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Aliens:</span>
                  <span className="font-bold text-2xl text-[#97ce4c]">
                    {characters.filter((c) => c.species === 'Alien').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Other Species:</span>
                  <span className="font-bold text-2xl text-[#97ce4c]">
                    {characters.filter((c) => c.species !== 'Human' && c.species !== 'Alien').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="relative overflow-hidden border-2 border-[#00b5cc]/30 bg-gradient-to-br from-[#1b263b] to-[#415a77] shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-[#00b5cc]" />
                <h3 className="text-[#e0fbfc] font-semibold">Status Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Alive:</span>
                  <span className="font-bold text-2xl text-[#00b5cc]">
                    {characters.filter((c) => c.status === 'Alive').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Dead:</span>
                  <span className="font-bold text-2xl text-[#00b5cc]">
                    {characters.filter((c) => c.status === 'Dead').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Unknown Status:</span>
                  <span className="font-bold text-2xl text-[#00b5cc]">
                    {characters.filter((c) => c.status === 'unknown').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="relative overflow-hidden border-2 border-[#f77f00]/30 bg-gradient-to-br from-[#1b263b] to-[#415a77] shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Dna className="w-5 h-5 text-[#f77f00]" />
                <h3 className="text-[#e0fbfc] font-semibold">Origin & Location</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">From Earth:</span>
                  <span className="font-bold text-2xl text-[#f77f00]">
                    {characters.filter((c) => c.origin.name.includes('Earth')).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Unknown Origin:</span>
                  <span className="font-bold text-2xl text-[#f77f00]">
                    {characters.filter((c) => c.origin.name === 'unknown').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Other Origins:</span>
                  <span className="font-bold text-2xl text-[#f77f00]">
                    {characters.filter((c) => !c.origin.name.includes('Earth') && c.origin.name !== 'unknown').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};