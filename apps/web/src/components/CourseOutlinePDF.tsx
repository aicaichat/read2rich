import React from 'react';
import { jsPDF } from 'jspdf';
import Button from './ui/Button';
import { Download } from 'lucide-react';

interface WeekModule {
  week: number;
  title: string;
  subtitle: string;
  duration: string;
  topics: string[];
  deliverables: string[];
  highlight: string;
}

interface InstructorProfile {
  name: string;
  title: string;
  background: string[];
  expertise: string[];
  achievements: string[];
}

interface CourseOutlinePDFProps {
  weekModules: WeekModule[];
  instructors: InstructorProfile[];
}

const CourseOutlinePDF: React.FC<CourseOutlinePDFProps> = ({ weekModules, instructors }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    let yPosition = 20;
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129);
    doc.text('AI Application Innovation Course', 105, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('6-Week Complete Entrepreneurship Training Camp', 105, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    // Course Overview
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Course Overview', 20, yPosition);
    
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const overviewText = [
      'This course is designed for entrepreneurs and students in the AI era.',
      'Through 6 weeks of systematic training, you will master the complete',
      'skills from demand discovery to product launch to commercialization.',
      'The course combines theoretical learning and practical projects.'
    ];
    
    overviewText.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Learning Objectives
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Learning Objectives', 20, yPosition);
    
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const objectives = [
      '• Master AI era demand identification and validation methods',
      '• Proficient in Prompt engineering and API integration',
      '• Learn to design sustainable business models',
      '• Establish data-driven growth systems',
      '• Complete AI product development from 0 to 1'
    ];
    
    objectives.forEach(objective => {
      doc.text(objective, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 15;
    
    // Course Outline
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Course Outline', 20, yPosition);
    
    yPosition += 10;
    
    // Weekly Modules
    weekModules.forEach((module, index) => {
      // Check if new page needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Week title
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`Week ${module.week}: ${module.title}`, 20, yPosition);
      
      yPosition += 8;
      
      // Subtitle and duration
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`${module.subtitle} (${module.duration})`, 20, yPosition);
      
      yPosition += 8;
      
      // Highlight
      doc.setTextColor(239, 68, 68);
      doc.text(`Key Point: ${module.highlight}`, 20, yPosition);
      
      yPosition += 8;
      
      // Learning topics
      doc.setTextColor(60, 60, 60);
      doc.text('Learning Topics:', 20, yPosition);
      yPosition += 6;
      
      module.topics.forEach(topic => {
        doc.text(`• ${topic}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
      
      // Deliverables
      doc.text('Deliverables:', 20, yPosition);
      yPosition += 6;
      
      module.deliverables.forEach(deliverable => {
        doc.text(`• ${deliverable}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 10;
    });
    
    // New page - Instructor Team
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Instructor Team', 20, yPosition);
    
    yPosition += 15;
    
    instructors.forEach((instructor, index) => {
      // Check if new page needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Instructor name and title
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(instructor.name, 20, yPosition);
      
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(instructor.title, 20, yPosition);
      
      yPosition += 10;
      
      // Background
      doc.setTextColor(60, 60, 60);
      doc.text('Background:', 20, yPosition);
      yPosition += 6;
      
      instructor.background.forEach(bg => {
        doc.text(`• ${bg}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
      
      // Expertise
      doc.text('Expertise:', 20, yPosition);
      yPosition += 6;
      
      instructor.expertise.forEach(exp => {
        doc.text(`• ${exp}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
      
      // Achievements
      doc.text('Key Achievements:', 20, yPosition);
      yPosition += 6;
      
      instructor.achievements.forEach(achievement => {
        doc.text(`• ${achievement}`, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 15;
    });
    
    // New page - Course Features
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Course Features', 20, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    const features = [
      '🎯 Practical Oriented: Each lesson has specific project practice',
      '🚀 Quick Results: Complete development from idea to product in 6 weeks',
      '💡 Expert Guidance: Hands-on teaching by experts from top tech companies',
      '📊 Data Driven: Establish complete monitoring and optimization system',
      '🤝 Community Support: Join entrepreneur community for ongoing support',
      '💰 Business Validation: Validate commercial feasibility through real user feedback'
    ];
    
    features.forEach(feature => {
      doc.text(feature, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 15;
    
    // Target Audience
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Target Audience', 20, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    const audiences = [
      '👨‍🎓 Students: Want to transform technology into commercial value',
      '💼 Entrepreneurs: Hope to quickly validate ideas and build MVP',
      '👨‍💻 Developers: Want to master AI product development skills',
      '📈 Product Managers: Hope to understand AI product design and growth',
      '🎯 Investors: Want to understand AI entrepreneurship trends'
    ];
    
    audiences.forEach(audience => {
      doc.text(audience, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 15;
    
    // Contact Information
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Contact Us', 20, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Official Website: ${window.location.origin}`, 20, yPosition);
    yPosition += 8;
    doc.text('Course Consultation: Scan QR code or visit website for more details', 20, yPosition);
    
    // Save PDF
    doc.save('AI_Application_Innovation_Course_Outline.pdf');
  };

  return (
    <Button
      onClick={generatePDF}
      variant="secondary"
      size="lg"
      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
    >
      <Download className="w-5 h-5" />
      Download Course Outline PDF
    </Button>
  );
};

export default CourseOutlinePDF; 