import React, { useState, useRef } from 'react';
import { Upload, FileCheck, CheckCircle2, AlertCircle, FileText, Download, Search, Settings, UserCheck, Clock, Zap, CheckSquare, ChevronUp, Percent, Award, Target, BookOpen, Briefcase as BriefcaseBusiness } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResumeAnalysis {
  score: number;
  fileName: string;
  filePreview: string;
  detailedAnalysis: {
    readability: {
      score: number;
      feedback: string[];
    };
    keywords: {
      score: number;
      found: string[];
      missing: string[];
    };
    experience: {
      score: number;
      feedback: string[];
    };
    education: {
      score: number;
      feedback: string[];
    };
  };
  softSkills: string[];
  hardSkills: string[];
  suggestions: {
    critical: string[];
    recommended: string[];
    optional: string[];
  };
  semanticAnalysis: {
    measurableAchievements: number;
    skillsEfficiencyRatio: number;
    impactVerbs: string[];
    industryKeywords: string[];
  };
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await handleFileUpload(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    // Create file preview
    const filePreview = await getFilePreview(uploadedFile);
    analyzeResume(uploadedFile, filePreview);
    
    // Scroll to analysis section after a short delay
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const getFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 10;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;

    // Title and Summary
    doc.setFontSize(24);
    doc.setTextColor(0, 128, 128);
    doc.text('Resume Analysis Report', margin, yPos);
    yPos += lineHeight * 2;

    // File Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`File Name: ${analysis.fileName}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += lineHeight * 2;

    // Overall Score
    doc.setFontSize(16);
    doc.text(`Overall ATS Score: ${analysis.score}/100`, margin, yPos);
    yPos += lineHeight * 2;

    // Detailed Analysis Sections
    const addSection = (title: string, content: string[]) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 128);
      doc.text(title, margin, yPos);
      yPos += lineHeight;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      content.forEach(item => {
        const lines = doc.splitTextToSize(item, pageWidth - (margin * 2) - 10);
        lines.forEach(line => {
          if (yPos > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(`• ${line}`, margin + 5, yPos);
          yPos += lineHeight;
        });
      });
      yPos += lineHeight;
    };

    // Add all sections
    addSection('Readability Analysis', analysis.detailedAnalysis.readability.feedback);
    addSection('Keyword Analysis', [
      'Found Keywords: ' + analysis.detailedAnalysis.keywords.found.join(', '),
      'Missing Important Keywords: ' + analysis.detailedAnalysis.keywords.missing.join(', ')
    ]);
    addSection('Experience Analysis', analysis.detailedAnalysis.experience.feedback);
    addSection('Education Analysis', analysis.detailedAnalysis.education.feedback);
    addSection('Impact Verbs Used', analysis.semanticAnalysis.impactVerbs);
    addSection('Industry-Specific Keywords', analysis.semanticAnalysis.industryKeywords);

    // Critical Improvements
    addSection('Critical Improvements Needed', analysis.suggestions.critical);
    addSection('Recommended Improvements', analysis.suggestions.recommended);
    addSection('Optional Enhancements', analysis.suggestions.optional);

    // Skills Analysis
    addSection('Hard Skills', analysis.hardSkills);
    addSection('Soft Skills', analysis.softSkills);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    const footerText = 'Generated by Resume Check - Comprehensive ATS Analysis Report';
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save the PDF
    doc.save('detailed-resume-analysis.pdf');
  };

  const analyzeResume = (file: File, filePreview: string) => {
    // Simulated analysis result
    setAnalysis({
      score: 85,
      fileName: file.name,
      filePreview: filePreview,
      detailedAnalysis: {
        readability: {
          score: 90,
          feedback: [
            'Good use of clear, concise language',
            'Professional tone maintained throughout',
            'Consider breaking down longer paragraphs for better readability',
            'Some sentences could be more concise'
          ]
        },
        keywords: {
          score: 85,
          found: ['project management', 'agile', 'leadership', 'strategic planning'],
          missing: ['data analysis', 'budget management', 'stakeholder communication']
        },
        experience: {
          score: 88,
          feedback: [
            'Strong demonstration of progressive responsibility',
            'Quantifiable achievements well documented',
            'Consider adding more specific project outcomes',
            'Include technology stack details for technical projects'
          ]
        },
        education: {
          score: 95,
          feedback: [
            'Relevant certifications clearly listed',
            'Academic achievements well presented',
            'Consider adding relevant coursework section',
            'Include any academic projects related to target role'
          ]
        }
      },
      softSkills: [
        'Leadership',
        'Communication',
        'Problem Solving',
        'Teamwork',
        'Adaptability',
        'Time Management',
        'Critical Thinking'
      ],
      hardSkills: [
        'React',
        'TypeScript',
        'Node.js',
        'Python',
        'Project Management',
        'Agile Methodologies',
        'Data Analysis'
      ],
      suggestions: {
        critical: [
          'Add more quantifiable achievements with specific metrics',
          'Include relevant certifications and their dates',
          'Optimize keywords for ATS systems'
        ],
        recommended: [
          'Enhance professional summary with industry-specific keywords',
          'Add a skills matrix section',
          'Include relevant volunteer work or side projects'
        ],
        optional: [
          'Consider adding a brief personal statement',
          'Include relevant social media profiles',
          'Add language proficiency levels'
        ]
      },
      semanticAnalysis: {
        measurableAchievements: 6,
        skillsEfficiencyRatio: 1.0,
        impactVerbs: [
          'Led',
          'Implemented',
          'Developed',
          'Managed',
          'Orchestrated',
          'Streamlined'
        ],
        industryKeywords: [
          'Digital Transformation',
          'Agile Development',
          'Cross-functional Teams',
          'Strategic Planning'
        ]
      }
    });
  };

  const features = [
    {
      title: 'Customization',
      icon: Settings,
      description: 'Enter a job title & description to find the skills, keywords and certifications you need to match the job.',
    },
    {
      title: 'Typos',
      icon: CheckSquare,
      description: 'Check words and numbers for grammar mistakes and extra spaces to ensure your resume is error-free.',
    },
    {
      title: 'Strong Summary',
      icon: FileText,
      description: 'A well-written resume summary is a great place to add keywords. We\'ll ensure your summary is accurate and relevant.',
    },
    {
      title: 'Measurable Results',
      icon: Zap,
      description: 'Our ATS Checker suggests quantifiable achievements like "Managed 50+ calls/day" or "Boosted sales by 75%" for maximum impact.',
    },
    {
      title: 'Word Choice',
      icon: Search,
      description: 'We\'ll spot unneeded pronouns and filler words to make your resume concise and professional.',
    },
    {
      title: 'Formatting',
      icon: FileCheck,
      description: 'Formatting is crucial to ensure ATS compliance. We\'ll notify you of any formatting red flags.',
    },
  ];

  const steps = [
    {
      title: 'Upload your resume',
      description: 'Upload your resume or create a new one to check its ATS score.',
      icon: Upload,
    },
    {
      title: 'Review your resume report',
      description: 'Get a free resume review report and check out our suggestions for improving your resume.',
      icon: FileText,
    },
    {
      title: 'Optimize your resume',
      description: 'Fix mistakes manually or click "Fix My Resume" to optimize your resume.',
      icon: Settings,
    },
    {
      title: 'Download and send',
      description: 'Done! Download your resume, email it or upload it to applications error-free.',
      icon: Download,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-900 text-white">
      {/* Header Section */}
      <header className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">Resume Check</h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90">
          Upload your resume, and our ATS checker will analyze it for compatibility
          with applicant tracking systems.
        </p>
      </header>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Enhance your resume in 3 quick steps</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center text-gray-800">
              <step.icon className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div
          className={`border-4 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-white bg-teal-700/50'
              : 'border-teal-400/50 bg-teal-800/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Drag and drop your resume here
          </h2>
          <p className="mb-4 text-teal-200">
            or click the button below to upload
          </p>
          <label className="bg-white text-teal-900 px-6 py-3 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
            />
            Upload Resume
          </label>
          <p className="mt-4 text-sm text-teal-200">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our ATS Resume Scanner Checks for 30+ Common Errors</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <feature.icon className="w-12 h-12 mb-4 text-teal-300" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-teal-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div ref={analysisRef} className="max-w-6xl mx-auto px-4 mb-16 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
            {/* Score Overview */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold">Analysis Results</h2>
              <div className="flex items-center">
                <div className="text-4xl font-bold">{analysis.score}</div>
                <div className="ml-2 text-lg">/100</div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Uploaded Resume</h3>
              <div className="flex items-center space-x-4">
                <FileText className="w-12 h-12 text-teal-300" />
                <div>
                  <p className="font-medium">{analysis.fileName}</p>
                  <p className="text-sm text-teal-200">Uploaded {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Readability Score */}
              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="mr-2" />
                  Readability
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Score</span>
                    <span className="font-bold">{analysis.detailedAnalysis.readability.score}%</span>
                  </div>
                  <div className="w-full bg-teal-900/30 rounded-full h-2">
                    <div 
                      className="bg-teal-400 h-2 rounded-full" 
                      style={{ width: `${analysis.detailedAnalysis.readability.score}%` }}
                    ></div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {analysis.detailedAnalysis.readability.feedback.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-teal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords Analysis */}
              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="mr-2" />
                  Keyword Match
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Score</span>
                    <span className="font-bold">{analysis.detailedAnalysis.keywords.score}%</span>
                  </div>
                  <div className="w-full bg-teal-900/30 rounded-full h-2">
                    <div 
                      className="bg-teal-400 h-2 rounded-full" 
                      style={{ width: `${analysis.detailedAnalysis.keywords.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Found Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.detailedAnalysis.keywords.found.map((keyword, index) => (
                        <span key={index} className="bg-teal-700/50 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.detailedAnalysis.keywords.missing.map((keyword, index) => (
                        <span key={index} className="bg-red-500/30 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience and Education */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BriefcaseBusiness className="mr-2" />
                  Experience Analysis
                </h3>
                <ul className="space-y-2">
                  {analysis.detailedAnalysis.experience.feedback.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-teal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="mr-2" />
                  Education Analysis
                </h3>
                <ul className="space-y-2">
                  {analysis.detailedAnalysis.education.feedback.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-teal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileCheck className="mr-2" />
                  Hard Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.hardSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-teal-700/50 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="mr-2" />
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-teal-700/50 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Verbs and Industry Keywords */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Impact Verbs Used</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.semanticAnalysis.impactVerbs.map((verb, index) => (
                    <span key={index} className="bg-teal-700/50 px-3 py-1 rounded-full text-sm">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Industry Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.semanticAnalysis.industryKeywords.map((keyword, index) => (
                    <span key={index} className="bg-teal-700/50 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="space-y-6 mb-8">
              <div className="bg-red-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Critical Improvements</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.critical.map((suggestion, index) => (
                    <li key={index} className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-500/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Improvements</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.recommended.map((suggestion, index) => (
                    <li key={index} className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-teal-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Optional Enhancements</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.optional.map((suggestion, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-teal-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-8 text-center">
              <button 
                onClick={handleDownloadReport}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <Download className="mr-2" />
                Download Detailed Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;