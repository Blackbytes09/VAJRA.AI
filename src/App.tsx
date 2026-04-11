
import React, { useState } from 'react';
import { Shield, Upload, BarChart, Loader2, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    toast("Analyzing asset...");
    
    // Simulate API call
    setTimeout(() => {
      setResult({ verdict: 'AUTHENTIC', score: 12, flags: [] });
      setLoading(false);
      toast.success("Analysis complete.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#151619] text-white p-8 font-sans">
      <header className="flex items-center gap-4 mb-12 border-b border-gray-800 pb-6">
        <Shield className="w-10 h-10 text-orange-500" />
        <h1 className="text-3xl font-bold tracking-tighter">Vajra AI <span className="text-orange-500">Forensic</span></h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#151619] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-300"><Upload /> Upload Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" onChange={handleUpload} className="border-dashed border-gray-700 bg-gray-900" />
          </CardContent>
        </Card>

        <Card className="bg-[#151619] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-300"><BarChart /> Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-orange-500">
                <Loader2 className="animate-spin" /> Analyzing...
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-green-500">
                  <CheckCircle /> {result.verdict}
                </div>
                <div className="text-sm text-gray-400">Manipulation Probability: {result.score}%</div>
                <Progress value={result.score} className="h-2" />
              </div>
            ) : (
              <p className="text-gray-500 font-mono text-sm">Waiting for input...</p>
            )}
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  );
}
