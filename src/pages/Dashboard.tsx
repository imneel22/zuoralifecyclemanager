import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, SortAsc, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/zlm/Header';
import { AppSidebar } from '@/components/zlm/AppSidebar';
import { HealthScoreRing } from '@/components/zlm/HealthScoreRing';
import { PhaseBadge } from '@/components/zlm/PhaseBadge';
import { TeamAvatars } from '@/components/zlm/TeamAvatars';
import { mockImplementations } from '@/data/mockData';
import { HealthStatus } from '@/types/zlm';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('daysToGoLive');

  const getHealthStatus = (score: number): HealthStatus => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'amber';
    return 'red';
  };

  const filteredImplementations = mockImplementations
    .filter((impl) => {
      const matchesSearch = impl.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPhase = phaseFilter === 'all' || impl.currentPhase === phaseFilter;
      const matchesHealth = healthFilter === 'all' || getHealthStatus(impl.healthScore.overall) === healthFilter;
      return matchesSearch && matchesPhase && matchesHealth;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'daysToGoLive':
          return a.daysToGoLive - b.daysToGoLive;
        case 'health':
          return b.healthScore.overall - a.healthScore.overall;
        case 'name':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchValue={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Implementations</h1>
              <p className="text-muted-foreground">
                {filteredImplementations.length} active implementations
              </p>
            </div>
            
            <Button onClick={() => navigate('/create-implementation')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Implementation
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters:</span>
            </div>
            
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="configuration">Configuration</SelectItem>
                <SelectItem value="migration">Migration</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="golive">Go-Live</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="green">Healthy</SelectItem>
                <SelectItem value="amber">At Risk</SelectItem>
                <SelectItem value="red">Critical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daysToGoLive">Days to Go-Live</SelectItem>
                  <SelectItem value="health">Health Score</SelectItem>
                  <SelectItem value="name">Customer Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Phase</TableHead>
                  <TableHead className="font-semibold">Health</TableHead>
                  <TableHead className="font-semibold">Days to Go-Live</TableHead>
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImplementations.map((impl) => (
                  <TableRow 
                    key={impl.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/implementation/${impl.id}`)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{impl.customerName}</div>
                        <div className="text-sm text-muted-foreground">{impl.industry}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PhaseBadge phase={impl.currentPhase} />
                    </TableCell>
                    <TableCell>
                      <HealthScoreRing score={impl.healthScore.overall} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{impl.daysToGoLive} days</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TeamAvatars team={impl.team} max={3} />
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredImplementations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No implementations found matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setPhaseFilter('all');
                setHealthFilter('all');
                setSearchQuery('');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
