import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, Github, Linkedin, Mail, Phone, MapPin, Code,
  Globe, Palette, Smartphone, Sun, Moon, Database, Cpu,
  GitBranch, Cloud, Home, User, Folder, ArrowRight, Sparkles, BookOpen, Layers, Zap
} from 'lucide-react';

// Componente reutilizable para la navegación
const NavItem = ({ section, activeSection, setActiveSection, activeHover }) => {
  const isActive = activeSection === section.id;
  const isHovered = activeHover === section.id;

  return (
    <button
      key={section.id}
      data-section={section.id}
      onClick={() => setActiveSection(section.id)}
      className={`relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center group
        ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className={`transition-all duration-300 ${isHovered ? 'scale-125 text-purple-300' : 'scale-100'}`}>
          {section.icon}
        </span>
        <span>{section.label}</span>
      </span>
      {/* Efecto de borde y sombra al hacer hover/activo */}
      <div
        className={`absolute inset-0 border rounded-xl pointer-events-none transition-all duration-500
          ${isHovered ? 'border-purple-400 opacity-100' : 'border-purple-400 opacity-0'}`}
        style={{
          boxShadow: isHovered ? '0 0 15px rgba(192, 132, 252, 0.5)' : 'none'
        }}
      ></div>
    </button>
  );
};

// Componente para los iconos de contacto
const ContactLink = ({ icon, label, value, href, onlyIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 bg-gray-800/60 rounded-xl p-5 hover:bg-purple-700/80 hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-700/40 cursor-pointer"
    aria-label={label}
  >
    {icon}
    {!onlyIcon && (
      <div className="flex flex-col">
        <span className="text-sm text-gray-400 font-semibold tracking-wide">{label}</span>
        <span className="text-lg text-white font-medium truncate">
          {value}
        </span>
      </div>
    )}
  </a>
);

function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [filter, setFilter] = useState('all');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);
  const [activeHover, setActiveHover] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const homeRef = useRef(null);

  // Estado y ref para el fondo de nodos dinámicos
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0, radius: 200 });

  // Datos del perfil obtenidos del CV
  const profileData = {
    name: "ROGER MUNEVAR",
    title: "Software Engineering Student & AI Developer",
    about: "I am a Software Engineering student with a strong interest in developing innovative technological solutions. My goal is to apply my skills in programming, system design, and agile methodologies to contribute to the creation of high-quality software. I am seeking an opportunity in a dynamic environment where I can continue learning, collaborate on real projects, and develop effective solutions that optimize user experience and improve operational efficiency. I am committed to professional growth and acquiring new skills within the field of software engineering.",
    email: "rogermunevar@hotmail.com",
    phone: "+1 (214) 744-5695",
    linkedin: "https://www.linkedin.com/in/roger-munevar-454854235/",
    github: "https://github.com/RogerMunevar",
    location: "Hollywood, FL, USA"
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Manejo del movimiento del cursor y hover en la navegación
  const handleMouseMove = useCallback((e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    // Actualiza la posición del ratón para el canvas
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;

    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const isInNav = (
        e.clientX >= navRect.left &&
        e.clientX <= navRect.right &&
        e.clientY >= navRect.top &&
        e.clientY <= navRect.bottom
      );

      if (isInNav) {
        const navItems = navRef.current.querySelectorAll('button[data-section]');
        let hoveredSection = null;
        navItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const isHovered = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          );

          if (isHovered) {
            hoveredSection = item.dataset.section;
          }
        });
        setActiveHover(hoveredSection);
      } else {
        setActiveHover(null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Lógica del Canvas para el fondo de nodos/partículas
  useEffect(() => {
    if (activeSection !== 'home') {
      cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpi = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpi;
      canvas.height = height * dpi;
      ctx.scale(dpi, dpi);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.history = [{x: this.x, y: this.y}];
      }

      draw() {
        ctx.fillStyle = 'rgba(192, 132, 252, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(192, 132, 252, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for(let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.stroke();
      }

      update() {
        let dx = mouse.current.x - this.x;
        let dy = mouse.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.current.radius;
        let inversePower = (maxDistance / distance);

        if (distance < mouse.current.radius) {
          let pushX = forceDirectionX * inversePower * this.density * 0.8;
          let pushY = forceDirectionY * inversePower * this.density * 0.8;
          this.x -= pushX;
          this.y -= pushY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
        
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > 10) {
            this.history.shift();
        }
      }
    }

    const init = () => {
      particles.current = [];
      let numberOfParticles = (width * height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        particles.current.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < particles.current.length; i++) {
        particles.current[i].update();
        particles.current[i].draw();

        for (let j = i; j < particles.current.length; j++) {
          let p1 = particles.current[i];
          let p2 = particles.current[j];
          let dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

          if (dist < 100) {
            ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 - (dist / 100) * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [activeSection]); // Depende de activeSection para iniciar/detener


  // Manejo del scroll para el botón "Volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const sections = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Folder className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const projects = [
    {
      title: 'AI & Cloud Full Stack Web Applications',
      description: 'Developed full-stack web applications using React, Node.js, Express, and MongoDB. Designed and implemented RESTful APIs and GraphQL services. Created AI-powered features including predictive analytics and natural language processing. Managed cloud infrastructure on AWS and Google Cloud Platform. Implemented containerization with Docker and Kubernetes, and established CI/CD pipelines using GitHub Actions and AWS CodePipeline.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'TensorFlow', 'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'GitHub Actions', 'RESTful APIs', 'GraphQL'],
      category: 'ai_cloud_web',
      demo: 'http://electraserve.net',
    },
    {
      title: 'AI-Powered Virtual Chat System for E-commerce',
      description: 'Developed an interactive AI-powered virtual chat system as part of an e-commerce platform for custom felt products. Used HTML, CSS, JavaScript, PHP, and MySQL for full stack development, applying OOP principles and integrating SEO best practices. The AI system leveraged natural language processing to understand user intent, deliver personalized responses, and recommend products based on customer interactions.',
      tech: ['PHP', 'JavaScript', 'HTML', 'CSS', 'MySQL', 'Laravel', 'Bootstrap', 'AJAX', 'OOP', 'SEO', 'Git', 'NLP'],
      category: 'ai_web',
      demo: 'https://www.funifelt.com',
    },
    {
      title: 'Virtual Medical Assistant with NLP',
      description: 'Developed a virtual medical assistant capable of analyzing symptoms and generating potential diagnoses using Natural Language Processing (NLP). Built with Java (SpringBoot) for backend services and Python (TensorFlow/NLTK) for NLP model training, while integrating both SQL (MySQL) and NoSQL (MongoDB) databases. Created an interactive front-end with React and TypeScript, and optimized performance-critical components using C++. Deployed the solution on Google Cloud for scalability.',
      tech: ['Java', 'SpringBoot', 'Python', 'TensorFlow', 'NLTK', 'MySQL', 'MongoDB', 'React', 'TypeScript', 'C++', 'Google Cloud', 'NLP'],
      category: 'ai',
      demo: 'https://ehr.meditech.com/meditech-ehr-solutions',
    },
      {
      title: 'NetSuite ERP & CRM Configuration (Aurora Commerce)',
      description: 'Led and contributed to NetSuite implementation and configuration projects. Configured ERP and CRM modules for a mid-sized e-commerce company. Customized workflows and developed SuiteScripts to automate the order-to-cash process, integrated NetSuite with third-party web applications using RESTful APIs, customized dashboards and reports for finance and sales teams to enhance visibility and performance tracking.',
      tech: ['JavaScript', 'NetSuite', 'SQL', 'SuiteScript', 'SuiteTalk (SOAP & REST)', 'SuiteFlow', 'SuiteAnalytics', 'HTML/CSS', 'Postman', 'Git'],
      category: 'erp',
      demo: 'https://www.auroracommerce.com',
    },
    {
      title: 'NetSuite Integration Specialist (Nova Logistics)',
      description: 'Worked on the customization and integration of NetSuite for a rapidly growing logistics company, focusing on streamlining operations and inventory management. Developed SuiteScripts to automate inventory and shipping workflows, integrated NetSuite with WMS systems and third-party logistics platforms via REST and SOAP APIs, and customized the procure-to-pay workflow. Built dashboards and reports using SuiteAnalytics.',
      tech: ['JavaScript', 'SuiteScript 2.x', 'SQL', 'SuiteFlow', 'SuiteBuilder', 'SuiteTalk (SOAP)', 'SuiteAnalytics', 'Postman', 'Git', 'Dell Boomi'],
      category: 'erp',
      demo: 'https://novalogusa.com',
    },
  ];

  const skills = [
    {
      name: 'JavaScript (ES6+)',
      icon: <Code className="w-6 h-6" />,
      description: 'Proficient in modern JavaScript, including ES6+ features, asynchronous programming, and modular design. Experience in developing complex web applications.'
    },
    {
      name: 'Python (TensorFlow, NLTK)',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Strong capabilities in Python for AI/ML development, including data manipulation, machine learning model training with TensorFlow, and natural language processing with NLTK.'
    },
    {
      name: 'Java (Spring Boot)',
      icon: <Code className="w-6 h-6" />,
      description: 'Experienced in backend development with Java, specializing in Spring Boot for building robust, scalable, and secure RESTful APIs and microservices.'
    },
    {
      name: 'C# (.NET Core)',
      icon: <Code className="w-6 h-6" />,
      description: 'Solid understanding of C# and .NET Core for developing cross-platform applications, including web APIs and console applications, with an emphasis on performance.'
    },
    {
      name: 'React.js',
      icon: <Code className="w-6 h-6" />,
      description: 'Expert in building dynamic and responsive user interfaces with React.js, utilizing hooks, context API, and state management libraries like Redux for scalable front-ends.'
    },
    {
      name: 'Node.js',
      icon: <Code className="w-6 h-6" />,
      description: 'Skilled in server-side development with Node.js, creating efficient and high-performance backend systems, including REST APIs and real-time applications.'
    },
    {
      name: 'SQL (PostgreSQL, MySQL, SQL Server)',
      icon: <Database className="w-6 h-6" />,
      description: 'Adept at designing, optimizing, and querying relational databases, including PostgreSQL, MySQL, and SQL Server, ensuring data integrity and efficient retrieval.'
    },
    {
      name: 'Git (GitHub, Bitbucket)',
      icon: <GitBranch className="w-6 h-6" />,
      description: 'Proficient in version control using Git, managing complex codebases, collaborative development workflows, and branching strategies on platforms like GitHub and Bitbucket.'
    },
    {
      name: 'Google Cloud (App Engine, Cloud Functions)',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Experience in deploying and managing applications on Google Cloud Platform, utilizing services like App Engine for scalable web apps and Cloud Functions for serverless architectures.'
    },
    {
      name: 'AWS (EC2, S3, Lambda)',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Familiar with Amazon Web Services, including EC2 for virtual servers, S3 for scalable storage, and Lambda for event-driven serverless computing.'
    },
    {
      name: 'HTML/CSS (Tailwind CSS, SASS, Bootstrap)',
      icon: <Palette className="w-6 h-6" />,
      description: 'Highly skilled in creating semantic HTML and modern CSS, with expertise in frameworks like Tailwind CSS, preprocessors like SASS, and component libraries like Bootstrap for responsive designs.'
    },
    {
      name: 'Docker & Kubernetes',
      icon: <Layers className="w-6 h-6" />,
      description: 'Proficient in containerization with Docker for consistent development environments and orchestration with Kubernetes for managing large-scale containerized applications.'
    },
    {
      name: 'NetSuite (SuiteScript, SuiteTalk)',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Specialized in NetSuite customization and integration, developing SuiteScripts for business process automation and using SuiteTalk for API integrations.'
    },
    {
      name: 'NLP & Machine Learning',
      icon: <Zap className="w-6 h-6" />,
      description: 'Strong foundation in Natural Language Processing and Machine Learning, with practical experience in building intelligent systems for data analysis, prediction, and automation.'
    },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category.includes(filter));

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case 'home':
        return (
          <div ref={homeRef} className="home-section min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
            {/* Fondo de Nodos Conectados (Canvas) */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            
            {/* Efecto de Aurora Boreal / Degradado Animado */}
            <div className="absolute inset-0 z-0 aurora-overlay"></div>

            {/* Elementos HUD más pronunciados */}
            <div className="absolute top-8 left-8 text-purple-400 text-xs tracking-widest hud-terminal-text animate-hud-fade-in-bl">
              &gt; SYSTEM_STATUS: ONLINE<br/>
              &gt; CONNECTION_STABILITY: HIGH
            </div>
            <div className="absolute bottom-8 right-8 text-pink-400 text-xs tracking-widest hud-terminal-text animate-hud-fade-in-tr">
              [INITIATING_SEQUENCE_ALPHA_7]<br/>
              [PROCESSING_CORE_DATA]
            </div>

            {/* Contenedor de Contenido Principal */}
            <div
              className={`text-center text-white relative z-10 transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              } px-4`}
            >
              <div className="mb-8">
                {/* Avatar con efecto de Escaneo Continuo */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-purple-800 to-pink-800 dark:from-purple-950 dark:to-pink-950 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl md:text-8xl font-extrabold shadow-2xl overflow-hidden profile-avatar-scanner">
                  <span className="relative z-10 text-white glitch-text-initial scan-text-content">RM</span>
                  <div className="scanner-line"></div>
                  <div className="glitch-scanner-overlay"></div>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-4 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-terminal-type" data-text={profileData.name}>
                  {profileData.name}
                </span>
              </h1>
              <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-gray-200 dark:text-gray-300 font-light tracking-wider max-w-4xl mx-auto neon-text-subtitle animate-terminal-type-subtitle" data-text={profileData.title}>
                {profileData.title}
              </p>
              <div className="max-w-4xl mx-auto px-4">
                <p className="text-lg md:text-xl mb-8 text-gray-300 dark:text-gray-400 leading-relaxed text-shadow-sm fade-in-text-delay">
                  {profileData.about}
                </p>
              </div>
              <button
                onClick={() => setActiveSection('about')}
                className="inline-flex items-center justify-center bg-white/10 dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-gray-700/50 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white/20 dark:hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300 shadow-lg glow-button-enhanced animate-button-appear"
                aria-label={`Learn more about ${profileData.name}`}
              >
                Learn more about me <ArrowRight className="ml-3 w-6 h-6" />
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
                About Me
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-center">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Who I Am</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    I am a Software Engineering student with a strong interest in developing innovative technological solutions. My goal is to apply my skills in programming, system design, and agile methodologies to contribute to the creation of high-quality software. I am seeking an opportunity in a dynamic environment where I can continue learning, collaborate on real projects, and develop effective solutions that optimize user experience and improve operational efficiency. I am committed to professional growth and acquiring new skills within the field of software engineering.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    I'm fluent in both Spanish (native) and English, and I'm constantly expanding my skills through certifications and hands-on projects.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <span className="bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full text-purple-600 dark:text-purple-400 font-medium">AI Development</span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full text-pink-600 dark:text-pink-400 font-medium">Full Stack</span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 font-medium">Cloud Computing</span>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  {/* Se puede reemplazar con una imagen de perfil real */}
                  <div className="w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl">
                    RM
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Education</h3>
              <div className="space-y-6 mb-12">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">BS in Software Engineering</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">Universidad Manuela Beltran</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      Jan 2019 – In course
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Currently completing my degree with focus on AI and full stack development.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Certifications</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Git and GitHub Professional (Netzun)
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Web Scrapping (Netzun)
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Introduction to the world of Google Cloud (Netzun)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Flutter Fundamentals (Netzun)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Basic Django Course (Netzun)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Kotlin: Basic-Intermediate (Netzun)
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      CCNAv7: Introduction to Networks (Cisco)
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Computer Security: computer forensics (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Advanced C Programming: Integrating C and Assembly Language (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Advanced Java Programming (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Advanced ASP .NET Web API 2.2 (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Advanced Python (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      Advanced Scrum (LinkedIn)
                    </li>
                      <li className="flex items-start">
                      <Sparkles className="text-purple-500 mr-2 w-4 h-4 flex-shrink-0" />
                      .NET Big Picture: Front-End and UI Development (LinkedIn)
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Experience</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">AI & Cloud Full Stack Developer</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">ElectraServe Inc</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      May 2024 – May 2025
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Developed full-stack web applications using React, Node.js, Express, and MongoDB. Designed and implemented RESTful APIs and GraphQL services for seamless system integration. Created AI-powered features including predictive analytics and natural language processing using Python and TensorFlow. Managed cloud infrastructure on AWS (EC2, Lambda, S3) and Google Cloud Platform. Implemented containerization with Docker and orchestration with Kubernetes for scalable deployments. Established CI/CD pipelines using GitHub Actions and AWS CodePipeline to automate deployment processes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      JavaScript (React, Node.js)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Python (TensorFlow)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      MongoDB
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      AWS
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Google Cloud
                    </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Docker
                    </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Kubernetes
                    </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      GitHub Actions
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">AI Product Engineer – Conversational Interfaces & SEO optimization</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">Funifelt</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      Nov 2023 – May 2024
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Developed an interactive AI-powered virtual chat system as part of an e-commerce platform for custom felt products. Used HTML, CSS, JavaScript, PHP, and MySQL for full stack development, applying OOP principles and integrating SEO best practices. Collaborated in agile teams, contributing to a scalable and user-friendly solution that enhanced customer engagement. Additionally, implemented real-time customer query handling and dynamic content delivery to improve user experience. Conducted usability testing and performance optimization to ensure seamless functionality across devices and browsers. The AI system leveraged natural language processing to understand user intent, deliver personalized responses, and recommend products based on customer interactions.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      PHP
                    </span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      JavaScript
                    </span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      HTML/CSS
                    </span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      MySQL
                    </span>
                      <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      Laravel
                    </span>
                      <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-3 py-1 rounded-full">
                      NLP (Basic algorithms)
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">ERP Solutions Engineer – NetSuite Functional Developer</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">Aurora Commerce</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      May 2023 – Nov 2023
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Led and contributed to multiple NetSuite implementation and configuration projects. Configured the ERP and CRM modules for a mid-sized e-commerce company ("Aurora Commerce"). Responsibilities included: Customizing workflows and developing SuiteScripts to automate the order-to-cash process, integrating NetSuite with third-party web applications using RESTful APIs, customizing dashboards and reports for finance and sales teams to enhance visibility and performance tracking.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      JavaScript
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      NetSuite
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      SQL
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      SuiteScript
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      RESTful APIs
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">NetSuite Integration Specialist</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">Nova Logistics</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      Nov 2022 – May 2023
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Worked on the customization and integration of NetSuite for a rapidly growing logistics company, focusing on streamlining operations and inventory management. Developed SuiteScripts to automate inventory and shipping workflows, integrated NetSuite with WMS systems and third-party logistics platforms via REST and SOAP APIs, and customized the procure-to-pay workflow. Built dashboards and reports using SuiteAnalytics.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      JavaScript
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      SuiteScript 2.x
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      SQL
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      SuiteTalk (SOAP)
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                      Dell Boomi
                    </span>
                  </div>
                </div>

                 <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">AI Developer – Junior NLP Engineer</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">MediTech AI Solutions</p>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      Jul 2022 – Nov 2022
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Developed a virtual medical assistant capable of analyzing symptoms and generating potential diagnoses using Natural Language Processing (NLP). Built with Java (SpringBoot) for backend services and Python (TensorFlow/NLTK) for NLP model training, while integrating both SQL (MySQL) and NoSQL (MongoDB) databases for comprehensive medical data. Created an interactive front-end with React and TypeScript, and optimized performance-critical components using C++. Deployed the solution on Google Cloud for scalability.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Java (SpringBoot)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Python (TensorFlow, NLTK)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      React.js
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      TypeScript
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      C++
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      SQL (MySQL)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      NoSQL (MongoDB)
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1 rounded-full">
                      Google Cloud
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
                My Projects
              </h2>

              <div className="mb-12 flex justify-center space-x-4 flex-wrap gap-y-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300
                    ${filter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('ai_cloud_web')}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300
                    ${filter === 'ai_cloud_web' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
                >
                  AI/Cloud/Web
                </button>
                <button
                  onClick={() => setFilter('ai')}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300
                    ${filter === 'ai' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
                >
                  AI
                </button>
                 <button
                  onClick={() => setFilter('erp')}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300
                    ${filter === 'erp' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
                >
                  ERP
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProjects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/60 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-purple-700/50 transform hover:scale-105 transition-all duration-300 group relative overflow-hidden project-card"
                  >
                    {/* Fondo futurista animado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0"></div>
                    <div className="absolute inset-0 border border-transparent rounded-xl pointer-events-none z-10 transition-all duration-300 project-border-glow"></div>


                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                {project.title}
                            </h3>
                            <div className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                                <Code className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-4 flex-grow">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((tech, techIndex) => (
                                <span
                                    key={techIndex}
                                    className="bg-purple-700/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-600/50 transition-colors duration-300 group-hover:bg-purple-600/50 group-hover:border-purple-400"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-purple-300 hover:text-purple-100 font-semibold transition-colors group-hover:underline mt-auto"
                            >
                                View Project <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
            {/* Fondo de patrón futurista */}
            <div className="absolute inset-0 z-0 opacity-10 background-pattern"></div>
            <style jsx>{`
              .background-pattern {
                background-image: radial-gradient(circle at center, rgba(147, 51, 234, 0.05) 1px, transparent 1px),
                                  radial-gradient(circle at center, rgba(219, 39, 119, 0.05) 1px, transparent 1px);
                background-size: 40px 40px;
                animation: animatePattern 20s linear infinite;
              }
              @keyframes animatePattern {
                from { background-position: 0 0; }
                to { background-position: 400px 400px; }
              }
            `}</style>

            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12 text-center">
                My Core Programming Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/70 backdrop-filter backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-purple-700/50 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden skill-card"
                  >
                    {/* Efecto de borde brillante y "aura" al hacer hover */}
                    <div className="absolute inset-0 border border-transparent rounded-xl pointer-events-none z-10 transition-all duration-300 skill-border-glow"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0"></div>

                    <div className="relative z-20 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="text-purple-400 group-hover:text-pink-300 mr-4 flex-shrink-0 transition-colors duration-300">
                          {skill.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                          {skill.name}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12 text-center">
                Get in Touch
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <ContactLink
                  icon={<Mail className="w-8 h-8 text-purple-400" />}
                  label="Email Me"
                  value={profileData.email}
                  href={`mailto:${profileData.email}`}
                />
                <ContactLink
                  icon={<Phone className="w-8 h-8 text-purple-400" />}
                  label="Call Me"
                  value={profileData.phone}
                  href={`tel:${profileData.phone.replace(/\s/g, '')}`}
                />
                <ContactLink
                  icon={<Linkedin className="w-8 h-8 text-purple-400" />}
                  label="LinkedIn"
                  value="Roger Munevar"
                  href={profileData.linkedin}
                />
                <ContactLink
                  icon={<Github className="w-8 h-8 text-purple-400" />}
                  label="GitHub"
                  value="Roger Munevar"
                  href={profileData.github}
                />
                <ContactLink
                  icon={<MapPin className="w-8 h-8 text-purple-400" />}
                  label="Location"
                  value={profileData.location}
                  href="#"
                />
              </div>

              {/* Formulario de Contacto (opcional, necesitaría backend) - ELIMINADO */}
              {/* <div className="bg-gray-800/60 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-purple-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Send a Message</h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      rows="5"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div> */}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [activeSection, isVisible, filter, filteredProjects, skills, profileData]);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 font-sans relative">
      {/* Styles for Home section animations */}
      <style>{`
        /* Efecto Aurora Boreal / Degradado Animado */
        .aurora-overlay {
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(219, 39, 119, 0.1) 25%, rgba(147, 51, 234, 0.1) 50%, rgba(219, 39, 119, 0.1) 75%, rgba(147, 51, 234, 0.1) 100%);
          background-size: 400% 400%;
          animation: aurora-movement 30s ease infinite alternate;
          mix-blend-mode: screen;
        }

        @keyframes aurora-movement {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }

        .hud-terminal-text {
          font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
          opacity: 0;
          animation: fadeIn 1.5s ease-out forwards;
        }
        .animate-hud-fade-in-bl { animation-delay: 1.5s; }
        .animate-hud-fade-in-tr { animation-delay: 1.8s; }

        .profile-avatar-scanner {
          position: relative;
          overflow: hidden;
          border: 3px solid rgba(168, 85, 247, 0.7);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(219, 39, 119, 0.6);
          animation: avatar-pulse 4s infinite ease-in-out alternate;
        }

        @keyframes avatar-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(219, 39, 119, 0.6); }
          50% { transform: scale(1.02); box-shadow: 0 0 50px rgba(168, 85, 247, 1), 0 0 100px rgba(219, 39, 119, 0.8); }
        }

        .profile-avatar-scanner .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, transparent, #00f0ff, transparent);
          animation: scanner-line-anim 3s infinite linear;
          transform-origin: left;
          opacity: 0.9;
          box-shadow: 0 0 20px #00f0ff;
        }

        @keyframes scanner-line-anim {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        .glitch-scanner-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          animation: continuous-glitch 5s infinite linear alternate;
          background: rgba(0,0,0,0.1);
        }

        @keyframes continuous-glitch {
          0%, 100% {
            clip: rect(0, 9999px, 9999px, 0);
            transform: skewX(0deg);
          }
          1% { clip: rect(10px, 9999px, 15px, 0); transform: skewX(0.5deg); }
          3% { clip: rect(30px, 9999px, 35px, 0); transform: skewX(-0.5deg); }
          5% { clip: rect(50px, 9999px, 55px, 0); transform: skewX(0.2deg); }
          7% { clip: rect(70px, 9999px, 75px, 0); transform: skewX(-0.2deg); }
          10% { clip: rect(90px, 9999px, 95px, 0); transform: skewX(0.1deg); }
          12% { clip: rect(110px, 9999px, 115px, 0); transform: skewX(-0.1deg); }
          15% { clip: rect(130px, 9999px, 135px, 0); transform: skewX(0.3deg); }
          18% { clip: rect(150px, 9999px, 155px, 0); transform: skewX(-0.3deg); }
          20% { clip: rect(170px, 9999px, 175px, 0); transform: skewX(0.4deg); }
          22% { clip: rect(190px, 9999px, 195px, 0); transform: skewX(-0.4deg); }
          25% { clip: rect(210px, 9999px, 215px, 0); transform: skewX(0.1deg); }
          30% { clip: rect(10px, 9999px, 15px, 0); transform: skewX(0.5deg); }
          33% { clip: rect(30px, 9999px, 35px, 0); transform: skewX(-0.5deg); }
          35% { clip: rect(50px, 9999px, 55px, 0); transform: skewX(0.2deg); }
          37% { clip: rect(70px, 9999px, 75px, 0); transform: skewX(-0.2deg); }
          40% { clip: rect(90px, 9999px, 95px, 0); transform: skewX(0.1deg); }
          42% { clip: rect(110px, 9999px, 115px, 0); transform: skewX(-0.1deg); }
          45% { clip: rect(130px, 9999px, 135px, 0); transform: skewX(0.3deg); }
          48% { clip: rect(150px, 9999px, 155px, 0); transform: skewX(-0.3deg); }
          50% { clip: rect(170px, 9999px, 175px, 0); transform: skewX(0.4deg); }
          52% { clip: rect(190px, 9999px, 195px, 0); transform: skewX(-0.4deg); }
          55% { clip: rect(210px, 9999px, 215px, 0); transform: skewX(0.1deg); }
        }

        .animate-terminal-type {
          animation: terminal-type 2s steps(20, end) forwards, glitch-text 0.5s infinite alternate;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          width: 0;
          animation-fill-mode: forwards;
        }

        @keyframes terminal-type {
          from { width: 0; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
        
        @keyframes glitch-text {
          0% { transform: translate(0, 0); filter: blur(0); }
          20% { transform: translate(-2px, 2px); filter: blur(0.5px); }
          40% { transform: translate(-2px, -2px); filter: blur(0); }
          60% { transform: translate(3px, 0px); filter: blur(0.5px); }
          80% { transform: translate(2px, -2px); filter: blur(0); }
          100% { transform: translate(0, 0); filter: blur(0); }
        }

        .animate-terminal-type-subtitle {
          animation: terminal-type-subtitle 2.5s steps(30, end) forwards, glitch-text-subtle 0.8s infinite alternate;
          animation-delay: 0.5s;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          width: 0;
          animation-fill-mode: forwards;
        }

        @keyframes terminal-type-subtitle {
          from { width: 0; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
        @keyframes glitch-text-subtle {
          0% { transform: translate(0, 0); opacity: 1; }
          30% { transform: translate(1px, -1px); opacity: 0.9; }
          70% { transform: translate(-1px, 1px); opacity: 0.95; }
          100% { transform: translate(0, 0); opacity: 1; }
        }

        .fade-in-text-delay {
          animation: fadeIn 2s ease-out forwards;
          opacity: 0;
          animation-delay: 2s;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .glow-button-enhanced {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(219, 39, 119, 0.3);
          transition: all 0.4s ease-in-out;
        }
        .glow-button-enhanced:hover {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(219, 39, 119, 0.5), 0 0 60px rgba(168, 85, 247, 0.3);
          transform: scale(1.08);
        }
        .animate-button-appear {
          animation: fadeIn 1.5s ease-out forwards;
          opacity: 0;
          animation-delay: 3s;
        }

        /* Project Card Styles */
        .project-card:hover .project-border-glow {
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.7), 0 0 50px rgba(219, 39, 119, 0.4);
          border-color: rgba(168, 85, 247, 0.8);
        }
        .project-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(192, 132, 252, 0.3) 10%, transparent 20%, transparent 80%, rgba(219, 39, 119, 0.3) 90%, transparent 100%);
          border-radius: inherit;
          animation: rotateBorder 8s linear infinite;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          z-index: 0;
        }
        .project-card:hover::before {
          opacity: 1;
        }

        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Skill Card Styles */
        .skill-card:hover .skill-border-glow {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(219, 39, 119, 0.3);
          border-color: rgba(168, 85, 247, 0.8);
        }
        .skill-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(192, 132, 252, 0.2) 10%, transparent 20%, transparent 80%, rgba(219, 39, 119, 0.2) 90%, transparent 100%);
          border-radius: inherit;
          animation: rotateBorderSkill 6s linear infinite;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          z-index: 0;
        }
        .skill-card:hover::before {
          opacity: 1;
        }

        @keyframes rotateBorderSkill {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Cursor Personalizado */
        @keyframes cursor-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
        }
      `}</style>

      {/* Cursor personalizado mejorado */}
      <div
        className="hidden md:block fixed z-50 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-50%, -50%) scale(1)',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          backgroundColor: 'rgba(192, 132, 252, 0.5)',
          boxShadow: '0 0 25px rgba(192, 132, 252, 1), 0 0 50px rgba(219, 39, 119, 0.8)',
          mixBlendMode: 'screen',
          filter: 'blur(7px)',
          animation: 'cursor-pulse 2s infinite alternate',
        }}
      ></div>

      {/* Navegación Fija */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-filter backdrop-blur-lg shadow-xl border-b border-purple-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mr-4">
              RM
            </span>
          </div>

          {/* Menú de escritorio */}
          <div className="hidden md:flex space-x-6">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                section={section}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                activeHover={activeHover}
              />
            ))}
          </div>

          {/* Toggle Dark Mode y Botón de Menú Móvil */}
          <div className="flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 transition-colors mr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-900/90 backdrop-filter backdrop-blur-lg py-2`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${activeSection === section.id
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {renderSection()}
      </main>

      {/* Botón de volver arriba */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowRight className="w-6 h-6 rotate-[-90deg]" />
        </button>
      )}

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-purple-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Roger Munevar. All rights reserved.</p>
          <p className="mt-2">
            Built with <span className="text-pink-500">&hearts;</span> using React, Tailwind CSS, and Lucide Icons.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio; 