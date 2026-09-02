<?php

namespace Database\Seeders;

use App\Models\CareerApplication;
use App\Models\CareerPosition;
use Illuminate\Database\Seeder;

class CareerSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            [
                'title' => 'Senior Full-Stack Developer',
                'department' => 'Engineering',
                'location' => 'Remote / Bangalore',
                'type' => 'full-time',
                'description' => "We are looking for a Senior Full-Stack Developer to build and scale the platform that connects thousands of pet lovers across India. You will work with Laravel, React, Tailwind CSS, and Inertia.js.\n\nResponsibilities:\n- Architect and implement robust, clean features across our backend and frontend.\n- Collaborate closely with product managers and designer to craft premium experiences.\n- Optimize database queries and frontend performance.\n- Mentor junior developers and lead code reviews.",
                'requirements' => "- 5+ years of experience with PHP and Laravel.\n- 3+ years of experience with React and TypeScript.\n- Deep understanding of database optimization (MySQL/PostgreSQL).\n- Passion for clean code, automated testing, and developer experience.",
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'UI/UX Designer',
                'department' => 'Design',
                'location' => 'Remote / Mumbai',
                'type' => 'full-time',
                'description' => "Craft beautiful, intuitive experiences for our web and mobile platforms. Shape the visual identity of India's premium pet ecosystem.\n\nResponsibilities:\n- Conduct user research and design wireframes, user flows, and high-fidelity mockups.\n- Build design systems and UI tokens to be consumed across multiple web/mobile apps.\n- Work closely with engineering to ensure implementation matches designs exactly.",
                'requirements' => "- 3+ years of experience as a UI/UX designer, preferably in consumer apps.\n- Portfolio demonstrating strong visual design sense, typography, and motion design.\n- Expert in Figma and modern design tools.\n- Basic knowledge of HTML/CSS is a plus.",
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Veterinary Content Specialist',
                'department' => 'Content',
                'location' => 'Remote',
                'type' => 'full-time',
                'description' => "Create authoritative pet health content, guide our editorial voice, and ensure all medical information meets the highest standards of accuracy.\n\nResponsibilities:\n- Write and edit medical, wellness, and lifestyle articles for our Pet Journal.\n- Review breeder and directory guidelines to promote responsible pet ownership.\n- Host webinars and participate in community Q&A forums.",
                'requirements' => "- Degree in Veterinary Science (B.V.Sc & A.H) or related field.\n- Strong writing skills with the ability to translate complex medical terms into friendly copy.\n- 2+ years of experience in writing or editing medical content.",
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Community Manager',
                'department' => 'Marketing',
                'location' => 'Delhi NCR',
                'type' => 'full-time',
                'description' => "Grow and nurture our community of breeders, vets, trainers, and pet parents. Drive engagement across social platforms and events.\n\nResponsibilities:\n- Manage social media channels (Instagram, YouTube, Twitter).\n- Coordinate online and offline events, meetups, and dog shows.\n- Support and moderate community forums, resolving disputes with empathy.",
                'requirements' => "- 2+ years of experience in community management or social media.\n- Excellent communication skills and empathy.\n- Passion for dogs and understanding of the pet care ecosystem in India.",
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'QA & Testing Engineer',
                'department' => 'Engineering',
                'location' => 'Remote',
                'type' => 'contract',
                'description' => "Ensure platform quality through automated and manual testing. Build testing frameworks for our marketplace and directory features.\n\nResponsibilities:\n- Write end-to-end integration and unit tests.\n- Conduct regression testing before major releases.\n- Document and report bugs with clear replication steps.",
                'requirements' => "- 2+ years of experience in QA engineering.\n- Experience with test automation frameworks (Playwright, Cypress, or Selenium).\n- Familiarity with CI/CD pipelines.",
                'is_active' => false,
                'sort_order' => 5,
            ]
        ];

        $createdPositions = [];
        foreach ($positions as $pos) {
            $createdPositions[] = CareerPosition::create($pos);
        }

        // Applications
        $applications = [
            [
                'career_position_id' => $createdPositions[0]->id, // Senior Full-Stack
                'full_name' => 'Aarav Sharma',
                'email' => 'aarav.sharma@example.com',
                'phone' => '+91 9876543210',
                'cover_letter' => "I am an avid dog lover and a full-stack developer with 6 years of experience. I would love to build features for Woof Circle. My experience matches your stack perfectly.",
                'resume_path' => 'resumes/aarav_sharma_resume.pdf',
                'experience_years' => 6,
                'current_company' => 'TechSolutions India',
                'linkedin_url' => 'https://linkedin.com/in/aaravsharma',
                'portfolio_url' => 'https://aaravsharma.dev',
                'status' => 'pending',
                'admin_notes' => null,
            ],
            [
                'career_position_id' => $createdPositions[0]->id, // Senior Full-Stack
                'full_name' => 'Ananya Iyer',
                'email' => 'ananya.iyer@example.com',
                'phone' => '+91 9812345678',
                'cover_letter' => "I have been working with Laravel and React for 5 years. I own two golden retrievers and this job feels like the perfect intersection of my skills and my love for pets.",
                'resume_path' => 'resumes/ananya_iyer_resume.pdf',
                'experience_years' => 5,
                'current_company' => 'PetCare Innovations',
                'linkedin_url' => 'https://linkedin.com/in/ananyaiyer',
                'portfolio_url' => 'https://ananya.codes',
                'status' => 'shortlisted',
                'admin_notes' => 'Has relevant experience in pet tech. Good communication in screening.',
            ],
            [
                'career_position_id' => $createdPositions[1]->id, // UI/UX Designer
                'full_name' => 'Rohan Mehta',
                'email' => 'rohan.mehta@example.com',
                'phone' => '+91 9123456789',
                'cover_letter' => "I craft high-end visual designs and I love creating micro-animations. I noticed some UI improvements on Woof Circle that I would love to implement. Attached is my portfolio.",
                'resume_path' => 'resumes/rohan_mehta_resume.pdf',
                'experience_years' => 4,
                'current_company' => 'CreativeLabs',
                'linkedin_url' => 'https://linkedin.com/in/rohanmehta',
                'portfolio_url' => 'https://rohanmehta.design',
                'status' => 'reviewed',
                'admin_notes' => 'Strong design portfolio. Schedule a visual review.',
            ],
            [
                'career_position_id' => $createdPositions[2]->id, // Vet Content Specialist
                'full_name' => 'Dr. Priya Nair',
                'email' => 'priya.nair@example.com',
                'phone' => '+91 9988776655',
                'cover_letter' => "As a registered vet with 3 years of clinical practice and a passion for blogging, I want to help pet parents get accurate, evidence-based advice on Woof Circle.",
                'resume_path' => 'resumes/priya_nair_resume.pdf',
                'experience_years' => 3,
                'current_company' => 'Happy Paws Clinic',
                'linkedin_url' => 'https://linkedin.com/in/priyanair-vet',
                'portfolio_url' => null,
                'status' => 'pending',
                'admin_notes' => null,
            ],
            [
                'career_position_id' => $createdPositions[3]->id, // Community Manager
                'full_name' => 'Vikram Singh',
                'email' => 'vikram.singh@example.com',
                'phone' => '+91 9765432109',
                'cover_letter' => "I have 1 year of experience in managing communities. I am a cat parent and active on social media.",
                'resume_path' => 'resumes/vikram_singh_resume.pdf',
                'experience_years' => 1,
                'current_company' => 'SocialGrowth',
                'linkedin_url' => 'https://linkedin.com/in/vikramsingh',
                'portfolio_url' => null,
                'status' => 'rejected',
                'admin_notes' => 'Experience too junior for Delhi lead role. Keep on file for assistant roles.',
            ],
        ];

        foreach ($applications as $app) {
            CareerApplication::create($app);
        }
    }
}
