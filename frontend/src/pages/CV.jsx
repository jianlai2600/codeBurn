import React from "react";

function CV() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6">Yafei (Felix) Li</h1>
        <p className="text-center text-gray-600 mb-4">
          (979) 721-1676 | <a href="mailto:yafeili@tamu.edu" className="text-blue-600">yafeili@tamu.edu</a> |
          <a href="https://linkedin.com/in/yafei-li-felix" className="text-blue-600 ml-2">LinkedIn</a> |
          <a href="https://burncode-frontend-86c9eaa8c89d.herokuapp.com/CV" className="text-blue-600 ml-2">Portfolio</a>
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b pb-1 mb-3">Education</h2>
          <ul className="space-y-2">
            <li>
              <strong>Texas A&amp;M University</strong> (Aug. 2024 – May. 2026(Expected))<br />
              Master of Science in Computer Engineering | GPA: 4.0/4.0
            </li>
            <li>
              <strong>Wuhan University of Technology</strong> (Sep. 2021 – Jun. 2024)<br />
              Master of Science in Computer Science | GPA: 3.7/4.0
            </li>
            <li>
              <strong>Wuhan University of Technology</strong> (Sep. 2017 – Jun. 2021)<br />
              Bachelor of Engineering in Marine Engineering | GPA: 3.6/4.0
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b pb-1 mb-3">Technical Skills</h2>
          <ul>
            <li><strong>Languages:</strong> Java, Python, Node.js, Bootstrap, HTML, CSS, JavaScript</li>
            <li><strong>Technologies:</strong> Express, Redis, Kafka, ElasticSearch, MyBatis-Plus, RabbitMQ, Nginx</li>
            <li><strong>Concepts:</strong> RESTful APIs, Microservices, AOP, Asynchronous Messaging, CV, NLP</li>
            <li><strong>DB/Frameworks:</strong> SQL, MongoDB, DynamoDB, Spring Boot, React, Canal</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b pb-1 mb-3">Experience</h2>
          <div className="mb-4">
            <strong>Encando</strong> – Backend Development Intern (Oct. 2024 – Present)<br />
            <ul className="list-disc list-inside">
              <li>Built a Student Learning Platform using Next.js (frontend), FastAPI (backend)</li>
              <li>Implemented Google OAuth2.0, and DynamoDB for student stats (30% faster)</li>
              <li>Trained LLM to auto-generate quizzes and answer queries</li>
              <li>Used RAG with video transcripts to build knowledge graph (27% better answers)</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Wuhan University of Technology</strong> – Research Assistant (Jun. 2022 – Apr. 2024)<br />
            <ul className="list-disc list-inside">
              <li>Developed log anomaly detection model across systems using BiLSTM & Transformer</li>
              <li>Proposed CATL & CADA frameworks (accuracy improved by 3–5%)</li>
              <li>Accepted by CNSSE 2024 Conference</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Amazon</strong> – SDE Intern (May 2025 – Aug. 2025, Los Angeles)<br />
            <ul className="list-disc list-inside">
              <li>Worked on backend systems for internal tools, delivering scalable APIs with AWS</li>
              <li>Used DynamoDB, Lambda, and internal deployment systems for secure infrastructure</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b pb-1 mb-3">Projects</h2>
          <div className="mb-4">
            <strong>BurnCode: LeetCode Progress Tracker</strong> (Feb. 2024 – Apr. 2024)<br />
            <ul className="list-disc list-inside">
              <li>Built full-stack platform (React + Node.js) for solving & tracking 500+ problems</li>
              <li>Used Google OAuth + REST API for user login & problem submission</li>
              <li>Used DynamoDB for logs & RDS for metadata; Lambda + API Gateway for weather</li>
              <li>Deployed on Heroku with TailwindCSS, received 200+ visits in 1st month</li>
            </ul>
          </div>
          <div className="mb-4">
            <strong>Tech Community Platform</strong> (Jan. 2024 – Oct. 2024)<br />
            <ul className="list-disc list-inside">
              <li>Developed user/admin portals, login with semi-persistent QR code links</li>
              <li>Used RabbitMQ, Kafka, Redis for messaging, likes, and stats</li>
              <li>Improved throughput 50\%, reduced latency 30\%, query speed +45%</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CV;
