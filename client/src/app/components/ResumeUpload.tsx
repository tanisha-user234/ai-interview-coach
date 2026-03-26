"use client";

import { useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeUpload({ onUpload }: { onUpload: (file: File) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            onUpload(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            // Simple validation for check
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                onUpload(selectedFile);
            }
        }
    }

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <label
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group
                            ${isDragging
                                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                                    : "border-slate-700 bg-slate-900/30 hover:border-blue-400 hover:bg-slate-800/50"
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                                <motion.div
                                    animate={{ y: isDragging ? -10 : 0 }}
                                    className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-blue-500/20" : "bg-slate-800 group-hover:bg-slate-700"}`}
                                >
                                    <Upload className={`w-8 h-8 ${isDragging ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400 transition-colors"}`} />
                                </motion.div>
                                <p className="mb-2 text-sm text-slate-300">
                                    <span className="font-bold text-blue-400">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">PDF (MAX. 5MB)</p>
                            </div>

                            {/* Animated background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-4 border border-blue-500/30 bg-blue-500/10 rounded-xl relative overflow-hidden"
                    >
                        {/* Success Glow */}
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />

                        <div className="flex items-center space-x-4 z-10">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <FileText className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-blue-100">{file.name}</p>
                                <p className="text-xs text-blue-300/70">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all text-slate-400 z-10"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
