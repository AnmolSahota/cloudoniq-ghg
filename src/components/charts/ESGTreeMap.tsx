import React, { useState } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { ESG_DATA, ESGNode } from "./esgTreeMap.data";
import { ESGTreeMapCell } from "./ESGTreeMapCell";
import { ESGTreeMapTooltip } from "./ESGTreeMapTooltip";

export function ESGTreeMap() {
  const [currentNode, setCurrentNode] = useState<ESGNode>(ESG_DATA);
  const [history, setHistory] = useState<ESGNode[]>([]);

  const handleClick = (node: any) => {
    // Check if the clicked node has children to drill into
    if (node.children && node.children.length > 0) {
      setHistory((prev) => [...prev, currentNode]);
      setCurrentNode(node);
    }
  };

  const handleBack = () => {
    const prev = history[history.length - 1];
    if (!prev) return;

    setHistory((h) => h.slice(0, -1));
    setCurrentNode(prev);
  };

  const canGoBack = history.length > 0;

  return (
    <div className="relative">
      {/* Header with title and back button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Building Blocks of the Pillar
          </h3>
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Information"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 16v-4m0-4h.01"
              />
            </svg>
          </button>
        </div>

        {canGoBack && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Breadcrumb navigation */}
      {canGoBack && (
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => {
              setCurrentNode(ESG_DATA);
              setHistory([]);
            }}
            className="hover:text-gray-900 hover:underline"
          >
            All Pillars
          </button>
          {history.map((node, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => {
                  setCurrentNode(node);
                  setHistory((h) => h.slice(0, index));
                }}
                className="hover:text-gray-900 hover:underline"
              >
                {node.name}
              </button>
            </React.Fragment>
          ))}
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">{currentNode.name}</span>
        </div>
      )}

      {/* Treemap visualization */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ minHeight: '500px' }}>
        <div style={{ width: '100%', height: '480px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={currentNode.children || []}
              dataKey="value"
              stroke="#fff"
              content={<ESGTreeMapCell />}
              onClick={handleClick}
              isAnimationActive={true}
              animationDuration={300}
            >
              <Tooltip content={<ESGTreeMapTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Helper text */}
      {!canGoBack && (
        <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Click on any category to drill down and view details
        </div>
      )}
    </div>
  );
}