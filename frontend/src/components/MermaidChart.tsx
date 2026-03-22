import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
});

const MermaidChart: React.FC<MermaidProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (ref.current) {
                try {
                    ref.current.removeAttribute('data-processed');
                    ref.current.innerHTML = chart;

                    await mermaid.run({
                        nodes: [ref.current],
                    });
                    setError(null);
                } catch (err) {
                    console.error("Mermaid generation error:", err);
                    setError("Failed to render diagram");
                }
            }
        };
        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="p-4 border border-red-500/50 bg-red-500/10 rounded text-red-200 text-sm">
                <p>Diagram Error</p>
                <pre className="text-xs mt-2 opacity-50">{chart}</pre>
            </div>
        );
    }

    return (
        <div className="mermaid overflow-x-auto bg-gray-900/50 p-4 rounded-lg my-4 flex justify-center" ref={ref}>
            {chart}
        </div>
    );
};

export default MermaidChart;
