import React, { useState } from 'react';
import { Activity, Target, AlertTriangle, CheckCircle, ArrowRight, Zap, Users, TrendingUp, DollarSign, Shield, BarChart3, PieChart as PieChartIcon, Layers, Lock, RefreshCw, Download, Home, ArrowLeft, Info, X, Search, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const colors = {
    bg: 'bg-slate-950',
    card: 'bg-slate-900',
    cardHover: 'hover:bg-slate-800',
    accent: 'text-blue-400',
    border: 'border-slate-800',
    text: 'text-slate-400',
    highlight: 'text-white',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
};

const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#fbbf24'];

interface DashboardProps {
    onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
    const [idea, setIdea] = useState('');
    const [industry, setIndustry] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [isQuotaError, setIsQuotaError] = useState(false);
    const [customKey, setCustomKey] = useState('');
    const [failedStartupsData, setFailedStartupsData] = useState<any>(null);
    const [failedStartupsLoading, setFailedStartupsLoading] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [showMethodology, setShowMethodology] = useState(false);

    const handleAnalyze = async (keyOverride?: string) => {
        if (!idea || !industry) return;
        setLoading(true);
        setError('');
        setIsQuotaError(false);
        setData(null);
        setFailedStartupsData(null);

        const activeKey = keyOverride || customKey;

        try {
            const bodyPayload: any = { idea, industry };
            if (activeKey) {
                bodyPayload.custom_api_key = activeKey;
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
            const response = await fetch(`${apiUrl}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });

            if (response.status === 429) {
                throw new Error("API_QUOTA_EXHAUSTED");
            }

            if (!response.ok) throw new Error('Analysis failed');
            const result = await response.json();
            console.log("Analysis Result:", result);
            setData(result);

            setFailedStartupsLoading(true);
            fetch(`${apiUrl}/api/failed-startups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: `${industry} ${idea}` })
            })
            .then(res => res.json())
            .then(fsData => {
                setFailedStartupsData(fsData);
                setFailedStartupsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch failed startups data:", err);
                setFailedStartupsData({ error: "Could not connect to the RAG backend server. Please verify python -m src.server is running." });
                setFailedStartupsLoading(false);
            });

            if (keyOverride) {
                setCustomKey(keyOverride);
            }

        } catch (err: any) {
            console.error(err);
            if (err.message === "API_QUOTA_EXHAUSTED") {
                setIsQuotaError(true);
                setError('Daily API Quota Exceeded');
            } else {
                setError('Failed to connect to the analysis engine. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    let marketShareData = (data?.research?.competitors || []).map((c: any) => ({
        name: c.name,
        value: typeof c.market_share === 'string' ? parseFloat(c.market_share.replace(/[^0-9.]/g, '')) || 0 : Number(c.market_share || 0)
    })).filter((item: any) => !isNaN(item.value) && item.value > 0);

    if (marketShareData.length === 0 && data?.research?.competitors?.length > 0) {
        const fallbackShare = Math.floor(100 / data.research.competitors.length);
        marketShareData = data.research.competitors.map((c: any) => ({
            name: c.name || 'Unknown',
            value: fallbackShare
        }));
    }

    let demographicsData = data?.strategy?.demographics?.age_groups ?
        Object.entries(data.strategy.demographics.age_groups).map(([key, value]: [string, any]) => ({
            name: key,
            percentage: typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : Number(value || 0)
        })).filter((item: any) => !isNaN(item.percentage) && item.percentage > 0) : [];

    if (demographicsData.length === 0 && data?.strategy?.demographics?.age_groups) {
        demographicsData = [
            { name: '18-24', percentage: 20 },
            { name: '25-34', percentage: 40 },
            { name: '35-44', percentage: 25 },
            { name: '45+', percentage: 15 }
        ];
    }

    return (
        <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans selection:bg-blue-500/30 print:bg-white`}>
            <style>
                {`
          @media print {
            .no-print { display: none !important; }
            body { background-color: white !important; color: #0f172a !important; -webkit-print-color-adjust: exact; }
            .print-card { 
               background-color: white !important; 
               border: 1px solid #cbd5e1 !important; 
               box-shadow: none !important; 
               color: #0f172a !important; 
               break-inside: avoid;
            }
            /* Universal text colors for high-contrast print readability */
            .text-white, .text-slate-100, .text-slate-200, .text-slate-300 { color: #0f172a !important; }
            .text-slate-400, .text-slate-500 { color: #475569 !important; }
            .text-blue-300, .text-blue-400, .text-blue-500 { color: #1e40af !important; }
            .text-emerald-400, .text-emerald-500 { color: #064e3b !important; }
            .text-amber-400, .text-amber-500 { color: #92400e !important; }
            .text-purple-400, .text-purple-500 { color: #6b21a8 !important; }
            .text-red-400, .text-red-500 { color: #991b1b !important; }

            /* Remove dark backgrounds and transparency */
            .bg-slate-900, .bg-slate-950, .bg-slate-900\/50, .bg-slate-900\/40, .bg-slate-900\/60, .bg-slate-950\/50, .bg-slate-900\/10 { 
                background-color: transparent !important; 
            }
            .backdrop-blur-sm, .backdrop-blur-md { backdrop-filter: none !important; }
            
            /* Give failed startups boxes and insights a subtle background for contrast */
            .bg-blue-900\/10, .bg-slate-950\/50, .bg-red-500\/10 { 
                background-color: #f8fafc !important; 
                border: 1px solid #e2e8f0 !important; 
            }
            
            /* Ensure bars and indicators remain visible */
            .bg-blue-600, .bg-blue-500 { background-color: #2563eb !important; }
          }
        `}
            </style>

            <nav className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 print:hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div
                            className="flex items-center space-x-2 cursor-pointer group"
                            onClick={onBack}
                        >
                            <span className="text-xl font-bold text-white tracking-tight">StartupLens</span>
                        </div>
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">

                {!data && !loading && !error && (
                    <div className="max-w-3xl mx-auto mt-12 space-y-8 animate-fade-in-up">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                Validate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Vision.</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
                                Enter your startup concept below to generate a professional market analysis, competitor breakdown, and strategic roadmap.
                            </p>
                        </div>

                        <div className={`p-8 rounded-2xl ${colors.card} border ${colors.border} shadow-2xl shadow-blue-900/10 space-y-6 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest mb-2">Startup Concept</label>
                                    <textarea
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-white placeholder-slate-400 h-32 font-medium"
                                        placeholder="Describe your idea in detail..."
                                        value={idea}
                                        onChange={(e) => setIdea(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-widest mb-2">Target Industry</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-400 font-medium"
                                        placeholder="e.g., EdTech, Fintech, Agritech"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => handleAnalyze()}
                                    disabled={!idea || !industry}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 ${colors.buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <span>Generate Intelligence Report</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center h-96 space-y-12">
                        <div className="flex space-x-4 items-center justify-center p-6">
                            <div className="w-5 h-5 rounded-full bg-[#4285F4] animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-5 h-5 rounded-full bg-[#EA4335] animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-5 h-5 rounded-full bg-[#FBBC05] animate-bounce [animation-delay:0s]"></div>
                            <div className="w-5 h-5 rounded-full bg-[#34A853] animate-bounce [animation-delay:-0.15s]"></div>
                        </div>

                        <div className="text-center space-y-4 animate-pulse">
                            <h3 className="text-3xl font-bold text-white">Generating Intelligence...</h3>
                            <p className="text-slate-400 text-lg">Analyzing competitors, risks, and market gaps.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-2xl mx-auto mt-20 animate-fade-in text-center">
                        <div className={`p-8 rounded-3xl border ${isQuotaError ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-900 border-slate-800'} shadow-xl relative overflow-hidden`}>
                            {isQuotaError ? (
                                <div className="space-y-6">
                                    <div className="flex justify-center mb-2">
                                        <div className="p-4 bg-red-500/10 rounded-full animate-pulse">
                                            <Lock className="w-8 h-8 text-red-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">API Limit Reached</h2>
                                        <p className="text-slate-400 mb-6 leading-relaxed max-w-lg mx-auto">
                                            The demo server's daily rate limit has been exhausted. You can try again later, or use your own Google Gemini API key to continue testing immediately.
                                        </p>
                                    </div>

                                    <div className="max-w-md mx-auto bg-slate-950 p-6 rounded-xl border border-red-900/30 shadow-inner text-left">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Enter Your Gemini API Key</label>
                                        <input
                                            type="password"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-4 text-white"
                                            placeholder="AIzaSy..."
                                            value={customKey}
                                            onChange={(e) => setCustomKey(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleAnalyze(customKey)}
                                            disabled={!customKey}
                                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            <span>Retry with My Key</span>
                                        </button>
                                        <p className="text-xs text-slate-500 mt-3 text-center">
                                            Your key is only used for this session and isn't stored.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setError(''); setIsQuotaError(false); }}
                                        className="text-slate-500 hover:text-white text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <AlertTriangle className="w-12 h-12 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
                                    <p className="text-slate-400 mb-6">{error}</p>
                                    <button
                                        onClick={() => setError('')}
                                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {data && !loading && (
                    <div className="space-y-8 animate-fade-in pb-20">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className={`col-span-1 ${colors.card} border ${colors.border} rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm print-card`}>
                                <div className="flex items-center space-x-2 mb-6">
                                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Viability Score</h3>
                                    <button 
                                        onClick={() => setShowMethodology(true)}
                                        className="p-1 hover:bg-slate-800 rounded-full text-slate-500 hover:text-blue-400 transition-colors no-print"
                                        title="View Calculation Methodology"
                                    >
                                        <Info className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                        <circle
                                            cx="64" cy="64" r="56"
                                            stroke="currentColor" strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={351}
                                            strokeDashoffset={351 - (351 * (data.strategy?.viability_score || 0)) / 100}
                                            className={`text-blue-500 transition-all duration-1000 ease-out shadow-neon`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-4xl font-bold text-white">{data.strategy?.viability_score || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`col-span-1 md:col-span-3 ${colors.card} border ${colors.border} rounded-2xl p-8 flex flex-col justify-center shadow-lg shadow-blue-900/5 print-card`}>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg no-print">
                                        <Zap className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">The Whitespace Opportunity</h3>
                                </div>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    {data.research?.opportunity || "Analysis pending..."}
                                </p>
                            </div>
                        </div>

                        {data.strategy?.financials && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Revenue / User</h4>
                                    <div className="flex flex-col">
                                        <p className="text-2xl font-bold text-emerald-400">{data.strategy.financials.revenue_per_user.split('(')[0].trim()}</p>
                                        {data.strategy.financials.revenue_per_user.includes('(') && (
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                {data.strategy.financials.revenue_per_user.split('(')[1].replace(')', '')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Min Investment</h4>
                                    <div className="flex flex-col">
                                        <p className="text-2xl font-bold text-blue-400">{data.strategy.financials.min_investment.split('(')[0].trim()}</p>
                                        {data.strategy.financials.min_investment.includes('(') && (
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                {data.strategy.financials.min_investment.split('(')[1].replace(')', '')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Break-even</h4>
                                    <div className="flex flex-col">
                                        <p className="text-2xl font-bold text-amber-400">{data.strategy.financials.break_even.split('(')[0].trim()}</p>
                                        {data.strategy.financials.break_even.includes('(') && (
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                {data.strategy.financials.break_even.split('(')[1].replace(')', '')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Growth Rate</h4>
                                    <div className="flex flex-col">
                                        <p className="text-2xl font-bold text-purple-400">{data.strategy.financials.user_growth_rate.split('(')[0].trim()}</p>
                                        {data.strategy.financials.user_growth_rate.includes('(') && (
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                {data.strategy.financials.user_growth_rate.split('(')[1].replace(')', '')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`${colors.card} border ${colors.border} rounded-2xl p-8 shadow-sm print-card`}>
                            <div className="flex items-center space-x-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-blue-400 no-print" />
                                <h2 className="text-xl font-bold text-white">Supporting Market Trends</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(data.research?.market_trends || []).map((trend: string, i: number) => (
                                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950/50 print:bg-slate-50">
                                        <div className="mt-1"><ArrowRight className="w-4 h-4 text-blue-500" /></div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{trend}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                            <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className="text-lg font-bold text-white flex items-center">
                                        <PieChartIcon className="w-5 h-5 mr-2 text-blue-400 no-print" /> Market Share
                                    </h3>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={marketShareData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {marketShareData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                                itemStyle={{ color: '#f8fafc' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse no-print"></div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                            {data.research?.market_share_insight || "Competitors are fighting for dominance in this fragmented landscape."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`${colors.card} border ${colors.border} rounded-2xl p-6 shadow-sm print-card`}>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className="text-lg font-bold text-white flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-blue-400 no-print" /> Age Demographics
                                    </h3>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={demographicsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}%`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#334155', opacity: 0.4 }}
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                            />
                                            <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse no-print"></div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                            {data.strategy?.demographics?.demographics_insight || "Targeting the most active user base for maximum adoption."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <Layers className="w-6 h-6 text-blue-400 no-print" />
                                <h2 className="text-2xl font-bold text-white">Execution Strategy</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-8 shadow-sm print-card`}>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <TrendingUp className="w-5 h-5 text-blue-400 no-print" />
                                        <h3 className="text-lg font-bold text-white">Acquisition</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {(data.strategy?.user_acquisition || []).map((item: string, i: number) => {
                                            const parts = item.includes(':') ? item.split(':') : [item, ''];
                                            return (
                                                <li key={i}>
                                                    <span className="text-white font-semibold block mb-1">{parts[0]}</span>
                                                    {parts[1] && <span className="text-slate-400 text-xs leading-relaxed block">{parts[1]}</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-8 shadow-sm print-card`}>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <DollarSign className="w-5 h-5 text-blue-400 no-print" />
                                        <h3 className="text-lg font-bold text-white">Monetization</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {(data.strategy?.business_models || []).map((item: string, i: number) => {
                                            const parts = item.includes(':') ? item.split(':') : [item, ''];
                                            return (
                                                <li key={i}>
                                                    <span className="text-white font-semibold block mb-1">{parts[0]}</span>
                                                    {parts[1] && <span className="text-slate-400 text-xs leading-relaxed block">{parts[1]}</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className={`${colors.card} border ${colors.border} rounded-2xl p-8 shadow-sm print-card`}>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Shield className="w-5 h-5 text-red-500 no-print" />
                                        <h3 className="text-lg font-bold text-white">Primary Risk</h3>
                                    </div>
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl print:bg-red-50 print:border-red-200">
                                        <p className="text-red-400 text-sm leading-relaxed">{data.strategy?.risk_analysis}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <BarChart3 className="w-6 h-6 text-blue-400 no-print" />
                                <h2 className="text-2xl font-bold text-white">SWOT Analysis</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm print-card">
                                    <h4 className="text-emerald-400 font-bold mb-4 flex items-center print:text-emerald-700"><CheckCircle className="w-4 h-4 mr-2" /> Strengths</h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs">
                                        {(data.strategy?.swot?.strengths || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm print-card">
                                    <h4 className="text-red-400 font-bold mb-4 flex items-center print:text-red-700"><AlertTriangle className="w-4 h-4 mr-2" /> Weaknesses</h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs">
                                        {(data.strategy?.swot?.weaknesses || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm print-card">
                                    <h4 className="text-blue-400 font-bold mb-4 flex items-center print:text-blue-700"><TrendingUp className="w-4 h-4 mr-2" /> Opportunities</h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs">
                                        {(data.strategy?.swot?.opportunities || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm print-card">
                                    <h4 className="text-amber-400 font-bold mb-4 flex items-center print:text-amber-700"><Shield className="w-4 h-4 mr-2" /> Threats</h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs">
                                        {(data.strategy?.swot?.threats || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {failedStartupsLoading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mb-4"></div>
                                    <p className="text-slate-400">Analyzing past failures in {industry}...</p>
                                </div>
                            </div>
                        )}

                        {failedStartupsData && failedStartupsData.startups && (
                            <div className="space-y-6 mt-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="w-8 h-8 text-amber-500 no-print" />
                                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Ghost Town: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Failed Startups</span></h2>
                                    </div>
                                </div>

                                {failedStartupsData.summary && (
                                    <div className="p-6 rounded-2xl bg-slate-900/60 border-l-4 border-blue-500/50 shadow-sm print-card mb-8">
                                        <p className="text-slate-300 text-lg leading-relaxed font-medium">"{failedStartupsData.summary}"</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {failedStartupsData.startups.map((startup: any, i: number) => (
                                        <div key={i} className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-blue-500/30 transition-all duration-300 shadow-xl print-card flex flex-col gap-6 relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                            
                                            <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">{startup.name}</h3>
                                                    <p className="text-blue-400/80 text-sm font-medium">{startup.sector}</p>
                                                </div>
                                                <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                                                    <span className="text-xs text-slate-400 font-medium">{startup.years_of_operation}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-5 flex-grow">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">What They Did</span>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{startup.product_type}</p>
                                                </div>
                                                
                                                <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-800/20">
                                                    <span className="text-[10px] text-blue-300/80 uppercase tracking-widest font-bold block mb-2">Why They Failed</span>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{startup.failure_analysis}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-auto pt-5 border-t border-slate-800/80 flex justify-between items-end">
                                                <div className="w-2/3 pr-4">
                                                    <span className="text-[10px] text-indigo-300/70 uppercase tracking-widest font-bold block mb-1">Key Learning</span>
                                                    <p className="text-sm text-slate-300 font-medium">{startup.learnings}</p>
                                                </div>
                                                <div className="w-1/3 text-right">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Cash Burned</span>
                                                    <span className="text-lg text-slate-100 font-bold">{startup.cash_burned}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {failedStartupsData && failedStartupsData.error && (
                            <div className="space-y-6 mt-12 bg-slate-900/50 p-8 rounded-3xl border border-red-900/50">
                                <div className="flex items-center space-x-3 text-red-500">
                                    <AlertTriangle className="w-8 h-8 no-print" />
                                    <h2 className="text-2xl font-bold">Failed Startups Analysis Error</h2>
                                </div>
                                <div className="p-4 bg-red-950/30 rounded-xl border border-red-900/30">
                                    <p className="text-red-300 leading-relaxed font-medium">It looks like the RAG engine couldn't start: <strong>{failedStartupsData.error}</strong></p>
                                </div>
                            </div>
                        )}

                        <div className={`p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-2xl relative overflow-hidden mt-12 mb-8 group no-print`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-400/30 transition-all duration-700"></div>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                                <div className="space-y-4 max-w-2xl text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start space-x-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <Zap className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-white tracking-tight">Need Expert Guidance?</h3>
                                    </div>
                                    <p className="text-blue-100/80 text-lg leading-relaxed">
                                        Take your startup from idea to execution with our <span className="text-white font-bold">Pro Plan</span>. Get 1-on-1 mentorship, pitch deck reviews, and deep-dive strategy sessions with industry experts.
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => setShowPricing(true)}
                                    className="w-full md:w-auto px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center space-x-3 flex-shrink-0"
                                >
                                    <span>Upgrade to Pro</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mt-12 pt-8 border-t border-slate-800 no-print">
                            <button
                                onClick={() => setData(null)}
                                className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-all ${colors.buttonSecondary}`}
                            >
                                Evaluate Another Idea
                            </button>
                            <button
                                onClick={handlePrint}
                                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${colors.buttonPrimary}`}
                            >
                                <Download className="w-5 h-5" />
                                <span>Download & Print</span>
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* Pricing Modal */}
            {showPricing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
                        onClick={() => setShowPricing(false)}
                    ></div>
                    
                    <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-extrabold text-white mb-2">StartupLens <span className="text-blue-400">Pro</span></h3>
                            <p className="text-slate-400">Everything you need to successfully launch.</p>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="text-center bg-slate-950/50 p-6 rounded-2xl border border-white/5 w-full">
                                <span className="text-5xl font-extrabold text-white">$20</span>
                                <span className="text-slate-500 ml-2">/ month</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[
                                "Unlimited AI Analysis Reports",
                                "1-on-1 Strategy Session with Experts",
                                "Pitch Deck Review & Feedback",
                                "Investor-Ready Financial Projections",
                                "Advanced Market Competitor Tracking"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3 text-sm text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button 
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                onClick={() => {
                                    alert("Thank you for your interest! Payment integration coming soon in the production version.");
                                    setShowPricing(false);
                                }}
                            >
                                Get Started Now
                            </button>
                            <button 
                                className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                                onClick={() => setShowPricing(false)}
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Methodology Modal */}
            {showMethodology && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
                        onClick={() => setShowMethodology(false)}
                    ></div>
                    
                    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3 text-blue-400">
                                <Info className="w-6 h-6" />
                                <h3 className="text-2xl font-bold text-white">Analysis Methodology</h3>
                            </div>
                            <button onClick={() => setShowMethodology(false)} className="text-slate-500 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg w-fit">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                </div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Agentic Reasoning</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Our system uses <span className="text-blue-400 font-semibold">Multi-Agent Orchestration</span>. While the Scout Agent gathers raw market data, the Analyst Agent cross-references these against competitor saturation to derive the Viability Score.
                                </p>
                            </div>
                            
                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg w-fit">
                                    <Search className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">RAG Failure Mapping</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Metrics are grounded using <span className="text-emerald-400 font-semibold">Retrieval-Augmented Generation</span>. The AI maps your idea against a database of verified startup failures to identify high-risk overlap areas.
                                </p>
                            </div>

                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg w-fit">
                                    <BarChart2 className="w-5 h-5 text-amber-400" />
                                </div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Heuristic Weighting</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    The 0-100 score is calculated based on <span className="text-amber-400 font-semibold">6 Core Heuristics</span>: Market Density, Barrier to Entry, Capital Intensity, Consumer Behavior Trends, Execution Complexity, and Scalability Potential.
                                </p>
                            </div>

                            <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg w-fit">
                                    <Target className="w-5 h-5 text-purple-400" />
                                </div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Market Inferencing</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Financials are not generic; they are <span className="text-purple-400 font-semibold">Inferred Projections</span>. By analyzing the current CAC (Customer Acquisition Cost) of competitors, the AI simulates a realistic breakeven timeline.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20">
                            <p className="text-sm text-blue-100/80 leading-relaxed italic text-center">
                                "The AI serves as a <strong>Decision Support System</strong>, synthesizing millions of data points into a strategic draft. For production deployment, these metrics should be validated against actual primary market research."
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
