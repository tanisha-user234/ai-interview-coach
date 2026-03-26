"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle, RotateCcw, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function CodingRoundPage() {
    const [code, setCode] = useState("// Write your solution here\nfunction solve(nums, target) {\n  \n}");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running tests...");

        try {
            const result = await api.executeCode(code, "javascript");
            setOutput(result.output);
        } catch (error) {
            console.error("Execution failed:", error);
            setOutput("Error: Failed to execute code via server.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">Coding Round: Array Manipulation</h1>
                    <p className="text-sm text-slate-400">Easy • 15 mins</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setCode("// Write your solution here\nfunction solve(nums, target) {\n  \n}")}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-sm font-medium flex items-center gap-2"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`px-6 py-2 rounded text-white text-sm font-bold flex items-center gap-2 ${isRunning ? "bg-slate-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        <Play size={16} fill="currentColor" /> {isRunning ? "Running..." : "Run Code"}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Problem Statement */}
                <div className="w-1/3 p-6 overflow-y-auto border-r border-slate-700 bg-slate-900/50">
                    <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Given an array of integers, return indices of the two numbers such that they add up to a specific target.
                        You may assume that each input would have exactly one solution, and you may not use the same element twice.
                    </p>

                    <h3 className="font-semibold mt-6 mb-2">Example 1:</h3>
                    <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-slate-300">
                        Input: nums = [2,7,11,15], target = 9<br />
                        Output: [0,1]<br />
                        Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                    </div>

                    <h3 className="font-semibold mt-6 mb-2">Constraints:</h3>
                    <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1">
                        <li>2 &lt;= nums.length &lt;= 10^4</li>
                        <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                        <li>-10^9 &lt;= target &lt;= 10^9</li>
                    </ul>
                </div>

                {/* Code Editor */}
                <div className="w-2/3 flex flex-col">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            defaultValue="// Write your solution here\nfunction solve(nums, target) {\n  \n}"
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                            onChange={(value) => setCode(value || "")}
                        />
                    </div>

                    {/* Output / Console */}
                    <div className="h-48 border-t border-slate-700 bg-slate-950 p-4 font-mono text-sm overflow-y-auto">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Console Output</div>
                        {output ? (
                            <pre className="whitespace-pre-wrap text-slate-300">{output}</pre>
                        ) : (
                            <span className="text-slate-600 italic">Run your code to see output...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
