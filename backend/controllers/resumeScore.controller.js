import ResumeScore from "../models/resumeScore.model.js";
import ApplicationModel from "../models/application.model.js";
import UserModel from "../models/user.model.js";
import JobModel from "../models/job.model.js";
import dotenv from 'dotenv';

dotenv.config();

// Simulated AI resume scoring function
const calculateResumeScore = async (resume, job) => {
  // In a real implementation, this would call an AI service (e.g., via API)
  // For now, simulate a score based on keyword matching
  const jobKeywords = [...job.skills, job.role, job.experienceLevel].map(k => k.toLowerCase());
  const resumeText = resume.toLowerCase(); // Assume resume is a URL; in reality, you'd fetch and parse the PDF
  let matchCount = 0;

  jobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matchCount++;
    }
  });

  const score = Math.min(100, (matchCount / jobKeywords.length) * 100);
  const details = `Matched ${matchCount} out of ${jobKeywords.length} keywords: ${jobKeywords.join(', ')}`;

  return { score: Math.round(score), details };
};


export const createResumeScore = async (req, res) => {
  try {
    const { applicationId } = req.body;

    const application = await ApplicationModel.findById(applicationId)
      .populate('job')
      .populate('user');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiterId.toString() !== req.recruiter._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to generate a score for this application' });
    }

   
    const existingScore = await ResumeScore.findOne({ application: applicationId });
    if (existingScore) {
      return res.status(400).json({ message: 'A resume score already exists for this application', resumeScore: existingScore });
    }

    
    const resume = application.user.resume; // URL or path to the resume
    const job = application.job;

    
    const { score, details } = await calculateResumeScore(resume, job);

    const resumeScore = new ResumeScore({
      application: applicationId,
      score,
      details,
    });

    await resumeScore.save();
    res.status(201).json({ message: 'Resume score created successfully', resumeScore });
  } catch (error) {
    console.error('Error creating resume score:', error);
    res.status(500).json({ message: 'Failed to create resume score', error: error.message });
  }
};


export const generateResumeScoreForApplication = async (applicationId) => {
  try {
    const application = await ApplicationModel.findById(applicationId)
      .populate('job')
      .populate('user');
    if (!application) {
      throw new Error('Application not found');
    }

    
    const existingScore = await ResumeScore.findOne({ application: applicationId });
    if (existingScore) {
      return existingScore;
    }

    const resume = application.user.resume;
    const job = application.job;

    const { score, details } = await calculateResumeScore(resume, job);

    const resumeScore = new ResumeScore({
      application: applicationId,
      score,
      details,
    });

    await resumeScore.save();
    return resumeScore;
  } catch (error) {
    console.error('Error generating resume score:', error);
    throw error;
  }
};

export const getResumeScoreByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    
    const job = await JobModel.findById(application.job);
    const isUser = req.user && application.user.toString() === req.user._id.toString();
    const isRecruiter = req.recruiter && job.recruiterId.toString() === req.recruiter._id.toString();
    if (!isUser && !isRecruiter) {
      return res.status(403).json({ message: 'Unauthorized to view this resume score' });
    }

    const resumeScore = await ResumeScore.findOne({ application: applicationId });
    if (!resumeScore) {
      return res.status(404).json({ message: 'Resume score not found' });
    }

    res.status(200).json({ message: 'Resume score retrieved successfully', resumeScore });
  } catch (error) {
    console.error('Error retrieving resume score:', error);
    res.status(500).json({ message: 'Failed to retrieve resume score', error: error.message });
  }
};
